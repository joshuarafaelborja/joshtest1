import { AppData, Exercise, ExerciseLog } from './types';

const STORAGE_KEY = 'coach-app-data';

const defaultData: AppData = {
  exercises: [],
  userPreferences: {
    defaultUnit: 'lbs',
    hasSeenWelcome: false,
  },
  metadata: {
    firstLogDate: null,
    lastDeloadDate: null,
  },
};

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AppData;
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  return defaultData;
}

export function saveData(data: AppData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    return false;
  }
}

export function getExerciseByName(data: AppData, name: string): Exercise | undefined {
  return data.exercises.find(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
}

export function getExerciseNames(data: AppData): string[] {
  return data.exercises.map((e) => e.name);
}

export function addExercise(data: AppData, exercise: Exercise): AppData {
  return {
    ...data,
    exercises: [...data.exercises, exercise],
  };
}

export function addLogToExercise(
  data: AppData,
  exerciseId: string,
  log: ExerciseLog
): AppData {
  const updatedExercises = data.exercises.map((exercise) => {
    if (exercise.id === exerciseId) {
      return {
        ...exercise,
        logs: [...exercise.logs, log],
      };
    }
    return exercise;
  });

  const newMetadata = { ...data.metadata };
  if (!newMetadata.firstLogDate) {
    newMetadata.firstLogDate = log.timestamp;
  }

  return {
    ...data,
    exercises: updatedExercises,
    metadata: newMetadata,
  };
}

export function markWelcomeSeen(data: AppData): AppData {
  return {
    ...data,
    userPreferences: {
      ...data.userPreferences,
      hasSeenWelcome: true,
    },
  };
}

export function generateId(): string {
  return crypto.randomUUID();
}
