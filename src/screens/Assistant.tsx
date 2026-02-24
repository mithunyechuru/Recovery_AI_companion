import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, Brain } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Card, Button, Typography, cn } from '../components/UI';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export function AssistantScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInput('');
    setIsSpeaking(true);

    try {
      const model = "gemini-3-flash-preview";
      const chat = genAI.chats.create({
        model,
        config: {
          systemInstruction: "You are NeuroNova, a compassionate AI recovery assistant for someone recovering from ACL surgery. Be brief, encouraging, and medical-focused but friendly. Use the user's name Alex."
        }
      });

      const response = await chat.sendMessage({ message: text });
      setMessages([...newMessages, { role: 'ai', content: response.text || "I'm here to help." }]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Brain className="text-white w-6 h-6" />
        </div>
        <div>
          <Typography variant="display" className="text-xl">NeuroNova AI</Typography>
          <Typography variant="caption" className="text-accent">Online & Ready</Typography>
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
              onClick={() => setIsListening(!isListening)}
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
