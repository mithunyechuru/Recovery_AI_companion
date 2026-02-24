import { UserProfile, Medication, Reminder, MoodEntry, DoseLog, Exercise } from './types';

export const MOCK_USER: UserProfile = {
  name: "Alex",
  injuryType: "ACL Surgery",
  recoveryDuration: 30,
  currentDay: 4,
  caregiverName: "Sarah",
  aiInvolvement: 80,
};

export const MOCK_MEDICATIONS: Medication[] = [
  { id: '1', name: 'Ibuprofen', dose: '400mg', schedule: 'Every 8 hours', frequency: 3, startDate: '2024-02-18', duration: '10 days' },
  { id: '2', name: 'Aspirin', dose: '81mg', schedule: 'Once daily', frequency: 1, startDate: '2024-02-18', duration: '30 days' },
];

export const MOCK_REMINDERS: Reminder[] = [
  { id: '1', title: 'Morning Ibuprofen', time: '08:00', type: 'medication', completed: true },
  { id: '2', title: 'Knee Extension Exercises', time: '10:30', type: 'exercise', completed: false },
  { id: '3', title: 'Afternoon Ibuprofen', time: '16:00', type: 'medication', completed: false },
];

export const MOCK_DOSE_LOGS: DoseLog[] = [
  { id: '1', medicationId: '1', timestamp: '2024-02-22T08:05:00Z', taken: true },
  { id: '2', medicationId: '2', timestamp: '2024-02-22T08:10:00Z', taken: true },
];

export const MOCK_MOOD_HISTORY: MoodEntry[] = [
  { id: '1', timestamp: '2024-02-19T10:00:00Z', mood: 'okay', note: 'First day home was tough.' },
  { id: '2', timestamp: '2024-02-20T10:00:00Z', mood: 'good', note: 'Pain is more manageable today.' },
  { id: '3', timestamp: '2024-02-21T10:00:00Z', mood: 'great', note: 'Walked to the kitchen!' },
  { id: '4', timestamp: '2024-02-22T10:00:00Z', mood: 'good', note: 'Slept better.' },
];

export const DAILY_TIPS = [
  "Remember to keep your leg elevated above your heart level to reduce swelling.",
  "Small movements every hour help prevent blood clots. Try some ankle pumps!",
  "Hydration is key to recovery. Aim for 8 glasses of water today.",
  "It's okay to feel frustrated. Recovery isn't a straight line.",
  "Celebrate the small wins—like standing up without help for the first time!"
];

export const RECOVERY_EXERCISES: Record<string, Exercise[]> = {
  'Hand Surgery': [
    { 
      id: 'h1', name: 'Hand Clenches', reps: '10 reps', sets: 3, completed: false, type: 'hand',
      steps: [
        { label: 'Close Hand', duration: 3 },
        { label: 'Hold', duration: 2 },
        { label: 'Open Hand', duration: 3 }
      ]
    },
    { 
      id: 'h2', name: 'Finger Stretches', reps: '5 reps', sets: 2, completed: false, type: 'hand',
      steps: [
        { label: 'Stretch Fingers', duration: 5 },
        { label: 'Relax', duration: 3 }
      ]
    }
  ],
  'Knee Replacement': [
    { 
      id: 'k1', name: 'Knee Extensions', reps: '10 reps', sets: 3, completed: false, type: 'knee',
      steps: [
        { label: 'Extend Leg', duration: 4 },
        { label: 'Hold', duration: 2 },
        { label: 'Lower Leg', duration: 4 }
      ]
    },
    { 
      id: 'k2', name: 'Ankle Pumps', reps: '20 reps', sets: 2, completed: false, type: 'knee',
      steps: [
        { label: 'Flex Ankle', duration: 3 },
        { label: 'Hold', duration: 1 },
        { label: 'Point Toes', duration: 3 }
      ]
    }
  ],
  'General': [
    { 
      id: 'g1', name: 'Deep Breathing', reps: '10 reps', sets: 3, completed: false, type: 'general',
      steps: [
        { label: 'Inhale Deeply', duration: 4 },
        { label: 'Hold Breath', duration: 4 },
        { label: 'Exhale Slowly', duration: 6 }
      ]
    }
  ]
};
