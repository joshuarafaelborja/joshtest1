import { useState, useEffect, useCallback } from 'react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { SplitScreenLayout } from '@/components/SplitScreenLayout';
import { SocialScreen } from '@/components/SocialScreen';
import { LogEntryForm } from '@/components/LogEntryForm';
import { ExerciseHistory } from '@/components/ExerciseHistory';
import { RepRangeModal } from '@/components/RepRangeModal';
import { RecommendationModal } from '@/components/RecommendationModal';
import { ProgressNotification } from '@/components/ProgressNotification';
import { AuthModal } from '@/components/AuthModal';
import { MigrationModal } from '@/components/MigrationModal';
import { useAuth } from '@/hooks/useAuth';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { getLocalWorkoutCount, clearLocalWorkouts, addWorkout, getWorkouts } from '@/lib/workoutService';
import { supabase } from '@/integrations/supabase/client';
import { PreviousExercise } from '@/hooks/usePreviousExercises';
import { toast } from 'sonner';
import { 
  AppData, 
  Exercise, 
  ExerciseLog, 
  RecommendationResult 
} from '@/lib/types';
import {
  loadData,
  saveData,
  getExerciseByName,
  addExercise,
  addLogToExercise,
  markOnboardingComplete,
  generateId,
} from '@/lib/storage';
import { analyzePerformance } from '@/lib/recommendations';

type Screen = 'onboarding' | 'home' | 'log' | 'history' | 'social';

interface PendingLog {
  exerciseName: string;
  weight: number;
  unit: 'lbs' | 'kg';
  reps: number;
  rir: number | null;
}

export default function Index() {
  const [data, setData] = useState<AppData>(loadData);
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showRepRangeModal, setShowRepRangeModal] = useState(false);
  const [pendingLog, setPendingLog] = useState<PendingLog | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [notification, setNotification] = useState<RecommendationResult | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [localWorkoutCount, setLocalWorkoutCount] = useState(0);
  const [aiRecommendation, setAiRecommendation] = useState<{ message: string; type: string; suggestedWeight?: number } | null>(null);
  const [loadingAiRec, setLoadingAiRec] = useState(false);

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { postActivity } = useActivityFeed();

  // Check if onboarding should show
  useEffect(() => {
    if (!data.userPreferences.hasCompletedOnboarding) {
      setScreen('onboarding');
    }
  }, []);

  // Reload data when auth state changes (login/logout)
  useEffect(() => {
    if (!authLoading) {
      // Reload data from appropriate source (localStorage or fresh state)
      const freshData = loadData();
      setData(freshData);
    }
  }, [authLoading, isAuthenticated]);

  // Check for migration when user authenticates
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const count = getLocalWorkoutCount();
      if (count > 0) {
        setLocalWorkoutCount(count);
        setShowMigrationModal(true);
      }
    }
  }, [authLoading, isAuthenticated, user]);

  // Save data whenever it changes
  const updateData = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const handleOnboardingComplete = (userName?: string) => {
    const newData = markOnboardingComplete(data, userName);
    updateData(newData);
    setScreen('home');
  };

  const handleOnboardingSkip = () => {
    const newData = markOnboardingComplete(data);
    updateData(newData);
    setScreen('home');
  };

  const fetchAiRecommendation = async (exerciseName: string, goalMinReps: number, goalMaxReps: number) => {
    setLoadingAiRec(true);
    try {
      // Fetch recent sessions for this exercise from the workouts table
      const allWorkouts = await getWorkouts();
      const exerciseSessions = allWorkouts
        .filter(w => w.exercise_name.toLowerCase() === exerciseName.toLowerCase())
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      if (exerciseSessions.length < 4) {
        setLoadingAiRec(false);
        return;
      }

      const { data: fnData, error } = await supabase.functions.invoke('progression-recommendation', {
        body: {
          exerciseName,
          sessions: exerciseSessions.map(s => ({
            weight: s.weight,
            unit: s.unit,
            reps: s.reps,
            rir: s.rir ?? null,
            sets: s.sets,
            timestamp: s.timestamp,
            goal_min_reps: s.goal_min_reps,
            goal_max_reps: s.goal_max_reps,
          })),
          goalMinReps,
          goalMaxReps,
        },
      });

      if (error) {
        console.error('AI recommendation error:', error);
        toast.error('Could not get AI recommendation');
      } else if (fnData) {
        setAiRecommendation(fnData);
        // Show AI recommendation as the modal instead of the default one
        setRecommendation({
          type: fnData.type === 'increase' ? 'progressive_overload' : fnData.type === 'decrease' ? 'acute_deload' : 'maintain',
          icon: fnData.type === 'increase' ? '🚀' : fnData.type === 'decrease' ? '⚠️' : '✅',
          headline: fnData.type === 'increase' ? 'Time to level up!' : fnData.type === 'decrease' ? 'Let\'s adjust' : 'Holding steady',
          message: fnData.message,
          suggestedWeight: fnData.suggestedWeight,
        });
      }
    } catch (e) {
      console.error('AI recommendation error:', e);
    } finally {
      setLoadingAiRec(false);
    }
  };

  const handleLogEntry = (exerciseName: string, weight: number, unit: 'lbs' | 'kg', reps: number, rir: number | null = null) => {
    const existingExercise = getExerciseByName(data, exerciseName);

    if (!existingExercise) {
      // New exercise - show rep range modal
      setPendingLog({ exerciseName, weight, unit, reps, rir });
      setShowRepRangeModal(true);
      return;
    }

    // Existing exercise - create log and analyze
    completeLog(existingExercise, weight, unit, reps, rir);
  };

  const handleRepRangeSave = (minReps: number, goalReps: number) => {
    if (!pendingLog) return;

    // Create new exercise
    const newExercise: Exercise = {
      id: generateId(),
      name: pendingLog.exerciseName,
      minReps,
      goalReps,
      logs: [],
    };

    let newData = addExercise(data, newExercise);
    
    // Now create the log
    const log: ExerciseLog = {
      id: generateId(),
      weight: pendingLog.weight,
      unit: pendingLog.unit,
      reps: pendingLog.reps,
      timestamp: new Date().toISOString(),
      recommendation: 'insufficient_data',
    };

    // Also save to workouts table for AI progression tracking
    addWorkout({
      exercise_name: pendingLog.exerciseName,
      weight: pendingLog.weight,
      unit: pendingLog.unit,
      reps: pendingLog.reps,
      sets: 1,
      timestamp: log.timestamp,
      rir: pendingLog.rir,
      goal_min_reps: minReps,
      goal_max_reps: goalReps,
    });

    // Analyze performance
    const result = analyzePerformance(newExercise, log, newData.metadata);
    log.recommendation = result.type;

    newData = addLogToExercise(newData, newExercise.id, log);
    updateData(newData);

    // Show notification first, then modal
    setNotification(result);
    setTimeout(() => {
      setRecommendation(result);
    }, 500);

    // Clean up
    setShowRepRangeModal(false);
    setPendingLog(null);
  };

  const completeLog = async (exercise: Exercise, weight: number, unit: 'lbs' | 'kg', reps: number, rir: number | null = null) => {
    const log: ExerciseLog = {
      id: generateId(),
      weight,
      unit,
      reps,
      timestamp: new Date().toISOString(),
      recommendation: 'insufficient_data',
    };

    // Analyze performance (existing local logic)
    const result = analyzePerformance(exercise, log, data.metadata);
    log.recommendation = result.type;

    const newData = addLogToExercise(data, exercise.id, log);
    updateData(newData);

    // Save to workouts table
    await addWorkout({
      exercise_name: exercise.name,
      weight,
      unit,
      reps,
      sets: 1,
      timestamp: log.timestamp,
      rir,
      goal_min_reps: exercise.minReps,
      goal_max_reps: exercise.goalReps,
    });

    // Auto-post activity for friends feed
    if (isAuthenticated) {
      postActivity(
        exercise.name,
        null,
        `Logged ${weight} ${unit} × ${reps} reps on ${exercise.name}`
      );
    }

    // Check if we have 4+ sessions for AI recommendation
    const totalLogs = exercise.logs.length + 1; // +1 for the one we just added
    if (totalLogs >= 4 && isAuthenticated) {
      fetchAiRecommendation(exercise.name, exercise.minReps, exercise.goalReps);
    }

    // Show notification first, then modal
    setNotification(result);
    setTimeout(() => {
      if (!loadingAiRec) {
        setRecommendation(result);
      }
    }, 500);
  };

  const handleRecommendationClose = () => {
    setRecommendation(null);
    setNotification(null);
    setScreen('home');
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setScreen('history');
  };

  const handleLogPreviousExercise = (prevExercise: PreviousExercise) => {
    // Log the previous exercise with the same details
    handleLogEntry(prevExercise.name, prevExercise.lastWeight, prevExercise.lastUnit, prevExercise.lastReps);
  };

  // Render based on current screen
  const renderScreen = () => {
    switch (screen) {
      case 'onboarding':
        return (
          <OnboardingFlow 
            onComplete={handleOnboardingComplete} 
            onSkip={handleOnboardingSkip}
          />
        );
      
      case 'log':
        return (
          <LogEntryForm
            data={data}
            onSubmit={handleLogEntry}
            onBack={() => setScreen('home')}
          />
        );
      
      case 'history':
        if (!selectedExercise) {
          setScreen('home');
          return null;
        }
        // Get the latest version of the exercise from data
        const currentExercise = data.exercises.find(e => e.id === selectedExercise.id);
        if (!currentExercise) {
          setScreen('home');
          return null;
        }
        return (
          <ExerciseHistory
            exercise={currentExercise}
            onBack={() => {
              setSelectedExercise(null);
              setScreen('home');
            }}
          />
        );
      
      case 'social':
        return (
          <SocialScreen
            onBack={() => setScreen('home')}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        );
      
      default:
        return (
          <SplitScreenLayout
            data={data}
            onLogNew={() => setScreen('log')}
            onLogPreviousExercise={handleLogPreviousExercise}
            onSelectExercise={handleSelectExercise}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenSocial={() => setScreen('social')}
          />
        );
    }
  };

  const handleMigrationComplete = () => {
    setShowMigrationModal(false);
    setLocalWorkoutCount(0);
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}

      {/* Rep Range Modal */}
      {showRepRangeModal && pendingLog && (
        <RepRangeModal
          exerciseName={pendingLog.exerciseName}
          onSave={handleRepRangeSave}
          onCancel={() => {
            setShowRepRangeModal(false);
            setPendingLog(null);
          }}
        />
      )}

      {/* Progress Notification */}
      {notification && (
        <ProgressNotification
          type={notification.type}
          title={notification.headline}
          message={notification.message}
          onClose={() => setNotification(null)}
          autoClose={true}
          duration={3000}
        />
      )}

      {/* Recommendation Modal */}
      {recommendation && (
        <RecommendationModal
          recommendation={recommendation}
          onClose={handleRecommendationClose}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Migration Modal */}
      <MigrationModal
        isOpen={showMigrationModal}
        workoutCount={localWorkoutCount}
        onClose={() => setShowMigrationModal(false)}
        onMigrationComplete={handleMigrationComplete}
      />
    </div>
  );
}
