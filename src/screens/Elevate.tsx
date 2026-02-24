import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Smile, Meh, Frown, CloudRain, Sun, Sparkles, BookOpen, Play, MessageCircle } from 'lucide-react';
import { Card, Button, Typography, cn } from '../components/UI';
import { Mood, MoodEntry } from '../types';
import { MOCK_MOOD_HISTORY } from '../constants';

const MOODS: { type: Mood, icon: any, color: string, label: string }[] = [
  { type: 'great', icon: Sun, color: 'text-yellow-500 bg-yellow-50', label: 'Great' },
  { type: 'good', icon: Smile, color: 'text-accent bg-accent/10', label: 'Good' },
  { type: 'okay', icon: Meh, color: 'text-secondary bg-secondary/10', label: 'Okay' },
  { type: 'bad', icon: Frown, color: 'text-orange-500 bg-orange-50', label: 'Bad' },
  { type: 'terrible', icon: CloudRain, color: 'text-warning bg-warning/10', label: 'Terrible' },
];

export function ElevateScreen() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>(MOCK_MOOD_HISTORY);

  const logMood = (mood: Mood) => {
    setSelectedMood(mood);
    const newEntry: MoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      mood
    };
    setHistory([newEntry, ...history]);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="text-center space-y-2">
        <Typography variant="display" className="text-3xl">How are you today?</Typography>
        <Typography variant="caption">Checking in on your mental wellness is just as important as physical recovery.</Typography>
      </div>

      <div className="flex justify-between gap-2">
        {MOODS.map((m) => (
          <button
            key={m.type}
            onClick={() => logMood(m.type)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all flex-1",
              selectedMood === m.type ? "bg-primary text-white scale-110 shadow-lg" : "bg-white dark:bg-dark-card"
            )}
          >
            <m.icon className={cn("w-8 h-8", selectedMood === m.type ? "text-white" : m.color.split(' ')[0])} />
            <Typography variant="caption" className={cn("font-medium", selectedMood === m.type ? "text-white" : "text-gray-500")}>
              {m.label}
            </Typography>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Typography variant="display" className="text-xl">Daily Inspiration</Typography>
        <Card className="bg-gradient-to-br from-primary to-secondary text-white p-6 relative overflow-hidden">
          <Sparkles className="absolute top-2 right-2 opacity-20 w-12 h-12" />
          <Typography className="text-lg italic font-medium mb-4">
            "Recovery is not a race. You are healing exactly at the pace you need to."
          </Typography>
        </Card>
      </div>

      <div className="space-y-4">
        <Typography variant="display" className="text-xl">Wellness Toolkit</Typography>
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col gap-3 p-4 hover:border-primary transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <BookOpen className="text-accent w-6 h-6" />
            </div>
            <Typography variant="display">Guided Breathing</Typography>
          </Card>
          <Card className="flex flex-col gap-3 p-4 hover:border-primary transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Play className="text-secondary w-6 h-6" />
            </div>
            <Typography variant="display">Gentle Yoga</Typography>
          </Card>
        </div>
      </div>
    </div>
  );
}
