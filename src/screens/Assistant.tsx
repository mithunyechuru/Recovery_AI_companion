import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, Brain } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card, Button, Typography, cn } from '../components/UI';

const getApiKey = () => {
  return (import.meta as any).env.VITE_GEMINI_API_KEY || '';
};

export function AssistantScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Hi Alex, I'm your recovery companion. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string) => {
    if (!ttsEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = async (text: string) => {
    const key = getApiKey();
    if (!key) {
      setError("AI Configuration Error: API Key is missing. Please ensure VITE_GEMINI_API_KEY is set in your .env file.");
      return;
    }
    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInput('');

    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setError("AI Configuration Error: API Key is missing. Please check your .env file.");
        return;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are Fade Fit, a compassionate AI recovery assistant for someone recovering from ACL surgery. Be brief, encouraging, and medical-focused but friendly. Use the user's name Alex."
      });

      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      });

      const result = await chat.sendMessage(text);
      const aiText = result.response.text() || "I'm here to help.";
      setMessages([...newMessages, { role: 'ai', content: aiText }]);
      speak(aiText);
      setError(null);
    } catch (err: any) {
      console.error("AI Error:", err);
      const errMsg = err?.message || "I'm having trouble connecting right now.";
      setError(`AI Error: ${errMsg}`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Brain className="text-white w-6 h-6" />
        </div>
        <div className="flex-1">
          <Typography variant="display" className="text-xl">Fade Fit AI</Typography>
          <div className="flex items-center gap-2">
            <Typography variant="caption" className="text-accent">Online & Ready</Typography>
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={cn(
                "p-1 rounded-md transition-colors",
                ttsEnabled ? "text-primary bg-primary/10" : "text-gray-400 bg-gray-100 dark:bg-dark-surface"
              )}
            >
              {ttsEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] p-4 rounded-2xl",
                msg.role === 'user'
                  ? "bg-primary text-white rounded-tr-none"
                  : "bg-white dark:bg-dark-card shadow-sm border border-black/5 dark:border-white/10 rounded-tl-none"
              )}>
                <Typography>{msg.content}</Typography>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center p-2"
          >
            <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs px-4 py-2 rounded-full border border-red-200 dark:border-red-800">
              {error}
            </div>
          </motion.div>
        )}
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1 p-2"
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ height: [8, 16, 8] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["How's my progress?", "Medication check", "Pain management tips"].map((tip) => (
            <button
              key={tip}
              onClick={() => handleSend(tip)}
              className="whitespace-nowrap px-4 py-2 bg-white dark:bg-dark-card rounded-full border border-black/5 dark:border-white/10 text-sm hover:bg-gray-50 transition-colors"
            >
              {tip}
            </button>
          ))}
        </div>

        <div className="relative flex items-center gap-2">
          <Card className="flex-1 p-2 flex items-center gap-2 rounded-2xl">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            />
            <Button
              variant={isListening ? "danger" : "ghost"}
              size="icon"
              onClick={startListening}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </Card>
          <Button
            size="icon"
            className="h-12 w-12 rounded-2xl"
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-primary/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white"
        >
          <div className="relative mb-12">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-white rounded-full"
            />
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <Mic className="w-12 h-12 text-primary" />
            </div>
          </div>
          <Typography variant="display" className="text-2xl mb-2">Listening...</Typography>
          <Typography className="opacity-70 mb-12">"Tell me about your pain level"</Typography>
          <Button
            variant="ghost"
            className="text-white border border-white/20 px-8"
            onClick={() => setIsListening(false)}
          >
            Cancel
          </Button>
        </motion.div>
      )}
    </div>
  );
}
