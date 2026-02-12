import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Dumbbell, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import spotLogo from '@/assets/spot-ai-logo.svg';
import { format } from 'date-fns';

interface ProfileData {
  username: string | null;
  slug: string;
}

interface WorkoutSummary {
  exercise_name: string;
  total_sets: number;
  max_weight: number;
  unit: string;
  last_workout: string;
}

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!slug) {
        setError('Profile not found');
        setLoading(false);
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, slug, user_id')
        .eq('slug', slug)
        .maybeSingle();

      if (profileError || !profileData) {
        setError('Profile not found');
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch workout summary for this user
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('exercise_name, weight, unit, sets, timestamp')
        .eq('user_id', profileData.user_id)
        .order('timestamp', { ascending: false });

      if (!workoutError && workoutData) {
        // Group by exercise and get summary
        const exerciseMap = new Map<string, WorkoutSummary>();
        
        workoutData.forEach(w => {
          const existing = exerciseMap.get(w.exercise_name);
          if (existing) {
            existing.total_sets += w.sets;
            if (Number(w.weight) > existing.max_weight) {
              existing.max_weight = Number(w.weight);
              existing.unit = w.unit;
            }
          } else {
            exerciseMap.set(w.exercise_name, {
              exercise_name: w.exercise_name,
              total_sets: w.sets,
              max_weight: Number(w.weight),
              unit: w.unit,
              last_workout: w.timestamp,
            });
          }
        });

        setWorkouts(Array.from(exerciseMap.values()));
      }

      setLoading(false);
    }

    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <img src={spotLogo} alt="Spot.AI" className="w-32 h-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">This profile doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {profile.username || `User ${profile.slug}`}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4">
        {workouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <Dumbbell className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">No workouts yet</h2>
            <p className="text-muted-foreground">This user hasn't logged any workouts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              {workouts.length} Exercise{workouts.length !== 1 ? 's' : ''} Tracked
            </h2>
            {workouts.map((workout) => (
              <div 
                key={workout.exercise_name}
                className="p-4 rounded-xl bg-card border"
              >
                <h3 className="font-semibold mb-2">{workout.exercise_name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-4 h-4" />
                    {workout.max_weight} {workout.unit}
                  </span>
                  <span>{workout.total_sets} sets</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(workout.last_workout), 'MMM d')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
