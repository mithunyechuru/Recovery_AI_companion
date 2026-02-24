import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Brain, ChevronRight, Heart, Users, AlertCircle } from 'lucide-react';
import { Card, Button, Typography, cn } from '../components/UI';
import { AuthUser } from '../types';

interface LoginProps {
  onLogin: (user: AuthUser) => void;
  onSignUp: (user: AuthUser) => void;
  users: AuthUser[];
}

export function LoginScreen({ onLogin, onSignUp, users }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1);
  const [role, setRole] = useState<'patient' | 'caretaker'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [recoveryFrom, setRecoveryFrom] = useState('');
  const [recoveryDays, setRecoveryDays] = useState<number | string>(30);
  const [initialMood, setInitialMood] = useState<'great' | 'good' | 'okay' | 'bad' | 'terrible'>('okay');
  const [avatar, setAvatar] = useState('🦁');
  const [error, setError] = useState('');

  const AVATARS = ['🦁', '🐸', '🐯', '🐰', '🐝', '🐻', '🦋', '🌴', '🐳', '🐱'];

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setSignUpStep(1);
    setError('');
  };

  const handleAction = () => {
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      if (signUpStep === 1 && role === 'patient') {
        setSignUpStep(2);
        return;
      }
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError('User already exists');
        return;
      }
      onSignUp({ 
        email, 
        password, 
        name, 
        role,
        recoveryFrom: role === 'patient' ? recoveryFrom : undefined,
        recoveryDays: role === 'patient' ? Number(recoveryDays) || 0 : undefined,
        initialMood: role === 'patient' ? initialMood : undefined,
        avatar: role === 'patient' ? avatar : undefined
      });
    } else {
      const user = users.find(u => u.email === email && u.password === password && u.role === role);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials or role');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-mesh flex items-center justify-center p-4 z-[100]">
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-[32px] shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
        
        {/* Sign In Form */}
        <motion.div 
          className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 lg:p-16 bg-white"
          animate={{ x: isSignUp ? '100%' : '0%', opacity: isSignUp ? 0 : 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="w-full max-w-sm flex flex-col items-center">
            <Typography variant="display" className="text-4xl text-gray-900 mb-2 font-bold">Sign In</Typography>
            <Typography variant="caption" className="mb-8 text-gray-500">Welcome back to NeuroNova</Typography>
            
            <div className="w-full space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {error && !isSignUp && (
              <div className="mt-4 flex items-center gap-2 text-red-500 text-sm font-medium">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            
            <div className="mt-8 flex flex-col items-center gap-6 w-full">
              <div className="flex bg-gray-100 p-1 rounded-xl w-full">
                <button 
                  onClick={() => setRole('patient')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                    role === 'patient' ? "bg-white text-primary shadow-sm" : "text-gray-400"
                  )}
                >
                  <Heart className="w-4 h-4" /> Patient
                </button>
                <button 
                  onClick={() => setRole('caretaker')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                    role === 'caretaker' ? "bg-white text-primary shadow-sm" : "text-gray-400"
                  )}
                >
                  <Users className="w-4 h-4" /> Caretaker
                </button>
              </div>
              
              <Button 
                className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                onClick={handleAction}
              >
                Sign In
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Form */}
        <motion.div 
          className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 lg:p-16 bg-white absolute right-0"
          animate={{ x: isSignUp ? '0%' : '-100%', opacity: isSignUp ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{ pointerEvents: isSignUp ? 'auto' : 'none' }}
        >
          <div className="w-full max-w-sm flex flex-col items-center">
            <Typography variant="display" className="text-4xl text-gray-900 mb-2 font-bold">
              {signUpStep === 1 ? 'Create Account' : 'Recovery Details'}
            </Typography>
            <Typography variant="caption" className="mb-8 text-gray-500">
              {signUpStep === 1 ? 'Join our recovery community' : 'Tell us about your journey'}
            </Typography>
            
            <AnimatePresence mode="wait">
              {signUpStep === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Recovering from?</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ACL Surgery, Broken Arm" 
                      value={recoveryFrom}
                      onChange={(e) => setRecoveryFrom(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Recovery Duration (Days)</label>
                    <input 
                      type="number" 
                      value={recoveryDays}
                      onChange={(e) => setRecoveryDays(e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="w-full bg-gray-100 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">How are you feeling?</label>
                    <div className="flex justify-between gap-2">
                      {(['terrible', 'bad', 'okay', 'good', 'great'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setInitialMood(m)}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-[10px] font-bold capitalize transition-all",
                            initialMood === m ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-400"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Choose your Avatar</label>
                    <div className="grid grid-cols-5 gap-2">
                      {AVATARS.map((a) => (
                        <button
                          key={a}
                          onClick={() => setAvatar(a)}
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all",
                            avatar === a ? "bg-primary/20 ring-2 ring-primary" : "bg-gray-100 grayscale hover:grayscale-0"
                          )}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && isSignUp && (
              <div className="mt-4 flex items-center gap-2 text-red-500 text-sm font-medium">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-6 w-full">
              {signUpStep === 1 && (
                <div className="flex bg-gray-100 p-1 rounded-xl w-full">
                  <button 
                    onClick={() => setRole('patient')}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                      role === 'patient' ? "bg-white text-primary shadow-sm" : "text-gray-400"
                    )}
                  >
                    <Heart className="w-4 h-4" /> Patient
                  </button>
                  <button 
                    onClick={() => setRole('caretaker')}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                      role === 'caretaker' ? "bg-white text-primary shadow-sm" : "text-gray-400"
                    )}
                  >
                    <Users className="w-4 h-4" /> Caretaker
                  </button>
                </div>
              )}
              
              <div className="flex gap-3 w-full">
                {signUpStep === 2 && (
                  <Button 
                    variant="ghost"
                    className="flex-1 py-4 rounded-xl text-sm font-bold"
                    onClick={() => setSignUpStep(1)}
                  >
                    Back
                  </Button>
                )}
                <Button 
                  className="flex-1 py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  onClick={handleAction}
                >
                  {signUpStep === 1 && role === 'patient' ? 'Next' : 'Sign Up'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overlay Container */}
        <motion.div 
          className="hidden md:flex absolute top-0 left-1/2 w-1/2 h-full bg-primary z-20 flex-col items-center justify-center text-white text-center p-12"
          animate={{ x: isSignUp ? '-100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90" />
          
          <AnimatePresence mode="wait">
            {!isSignUp ? (
              <motion.div
                key="overlay-signin"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative z-30 space-y-6 flex flex-col items-center"
              >
                <Typography variant="display" className="text-5xl text-white font-bold">Hello, Friend!</Typography>
                <Typography className="text-lg opacity-90 text-white max-w-xs">Enter your details and start journey with us</Typography>
                <Button 
                  variant="outline" 
                  className="mt-8 border-white text-white hover:bg-white hover:text-primary rounded-full px-12 py-3 uppercase tracking-widest font-bold transition-all"
                  onClick={toggleMode}
                >
                  Sign Up
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="overlay-signup"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative z-30 space-y-6 flex flex-col items-center"
              >
                <Typography variant="display" className="text-5xl text-white font-bold">Welcome Back!</Typography>
                <Typography className="text-lg opacity-90 text-white max-w-xs">To keep connected with us please login with your personal info</Typography>
                <Button 
                  variant="outline" 
                  className="mt-8 border-white text-white hover:bg-white hover:text-primary rounded-full px-12 py-3 uppercase tracking-widest font-bold transition-all"
                  onClick={toggleMode}
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Mobile Toggle */}
        <div className="md:hidden p-4 bg-gray-50 flex justify-center border-t">
          <button 
            onClick={toggleMode}
            className="text-primary font-bold flex items-center gap-2"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
