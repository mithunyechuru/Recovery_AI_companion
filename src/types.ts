export enum AssessmentLevel {
  NORMAL = "NORMAL",
  MONITOR = "MONITOR",
  MEDICAL_ATTENTION = "MEDICAL_ATTENTION",
  EMERGENCY = "EMERGENCY"
}

export interface AnalysisResult {
  analysis: string;
  assessment: AssessmentLevel;
  guidance: string;
  reassurance: string;
  actionSteps: string[];
}

export interface Medication {
  id: string;
  name: string;
  dose?: string;
  schedule: string;
  foodTiming?: 'before' | 'during' | 'after';
  frequency: number;
  startDate: string;
  duration: string;
  notes?: string;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  timestamp: string;
  taken: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  type: 'medication' | 'exercise' | 'checkup';
  completed: boolean;
}

export interface ExerciseStep {
  label: string;
  duration: number; // in seconds
}

export interface Exercise {
  id: string;
  name: string;
  reps: string;
  sets: number;
  completed: boolean;
  steps?: ExerciseStep[];
  type?: string; // e.g., 'hand', 'knee', 'ankle'
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  timestamp: string;
}

export interface AuthUser {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'caretaker';
  recoveryFrom?: string;
  recoveryDays?: number;
  initialMood?: Mood;
  connectionCode?: string;
  avatar?: string;
  startDate?: string;
}

export interface UserProfile {
  name: string;
  injuryType: string;
  recoveryDuration: number;
  currentDay: number;
  caregiverName: string;
  aiInvolvement: number;
}

export type Mood = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

export interface MoodEntry {
  id: string;
  timestamp: string;
  mood: Mood;
  note?: string;
}
