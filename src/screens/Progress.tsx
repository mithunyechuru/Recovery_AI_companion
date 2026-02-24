import React from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, TrendingUp, Calendar, Target, Award, ChevronRight } from 'lucide-react';
import { Card, Button, Typography, cn } from '../components/UI';
import { MOCK_USER } from '../constants';

import { Medication, DoseLog, Exercise, AuthUser } from '../types';
import { calculateCurrentDay } from '../utils';

interface ProgressScreenProps {
  user: AuthUser | null;
  medications: Medication[];
  doseLogs: DoseLog[];
  exercises: Exercise[];
  painLogs: { date: string, level: number }[];
  onLogPain: (level: number) => void;
}

export function ProgressScreen({ user, medications, doseLogs, exercises, painLogs, onLogPain }: ProgressScreenProps) {

  const currentDay = calculateCurrentDay(user?.startDate);
  const totalDays = user?.recoveryDays || 30;

  const generateMobilityData = () => {
    const data = [];
    const weeks = Math.ceil(totalDays / 7);
    const currentWeek = Math.ceil(currentDay / 7);
    
    for (let i = 1; i <= weeks; i++) {
      let progress = 0;
      if (i < currentWeek) {
        progress = Math.min(100, Math.round((i / weeks) * 100));
      } else if (i === currentWeek) {
        progress = Math.min(100, Math.round((currentDay / totalDays) * 100));
      } else {
        progress = 0;
      }
      data.push({ week: `W${i}`, progress });
    }
    return data;
  };

  const generatePainData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = new Date().getDay();
    const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    
    return days.map((day, i) => {
      const log = painLogs.find(p => p.date === day);
      if (log) return { day, level: log.level };

      let level = 0;
      if (i <= adjustedTodayIndex) {
        level = Math.max(1, Math.round(10 - (currentDay / totalDays) * 8 - (i * 0.2)));
      }
      return { day, level };
    });
  };

  const dynamicMobilityData = generateMobilityData();
  const dynamicPainData = generatePainData();
  
  const completedMeds = doseLogs.filter(log => {
    const logDate = new Date(log.timestamp).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  }).length;
  
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalDailyTasks = medications.length + exercises.length;
  const completedDailyTasks = completedMeds + completedExercises;
  const dailyProgress = Math.round((completedDailyTasks / totalDailyTasks) * 100) || 0;

  // AI Score decreases as recovery progresses
  // Starts at 100% on Day 1, decreases to ~10% by end of recovery
  const aiScore = Math.max(10, Math.round(100 - (currentDay / totalDays) * 90));

  const isShortRecovery = totalDays <= 7;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Typography as="h2" variant="display" className="text-2xl">Recovery Progress</Typography>
        <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
          <TrendingUp className="w-4 h-4 text-accent" />
          <Typography variant="caption" className="text-accent font-bold">On Track</Typography>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary text-white space-y-1">
          <Typography variant="caption" className="text-white/70 uppercase tracking-wider text-[10px]">Current Day</Typography>
          <Typography variant="display" className="text-3xl">{currentDay}</Typography>
          <Typography variant="caption" className="text-white/50">of {totalDays} days</Typography>
        </Card>
        <Card className="space-y-1">
          <Typography variant="caption" className="uppercase tracking-wider text-[10px]">AI Assistance Score</Typography>
          <Typography variant="display" className="text-3xl text-primary">{aiScore}%</Typography>
          <Typography variant="caption">Decreasing as you heal</Typography>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="display">Improvement Trends</Typography>
          <Typography variant="caption">
            {isShortRecovery ? "Day & Week" : "Day, Week & Month"}
          </Typography>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Typography variant="caption" className="font-bold">Daily Improvement</Typography>
              <Typography className="text-accent font-bold">+{Math.min(100, Math.round(dailyProgress / 10))}%</Typography>
            </div>
            <div className="w-full bg-gray-100 dark:bg-dark-surface h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.round(dailyProgress / 10))}%` }}
                className="bg-accent h-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Typography variant="caption" className="font-bold">Weekly Improvement</Typography>
              <Typography className="text-primary font-bold">+{Math.min(100, Math.round((currentDay / totalDays) * 100))}%</Typography>
            </div>
            <div className="w-full bg-gray-100 dark:bg-dark-surface h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.round((currentDay / totalDays) * 100))}%` }}
                className="bg-primary h-full"
              />
            </div>
          </div>
          {!isShortRecovery && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Typography variant="caption" className="font-bold">Monthly Improvement</Typography>
                <Typography className="text-secondary font-bold">+{Math.min(100, Math.round((currentDay / totalDays) * 150))}%</Typography>
              </div>
              <div className="w-full bg-gray-100 dark:bg-dark-surface h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.round((currentDay / totalDays) * 150))}%` }}
                  className="bg-secondary h-full"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="display">Pain Level Trend</Typography>
          <Typography variant="caption">Last 7 Days</Typography>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicPainData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="level" 
                stroke="#0A2463" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0A2463', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-white/5">
          <Typography variant="caption" className="mb-3 block font-bold text-primary">Log Today's Pain Level (1-10)</Typography>
          <div className="flex justify-between gap-2">
            {[2, 4, 6, 8, 10].map((val) => (
              <button
                key={val}
                onClick={() => onLogPain(val)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                  painLogs.find(p => p.date === new Date().toLocaleDateString('en-US', { weekday: 'short' }))?.level === val
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200"
                )}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Typography variant="display" className="text-lg">Milestones</Typography>
        <div className="space-y-3">
          {[
            { title: "First Walk (Unassisted)", date: "Feb 20", completed: true },
            { title: "Stair Climbing", date: "Feb 25", completed: false },
            { title: "Full Weight Bearing", date: "Mar 05", completed: false },
          ].map((m, i) => (
            <Card key={i} className="flex items-center gap-4 py-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                m.completed ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-400"
              )}>
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <Typography className={cn("font-medium", !m.completed && "opacity-50")}>{m.title}</Typography>
                <Typography variant="caption">{m.date}</Typography>
              </div>
              {m.completed && <div className="w-2 h-2 rounded-full bg-accent" />}
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-secondary/10 border-secondary/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <Typography variant="display">Daily Task Completion</Typography>
            <Typography variant="caption" className="mb-3 block">Complete all meds and exercises for maximum recovery.</Typography>
            <div className="w-full bg-gray-200 dark:bg-dark-surface h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                className="bg-secondary h-full"
              />
            </div>
            <Typography variant="caption" className="mt-1 text-right block">{dailyProgress}% complete</Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}
