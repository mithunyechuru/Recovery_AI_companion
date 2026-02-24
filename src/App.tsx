import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Mic, Camera, Pill, Heart, Settings, User, Activity, ChevronRight, Bell, Calendar, Plus, Moon, Sun, Brain, Sparkles, LogOut, X, Check
} from 'lucide-react';
import { Card, Button, Typography, cn } from './components/UI';
import { MOCK_USER, MOCK_REMINDERS, DAILY_TIPS, MOCK_MEDICATIONS, MOCK_DOSE_LOGS } from './constants';
import { Medication, DoseLog, Reminder, AuthUser, Exercise } from './types';

// Screens
import { AssistantScreen } from './screens/Assistant';
import { AnalyzerScreen } from './screens/Analyzer';
import { MedicationsScreen } from './screens/Medications';
import { ElevateScreen } from './screens/Elevate';
import { CaregiverScreen } from './screens/Caregiver';
import { ProgressScreen } from './screens/Progress';
import { ProfileScreen } from './screens/Profile';
import { LoginScreen } from './screens/Login';

type Screen = 'home' | 'assistant' | 'analyzer' | 'meds' | 'elevate' | 'caregiver' | 'progress' | 'profile';

function CaretakerHomeScreen({ onNavigate, user, reminders, allUsers, connections, onAddConnection }: { onNavigate: (screen: Screen) => void, user: AuthUser | null, reminders: Reminder[], allUsers: AuthUser[], connections: { caretakerEmail: string, patientEmail: string }[], onAddConnection: (patientEmail: string) => void }) {
  const patients = allUsers.filter(u => 
    connections.some(c => c.caretakerEmail === user?.email && c.patientEmail === u.email)
  );
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [patientCode, setPatientCode] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<AuthUser | null>(null);

  const addPatient = () => {
    if (patientCode) {
      const patient = allUsers.find(u => u.connectionCode === patientCode.toUpperCase() && u.role === 'patient');
      if (patient) {
        if (!patients.find(p => p.email === patient.email)) {
          onAddConnection(patient.email);
          setPatientCode('');
          setShowAddPatient(false);
        } else {
          alert("Patient already added");
        }
      } else {
        alert("Invalid patient code");
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <Typography variant="caption" className="text-gray-500">Welcome, {user?.name || 'Caretaker'}</Typography>
          <Typography variant="display" className="text-3xl lg:text-4xl">Caretaker Portal</Typography>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white dark:bg-dark-card shadow-sm"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-primary text-white rounded-xl px-6"
            onClick={() => setShowAddPatient(true)}
          >
            <Plus className="w-5 h-5 mr-2" /> Add Patient
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                <Typography variant="display" className="text-xl">Notifications</Typography>
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                {reminders.length > 0 ? (
                  reminders.map((r) => (
                    <div key={r.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        r.completed ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                      )}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <Typography className="font-bold text-sm">{r.title}</Typography>
                        <Typography variant="caption">{r.time} • {r.completed ? 'Completed' : 'Upcoming'}</Typography>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Typography className="text-gray-400">No notifications yet</Typography>
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/5">
                <Button className="w-full" onClick={() => setShowNotifications(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(patient => (
          <Card 
            key={patient.email} 
            className="p-6 hover:shadow-xl transition-all cursor-pointer group border-none bg-white dark:bg-dark-card"
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                {patient.avatar ? (
                  <span className="text-3xl">{patient.avatar}</span>
                ) : (
                  patient.name[0]
                )}
              </div>
              <div>
                <Typography variant="display" className="text-lg">{patient.name}</Typography>
                <Typography variant="caption" className="text-accent font-bold">{patient.recoveryFrom || 'Recovering'}</Typography>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Recovery Progress</span>
                <span className="font-bold text-primary">Day 4 / {patient.recoveryDays}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.round((4 / (patient.recoveryDays || 30)) * 100))}%` }}
                  className="bg-primary h-full"
                />
              </div>
            </div>

            <Button variant="ghost" className="w-full mt-6 group-hover:bg-primary group-hover:text-white transition-all">
              View Stats <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {showAddPatient && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-dark-card w-full max-w-md rounded-[32px] p-8 shadow-2xl"
            >
              <Typography variant="display" className="text-2xl mb-6">Add Patient by Code</Typography>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Connection Code</label>
                  <input 
                    type="text" 
                    value={patientCode}
                    onChange={(e) => setPatientCode(e.target.value)}
                    placeholder="Enter 6-digit code (e.g. APXCHF)"
                    className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                  />
                </div>
                <div className="flex gap-3 mt-8">
                  <Button 
                    variant="ghost" 
                    className="flex-1 py-4 rounded-xl"
                    onClick={() => setShowAddPatient(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-primary text-white py-4 rounded-xl shadow-lg shadow-primary/20"
                    onClick={addPatient}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-dark-card w-full max-w-2xl rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                    {selectedPatient.avatar ? (
                      <span className="text-4xl">{selectedPatient.avatar}</span>
                    ) : (
                      selectedPatient.name[0]
                    )}
                  </div>
                  <div>
                    <Typography variant="display" className="text-3xl">{selectedPatient.name}</Typography>
                    <Typography className="text-gray-500">{selectedPatient.email}</Typography>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedPatient(null)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="p-6 bg-accent/5 border-none">
                  <Typography variant="caption" className="text-accent uppercase font-bold mb-2 block">Recovery From</Typography>
                  <Typography variant="display" className="text-xl">{selectedPatient.recoveryFrom || 'General Recovery'}</Typography>
                </Card>
                <Card className="p-6 bg-primary/5 border-none">
                  <Typography variant="caption" className="text-primary uppercase font-bold mb-2 block">Duration</Typography>
                  <Typography variant="display" className="text-xl">{selectedPatient.recoveryDays} Days</Typography>
                </Card>
              </div>

              <div className="space-y-6">
                <Typography variant="display" className="text-xl">Patient Stats</Typography>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <Typography variant="display" className="text-2xl text-primary">
                      {Math.round(100 - (4 / (selectedPatient.recoveryDays || 30)) * 90)}%
                    </Typography>
                    <Typography variant="caption">AI Score</Typography>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <Typography variant="display" className="text-2xl text-accent">
                      {selectedPatient.initialMood || 'Good'}
                    </Typography>
                    <Typography variant="caption">Mood</Typography>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <Typography variant="display" className="text-2xl text-secondary">4</Typography>
                    <Typography variant="caption">Days In</Typography>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-8 py-4 rounded-xl" onClick={() => setSelectedPatient(null)}>
                Close Dashboard
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeScreen({ onNavigate, reminders, user, exercises, onToggleExercise }: { onNavigate: (screen: Screen) => void, reminders: Reminder[], user: AuthUser | null, exercises: Exercise[], onToggleExercise: (id: string) => void }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentDay = 4;
  const totalDays = user?.recoveryDays || 30;
  const completedToday = exercises.filter(ex => ex.completed).length;
  const totalToday = exercises.length || 1;
  
  // Cumulative progress: (Days passed - 1 + today's fraction) / total days
  const progressPercent = Math.round(((currentDay - 1 + (completedToday / totalToday)) / totalDays) * 100);

  // Check for 100% completion (last day and all tasks done)
  useEffect(() => {
    if (progressPercent === 100 && !showCongrats) {
      setShowCongrats(true);
    }
  }, [progressPercent]);

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shadow-inner">
            {user?.avatar || '🦁'}
          </div>
          <div className="py-4">
            <Typography variant="display" className="text-4xl lg:text-5xl mb-2 text-primary dark:text-white">
              {getGreeting()}, {user?.name || MOCK_USER.name}
            </Typography>
            <Typography className="text-gray-500 dark:text-gray-400 text-xl">
              We hope you're having a great day.
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 absolute top-8 right-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white dark:bg-dark-card shadow-sm"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex bg-white dark:bg-dark-card shadow-sm"
            onClick={() => onNavigate('profile')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {showCongrats && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white dark:bg-dark-card w-full max-w-md rounded-[40px] p-10 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-primary to-accent" />
              <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-accent animate-bounce" />
              </div>
              <Typography variant="display" className="text-4xl mb-4 text-primary">Congratulations!</Typography>
              <Typography className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                You've completed all your tasks for today! You are recovering wonderfully from <span className="text-primary font-bold">{user?.recoveryFrom || 'your journey'}</span>.
              </Typography>
              <Button 
                className="w-full py-4 rounded-2xl bg-accent text-white font-bold text-lg shadow-lg shadow-accent/20 hover:scale-[1.02] transition-transform"
                onClick={() => setShowCongrats(false)}
              >
                Keep it up!
              </Button>
              
              <div className="absolute -top-4 -left-4 w-12 h-12 text-accent opacity-20 rotate-12"><Sparkles /></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 text-primary opacity-20 -rotate-12"><Sparkles /></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                <Typography variant="display" className="text-xl">Notifications</Typography>
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                {reminders.length > 0 ? (
                  reminders.map((r) => (
                    <div key={r.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        r.completed ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                      )}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <Typography className="font-bold text-sm">{r.title}</Typography>
                        <Typography variant="caption">{r.time} • {r.completed ? 'Completed' : 'Upcoming'}</Typography>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Typography className="text-gray-400">No notifications yet</Typography>
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/5">
                <Button className="w-full" onClick={() => setShowNotifications(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress, AI Companion & Support */}
        <div className="lg:col-span-8 space-y-10">
          {/* Hero Progress Section */}
          <section className="space-y-4">
            <Typography variant="display" className="text-xl">Your Recovery</Typography>
            <Card className="bg-primary text-white p-8 relative overflow-hidden border-none shadow-2xl shadow-primary/20">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <Typography variant="caption" className="text-white/70 uppercase tracking-widest font-bold text-[10px]">Recovery Day {currentDay}</Typography>
                </div>
                <div className="space-y-2">
                  <Typography variant="display" className="text-3xl lg:text-4xl leading-tight">
                    You're doing great!
                  </Typography>
                  <Typography className="text-white/80 text-lg">
                    Keep up with your daily tasks to speed up recovery.
                  </Typography>
                </div>
                
                {/* Daily Tasks Progress */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <Typography variant="caption" className="text-white/70 uppercase font-bold text-[10px]">Recovery Progress</Typography>
                    <Typography className="text-white font-bold text-sm">{progressPercent}% Complete</Typography>
                  </div>
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="bg-accent h-full shadow-[0_0_15px_rgba(0,200,150,0.5)]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exercises.map(ex => (
                      <div 
                        key={ex.id} 
                        onClick={() => onToggleExercise(ex.id)}
                        className={cn(
                          "p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between",
                          ex.completed ? "bg-white/20 border border-white/30" : "bg-white/10 border border-white/10 hover:bg-white/15"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center border-2",
                            ex.completed ? "bg-accent border-accent" : "border-white/30"
                          )}>
                            {ex.completed && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <Typography className="font-medium text-sm">{ex.name}</Typography>
                        </div>
                        <Typography variant="caption" className="text-white/50">{ex.reps}</Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />
            </Card>
          </section>

          {/* AI Companion Section - Grouped Together */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <Typography variant="display" className="text-xl">AI Companion</Typography>
              </div>
              <Typography variant="caption" className="text-gray-400 hidden sm:block">Real-time recovery assistance</Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card 
                className="group relative flex flex-col gap-4 p-6 cursor-pointer border-none bg-white dark:bg-dark-card hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 overflow-hidden"
                onClick={() => onNavigate('analyzer')}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full transition-transform group-hover:scale-150 duration-700" />
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center transition-all duration-500 group-hover:bg-accent group-hover:rotate-6">
                  <Camera className="text-accent group-hover:text-white w-7 h-7 transition-colors" />
                </div>
                <div>
                  <Typography variant="display" className="text-xl mb-1">Symptom Analyzer</Typography>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    AI-powered vision check for swelling, redness, or recovery patterns.
                  </Typography>
                </div>
                <div className="mt-auto pt-4 flex items-center text-accent font-bold text-sm">
                  Start Scan <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>

              <Card 
                className="group relative flex flex-col gap-4 p-6 cursor-pointer border-none bg-white dark:bg-dark-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
                onClick={() => onNavigate('assistant')}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-150 duration-700" />
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:-rotate-6">
                  <Brain className="text-primary group-hover:text-white w-7 h-7 transition-colors" />
                </div>
                <div>
                  <Typography variant="display" className="text-xl mb-1">Voice Assistant</Typography>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Ask questions about your meds, exercises, or recovery plan hands-free.
                  </Typography>
                </div>
                <div className="mt-auto pt-4 flex items-center text-primary font-bold text-sm">
                  Talk Now <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </div>
          </section>

          {/* Support & Coordination */}
          <section className="space-y-4">
            <Typography variant="display" className="text-xl">Support & Care</Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card 
                className="group flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                onClick={() => onNavigate('elevate')}
              >
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Heart className="text-warning w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Typography variant="display" className="text-lg">Elevate Wellness</Typography>
                  <Typography variant="caption" className="text-gray-500">Mood & mental health</Typography>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-warning transition-colors" />
              </Card>
              <Card 
                className="group flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                onClick={() => onNavigate('caregiver')}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <User className="text-secondary w-6 h-6" />
                </div>
                <div className="flex-1">
                  <Typography variant="display" className="text-lg">Caregiver Mode</Typography>
                  <Typography variant="caption" className="text-gray-500">Coordinate with your team</Typography>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-secondary transition-colors" />
              </Card>
            </div>
          </section>
        </div>

        {/* Right Column: Schedule & Wisdom - Separated */}
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <Typography variant="display" className="text-xl">Today's Schedule</Typography>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-bold" onClick={() => onNavigate('meds')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {reminders.length > 0 ? (
                reminders.map((reminder) => (
                  <Card key={reminder.id} className={cn(
                    "flex items-center gap-4 p-4 border-none shadow-sm transition-all hover:shadow-md",
                    reminder.completed ? "bg-gray-50/50 dark:bg-white/5" : "bg-white dark:bg-dark-card"
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                      reminder.completed 
                        ? "bg-accent/10 text-accent" 
                        : reminder.type === 'medication' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                    )}>
                      {reminder.type === 'medication' ? <Pill className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography className={cn(
                        "font-bold truncate",
                        reminder.completed && "line-through opacity-40"
                      )}>
                        {reminder.title}
                      </Typography>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{reminder.time}</span>
                        {reminder.completed && (
                          <span className="px-1.5 py-0.5 rounded-md bg-accent/10 text-accent text-[8px] font-black uppercase">Done</span>
                        )}
                      </div>
                    </div>
                    {!reminder.completed && (
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Plus className="w-4 h-4 text-gray-300" />
                      </Button>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 px-6 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                  <Typography className="text-gray-400">No tasks remaining for today!</Typography>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <Typography variant="display" className="text-xl">Daily Wisdom</Typography>
            <Card className="bg-gradient-to-br from-secondary to-primary text-white p-8 border-none relative overflow-hidden shadow-xl shadow-secondary/20">
              <div className="relative z-10">
                <Typography variant="caption" className="text-white/60 font-black uppercase tracking-[0.2em] mb-4 block text-[10px]">Recovery Tip</Typography>
                <Typography className="text-white text-xl font-medium leading-relaxed italic">
                  "{DAILY_TIPS[tipIndex]}"
                </Typography>
                <div className="mt-6 flex items-center gap-2 text-white/40">
                  <div className="w-8 h-px bg-white/20" />
                  <Sparkles className="w-4 h-4" />
                  <div className="w-8 h-px bg-white/20" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'patient' | 'caretaker'>('patient');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem('neuronova_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(MOCK_DOSE_LOGS);
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'Knee Extensions', reps: '10 reps', sets: 3, completed: false },
    { id: '2', name: 'Ankle Pumps', reps: '20 reps', sets: 2, completed: false }
  ]);
  const [connections, setConnections] = useState<{ caretakerEmail: string, patientEmail: string }[]>(() => {
    const saved = localStorage.getItem('user_connections');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNotifications, setActiveNotifications] = useState<Reminder[]>([]);

  useEffect(() => {
    localStorage.setItem('user_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('neuronova_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      const dueReminders = reminders.filter(r => {
        // Simple time match
        return r.time === currentTime && !r.completed && !activeNotifications.find(an => an.id === r.id);
      });

      if (dueReminders.length > 0) {
        setActiveNotifications(prev => [...prev, ...dueReminders]);
      }
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [reminders, activeNotifications]);

  const handleLogin = (user: AuthUser) => {
    setUserRole(user.role);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleSignUp = (user: AuthUser) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newUser = { ...user, connectionCode: code };
    setUsers([...users, newUser]);
    // Auto login after sign up
    handleLogin(newUser);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentScreen('home');
  };

  const handleAddMedication = (newMed: Medication) => {
    setMedications([...medications, newMed]);
    // Also add a reminder for it
    const newReminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      title: `${newMed.name} Dose`,
      time: newMed.schedule,
      type: 'medication',
      completed: false
    };
    setReminders([newReminder, ...reminders]);
  };

  const handleTakeDose = (medId: string) => {
    const newLog: DoseLog = {
      id: Math.random().toString(36).substr(2, 9),
      medicationId: medId,
      timestamp: new Date().toISOString(),
      taken: true
    };
    setDoseLogs([newLog, ...doseLogs]);
    
    // Update reminder if it exists for today
    const med = medications.find(m => m.id === medId);
    if (med) {
      setReminders(reminders.map(r => 
        r.title.includes(med.name) ? { ...r, completed: true } : r
      ));
    }
  };

  const handleToggleExercise = (id: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} users={users} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': 
        return userRole === 'patient' 
          ? <HomeScreen 
              onNavigate={setCurrentScreen} 
              reminders={reminders} 
              user={currentUser} 
              exercises={exercises}
              onToggleExercise={handleToggleExercise}
            />
          : <CaretakerHomeScreen 
              onNavigate={setCurrentScreen} 
              user={currentUser} 
              reminders={reminders} 
              allUsers={users} 
              connections={connections}
              onAddConnection={(patientEmail) => {
                if (currentUser) {
                  setConnections([...connections, { caretakerEmail: currentUser.email, patientEmail }]);
                }
              }}
            />;
      case 'assistant': return <AssistantScreen />;
      case 'analyzer': return <AnalyzerScreen />;
      case 'meds': return <MedicationsScreen 
        meds={medications} 
        logs={doseLogs} 
        onAddMed={handleAddMedication} 
        onTakeDose={handleTakeDose} 
      />;
      case 'elevate': return <ElevateScreen />;
      case 'caregiver': 
        const caretakerConnection = connections.find(c => c.patientEmail === currentUser?.email);
        const caretaker = caretakerConnection ? users.find(u => u.email === caretakerConnection.caretakerEmail) : null;
        return <CaregiverScreen caretaker={caretaker || null} />;
      case 'progress': return <ProgressScreen user={currentUser} medications={medications} doseLogs={doseLogs} exercises={exercises} />;
      case 'profile': return <ProfileScreen user={currentUser} reminders={reminders} onLogout={handleLogout} />;
      default: return userRole === 'patient' 
        ? <HomeScreen 
            onNavigate={setCurrentScreen} 
            reminders={reminders} 
            user={currentUser} 
            exercises={exercises}
            onToggleExercise={handleToggleExercise}
          />
        : <CaretakerHomeScreen 
            onNavigate={setCurrentScreen} 
            user={currentUser} 
            reminders={reminders} 
            allUsers={users} 
            connections={connections}
            onAddConnection={(patientEmail) => {
              if (currentUser) {
                setConnections([...connections, { caretakerEmail: currentUser.email, patientEmail }]);
              }
            }}
          />;
    }
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300 flex", isDarkMode ? "dark bg-dark-surface text-dark-text" : "bg-surface text-gray-900")}>
      
      {/* Notifications Overlay */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md space-y-2 px-4">
        <AnimatePresence>
          {activeNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 backdrop-blur-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <Typography className="font-bold">Time for {notif.title}!</Typography>
                  <Typography variant="caption" className="text-white/70">Scheduled for {notif.time}</Typography>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => setActiveNotifications(prev => prev.filter(an => an.id !== notif.id))}
              >
                Dismiss
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-white dark:bg-dark-card border-r border-black/5 dark:border-white/5 flex-col py-8 z-50">
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Brain className="text-white w-6 h-6" />
          </div>
          <Typography variant="display" className="text-xl hidden lg:block">NeuroNova</Typography>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          <SidebarItem active={currentScreen === 'home'} onClick={() => setCurrentScreen('home')} icon={Home} label="Dashboard" />
          <SidebarItem active={currentScreen === 'meds'} onClick={() => setCurrentScreen('meds')} icon={Pill} label="Medications" />
          <SidebarItem active={currentScreen === 'assistant'} onClick={() => setCurrentScreen('assistant')} icon={Brain} label="AI Assistant" />
          <SidebarItem active={currentScreen === 'progress'} onClick={() => setCurrentScreen('progress')} icon={Activity} label="Recovery Stats" />
        </div>

        <div className="px-4 mt-auto space-y-2">
          <SidebarItem active={currentScreen === 'profile'} onClick={() => setCurrentScreen('profile')} icon={Settings} label="Settings" />
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="hidden lg:block font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:pl-20 lg:pl-64">
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-32 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 px-6 py-4 z-40 md:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <NavButton active={currentScreen === 'home'} onClick={() => setCurrentScreen('home')} icon={Home} label="Home" />
          <NavButton active={currentScreen === 'meds'} onClick={() => setCurrentScreen('meds')} icon={Pill} label="Meds" />
          <div className="relative -top-8">
            <button 
              onClick={() => setCurrentScreen('assistant')}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90",
                currentScreen === 'assistant' ? "bg-accent text-white" : "bg-primary text-white"
              )}
            >
              <Brain className="w-8 h-8" />
            </button>
          </div>
          <NavButton active={currentScreen === 'elevate'} onClick={() => setCurrentScreen('elevate')} icon={Heart} label="Elevate" />
          <NavButton active={currentScreen === 'progress'} onClick={() => setCurrentScreen('progress')} icon={Activity} label="Stats" />
        </div>
      </nav>

      {/* Floating Action Button for Profile (Mobile Only) */}
      <div className="fixed top-8 right-4 z-50 md:hidden">
        <button 
          onClick={() => setCurrentScreen('profile')}
          className="w-10 h-10 rounded-full bg-white dark:bg-dark-card shadow-md flex items-center justify-center border border-black/5"
        >
          <User className="w-5 h-5 text-primary" />
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/20" 
          : "text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-white" : "text-gray-400")} />
      <span className="hidden lg:block font-medium">{label}</span>
    </button>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-primary dark:text-secondary scale-110" : "text-gray-400"
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
