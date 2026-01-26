export type RecommendationType = 
  | 'progressive_overload' 
  | 'acclimation' 
  | 'maintain' 
  | 'acute_deload' 
  | 'scheduled_deload'
  | 'insufficient_data';

export interface ExerciseLog {
  id: string;
  weight: number;
  unit: 'lbs' | 'kg';
  reps: number;
  timestamp: string;
  recommendation: RecommendationType;
}

export interface Exercise {
  id: string;
  name: string;
  minReps: number;
  goalReps: number;
  logs: ExerciseLog[];
}

export interface UserPreferences {
  defaultUnit: 'lbs' | 'kg';
  hasSeenWelcome: boolean;
  hasCompletedOnboarding: boolean;
  userName?: string;
}

export interface AppMetadata {
  firstLogDate: string | null;
  lastDeloadDate: string | null;
}

export interface AppData {
  exercises: Exercise[];
  userPreferences: UserPreferences;
  metadata: AppMetadata;
}

export interface RecommendationResult {
  type: RecommendationType;
  icon: string;
  headline: string;
  message: string;
  suggestedWeight?: number;
}
