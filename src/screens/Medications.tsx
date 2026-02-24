import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Plus, Check, AlertCircle, Trash2, X } from 'lucide-react';
import { Card, Button, Typography, cn } from '../components/UI';
import { Medication, DoseLog } from '../types';
import { MOCK_MEDICATIONS, MOCK_DOSE_LOGS } from '../constants';

interface MedicationsScreenProps {
  meds: Medication[];
  logs: DoseLog[];
  onAddMed: (med: Medication) => void;
  onTakeDose: (medId: string) => void;
}

export function MedicationsScreen({ meds, logs, onAddMed, onTakeDose }: MedicationsScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');
  
  // Form state
  const [newName, setNewName] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newSchedule, setNewSchedule] = useState('08:00');
  const [newFoodTiming, setNewFoodTiming] = useState<'before' | 'during' | 'after'>('during');
  const [newDuration, setNewDuration] = useState('7');

  const handleSave = () => {
    if (!newName) return;
    
    const newMed: Medication = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      dose: newDose || undefined,
      schedule: newSchedule,
      foodTiming: newFoodTiming,
      frequency: 1,
      startDate: new Date().toISOString().split('T')[0],
      duration: `${newDuration} days`
    };
    
    onAddMed(newMed);
    setShowAddModal(false);
    // Reset form
    setNewName('');
    setNewDose('');
    setNewSchedule('08:00');
    setNewFoodTiming('during');
    setNewDuration('7');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Typography as="h2" variant="display" className="text-2xl">Medications</Typography>
        <Button size="icon" onClick={() => setShowAddModal(true)}>
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex bg-gray-100 dark:bg-dark-surface p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('schedule')}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === 'schedule' ? "bg-white dark:bg-dark-card shadow-sm text-primary" : "text-gray-500"
          )}
        >
          Schedule
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === 'history' ? "bg-white dark:bg-dark-card shadow-sm text-primary" : "text-gray-500"
          )}
        >
          History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'schedule' ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {meds.map((med) => {
              const lastTaken = logs.find(l => l.medicationId === med.id);
              const isTakenToday = lastTaken && new Date(lastTaken.timestamp).toDateString() === new Date().toDateString();
              
              return (
                <Card key={med.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Pill className="text-primary w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <Typography variant="display" className="text-lg">{med.name}</Typography>
                    <Typography variant="caption">
                      {med.dose && `${med.dose} • `}{med.schedule}
                      {med.foodTiming && ` • ${med.foodTiming} food`}
                      {med.duration && ` • ${med.duration}`}
                    </Typography>
                  </div>
                  <Button 
                    variant={isTakenToday ? "accent" : "primary"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => onTakeDose(med.id)}
                    disabled={isTakenToday}
                  >
                    {isTakenToday ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      "Take"
                    )}
                  </Button>
                </Card>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {logs.length === 0 ? (
              <div className="text-center py-12 opacity-50">
                <Typography>No history yet</Typography>
              </div>
            ) : (
              logs.map((log) => {
                const med = meds.find(m => m.id === log.medicationId);
                return (
                  <div key={log.id} className="flex items-start gap-3 border-l-2 border-primary/20 pl-4 py-2">
                    <div className="mt-1">
                      <Typography variant="caption" className="font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </div>
                    <div className="flex-1">
                      <Typography className="font-medium">{med?.name || "Unknown Medication"}</Typography>
                      <Typography variant="caption" className="text-accent">Dose confirmed</Typography>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-warning/10 border-warning/20">
        <div className="flex gap-3">
          <AlertCircle className="text-warning w-5 h-5 flex-shrink-0" />
          <Typography variant="caption" className="text-warning-dark">
            Always follow your surgeon's specific medication protocol.
          </Typography>
        </div>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-dark-card w-full max-w-md rounded-3xl p-6 space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Typography variant="display" className="text-xl">Add Medication</Typography>
              <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Typography variant="caption" className="font-bold uppercase tracking-wider">Medicine Name</Typography>
                <input 
                  type="text" 
                  placeholder="e.g. Ibuprofen"
                  className="w-full bg-gray-50 dark:bg-dark-surface border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Typography variant="caption" className="font-bold uppercase tracking-wider">Dosage (Optional)</Typography>
                <input 
                  type="text" 
                  placeholder="e.g. 400mg"
                  className="w-full bg-gray-50 dark:bg-dark-surface border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20"
                  value={newDose}
                  onChange={(e) => setNewDose(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Typography variant="caption" className="font-bold uppercase tracking-wider">Time</Typography>
                  <input 
                    type="time" 
                    className="w-full bg-gray-50 dark:bg-dark-surface border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Typography variant="caption" className="font-bold uppercase tracking-wider">Food Timing</Typography>
                  <select 
                    className="w-full bg-gray-50 dark:bg-dark-surface border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20"
                    value={newFoodTiming}
                    onChange={(e) => setNewFoodTiming(e.target.value as any)}
                  >
                    <option value="before">Before Food</option>
                    <option value="during">During Food</option>
                    <option value="after">After Food</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="caption" className="font-bold uppercase tracking-wider">Duration (Days)</Typography>
                <input 
                  type="number" 
                  placeholder="e.g. 7"
                  className="w-full bg-gray-50 dark:bg-dark-surface border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                />
              </div>
            </div>

            <Button className="w-full py-4 rounded-2xl text-lg font-bold" onClick={handleSave}>
              Save Medication
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
