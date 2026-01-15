import { useState, useEffect, useCallback } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { HomeScreen } from '@/components/HomeScreen';
import { LogEntryForm } from '@/components/LogEntryForm';
import { ExerciseHistory } from '@/components/ExerciseHistory';
import { RepRangeModal } from '@/components/RepRangeModal';
import { RecommendationModal } from '@/components/RecommendationModal';
import { ProgressNotification } from '@/components/ProgressNotification';
import { CalculatorsScreen } from '@/components/CalculatorsScreen';
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
  markWelcomeSeen,
  generateId,
} from '@/lib/storage';
import { analyzePerformance } from '@/lib/recommendations';

type Screen = 'welcome' | 'home' | 'log' | 'history' | 'calculators';

interface PendingLog {
  exerciseName: string;
  weight: number;
  unit: 'lbs' | 'kg';
  reps: number;
}

export default function Index() {
  const [data, setData] = useState<AppData>(loadData);
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showRepRangeModal, setShowRepRangeModal] = useState(false);
  const [pendingLog, setPendingLog] = useState<PendingLog | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [notification, setNotification] = useState<RecommendationResult | null>(null);

  // Check if welcome screen should show
  useEffect(() => {
    if (!data.userPreferences.hasSeenWelcome) {
      setScreen('welcome');
    }
  }, []);

  // Save data whenever it changes
  const updateData = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const handleGetStarted = () => {
    const newData = markWelcomeSeen(data);
    updateData(newData);
    setScreen('home');
  };

  const handleLogEntry = (exerciseName: string, weight: number, unit: 'lbs' | 'kg', reps: number) => {
    const existingExercise = getExerciseByName(data, exerciseName);

    if (!existingExercise) {
      // New exercise - show rep range modal
      setPendingLog({ exerciseName, weight, unit, reps });
      setShowRepRangeModal(true);
      return;
    }

    // Existing exercise - create log and analyze
    completeLog(existingExercise, weight, unit, reps);
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

  const completeLog = (exercise: Exercise, weight: number, unit: 'lbs' | 'kg', reps: number) => {
    const log: ExerciseLog = {
      id: generateId(),
      weight,
      unit,
      reps,
      timestamp: new Date().toISOString(),
      recommendation: 'insufficient_data',
    };

    // Analyze performance
    const result = analyzePerformance(exercise, log, data.metadata);
    log.recommendation = result.type;

    const newData = addLogToExercise(data, exercise.id, log);
    updateData(newData);

    // Show notification first, then modal
    setNotification(result);
    setTimeout(() => {
      setRecommendation(result);
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

  // Render based on current screen
  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      
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
      
      case 'calculators':
        return (
          <CalculatorsScreen onBack={() => setScreen('home')} />
        );
      
      default:
        return (
          <HomeScreen
            data={data}
            onLogNew={() => setScreen('log')}
            onSelectExercise={handleSelectExercise}
            onOpenCalculators={() => setScreen('calculators')}
          />
        );
    }
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
    </div>
  );
}
