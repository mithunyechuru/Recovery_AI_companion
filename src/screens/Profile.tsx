import React, { useState } from 'react';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Camera, Edit2, X } from 'lucide-react';
import { Card, Button, Typography, cn } from '../components/UI';
import { MOCK_USER } from '../constants';
import { AuthUser, Reminder } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileProps {
  user: AuthUser | null;
  reminders: Reminder[];
  onLogout: () => void;
}

export function ProfileScreen({ user, reminders, onLogout }: ProfileProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const displayName = user?.name || MOCK_USER.name;
  const displayInjury = user?.recoveryFrom || MOCK_USER.injuryType;
  const displayDuration = user?.recoveryDays || MOCK_USER.recoveryDuration;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col items-center py-8 space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white dark:border-dark-card shadow-xl overflow-hidden text-5xl">
            {user?.avatar || <User className="w-12 h-12 text-primary" />}
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-dark-card">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center">
          <Typography variant="display" className="text-2xl">{displayName}</Typography>
          <Typography variant="caption" className="text-primary font-medium">{displayInjury} Recovery</Typography>
          {user?.connectionCode && (
            <div className="mt-2 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full inline-block">
              <Typography variant="caption" className="font-mono font-bold">Code: {user.connectionCode}</Typography>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Typography variant="display" className="text-xl">{displayDuration}</Typography>
          <Typography variant="caption">Total Days</Typography>
        </div>
        <div className="text-center border-x border-black/5 dark:border-white/5">
          <Typography variant="display" className="text-xl">4</Typography>
          <Typography variant="caption">Days In</Typography>
        </div>
        <div className="text-center">
          <Typography variant="display" className="text-xl">85%</Typography>
          <Typography variant="caption">AI Score</Typography>
        </div>
      </div>

      <div className="space-y-4">
        <Typography variant="display" className="text-lg">Account Settings</Typography>
        <div className="space-y-2">
          {[
            { icon: User, title: "Personal Information", color: "text-blue-500", onClick: () => setShowPersonalInfo(true) },
            { icon: Bell, title: "Notifications", color: "text-orange-500", onClick: () => setShowNotifications(true) },
            { icon: Shield, title: "Privacy & Data", color: "text-accent", onClick: () => {} },
            { icon: HelpCircle, title: "Support Center", color: "text-purple-500", onClick: () => {} },
          ].map((item, i) => (
            <Card 
              key={i} 
              className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={item.onClick}
            >
              <div className={cn("w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <Typography className="flex-1 font-medium">{item.title}</Typography>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Typography variant="display" className="text-lg">Recovery Protocol</Typography>
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <Typography className="font-medium">{displayInjury} Post-Op Protocol</Typography>
              <Typography variant="caption">Standard plan</Typography>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">Change</Button>
        </Card>
      </div>

      <Button 
        variant="ghost" 
        className="w-full text-warning hover:bg-warning/10 py-4 mt-4"
        onClick={onLogout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sign Out
      </Button>

      <Typography variant="caption" className="text-center block opacity-30">
        NeuroNova v1.0.4 • Made with ❤️ for your recovery
      </Typography>

      <AnimatePresence>
        {showPersonalInfo && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                <Typography variant="display" className="text-xl">Personal Information</Typography>
                <Button variant="ghost" size="icon" onClick={() => setShowPersonalInfo(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Typography variant="caption" className="uppercase font-bold text-gray-400">Recovery Details</Typography>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <Typography className="text-gray-500">Recovering from:</Typography>
                        <Typography className="font-medium">{user?.recoveryFrom || 'N/A'}</Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography className="text-gray-500">Total Duration:</Typography>
                        <Typography className="font-medium">{user?.recoveryDays} Days</Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography className="text-gray-500">Initial Mood:</Typography>
                        <Typography className="font-medium capitalize">{user?.initialMood || 'N/A'}</Typography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Typography variant="caption" className="uppercase font-bold text-gray-400">Current Medications</Typography>
                    <div className="mt-2 space-y-2">
                      <div className="p-3 bg-primary/5 rounded-xl flex items-center justify-between">
                        <Typography className="font-medium">Ibuprofen</Typography>
                        <Typography variant="caption">400mg • 08:00</Typography>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-xl flex items-center justify-between">
                        <Typography className="font-medium">Vitamin D</Typography>
                        <Typography variant="caption">1000 IU • 10:00</Typography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Typography variant="caption" className="uppercase font-bold text-gray-400">Connection Code</Typography>
                    <div className="mt-2 p-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-center border-2 border-dashed border-primary/20">
                      <Typography variant="display" className="text-3xl tracking-widest text-primary">{user?.connectionCode}</Typography>
                      <Typography variant="caption" className="mt-2 block">Share this code with your caretaker</Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/5">
                <Button className="w-full" onClick={() => setShowPersonalInfo(false)}>Close</Button>
              </div>
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
                <Typography variant="display" className="text-xl">Recent Notifications</Typography>
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
    </div>
  );
}
