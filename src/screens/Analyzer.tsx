import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, AlertCircle, CheckCircle2, RefreshCw, ChevronRight, X, Activity, Mic, MicOff } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card, Button, Typography, cn } from '../components/UI';
import { AnalysisResult, AssessmentLevel } from '../types';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export function AnalyzerScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSymptom = async () => {
    if (!image && !text) return;

    setIsAnalyzing(true);
    try {
      const model = "gemini-1.5-flash";

      let prompt = `You are a medical recovery assistant. Analyze the following symptom report (text and/or image). 
      Provide a structured response in JSON format including:
      - analysis: A brief explanation of what might be happening.
      - assessment: One of "NORMAL", "MONITOR", "MEDICAL_ATTENTION", "EMERGENCY".
      - guidance: Practical advice for the user.
      - reassurance: A calming message.
      - actionSteps: An array of 3-4 clear next steps.
      
      User Report: ${text || "See attached image"}`;

      const parts: any[] = [{ text: prompt }];

      if (image) {
        parts.push({
          inlineData: {
            data: image.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
      }

      const response = await genAI.models.generateContent({
        model,
        contents: [{ parts }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: { type: Type.STRING },
              assessment: { type: Type.STRING },
              guidance: { type: Type.STRING },
              reassurance: { type: Type.STRING },
              actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["analysis", "assessment", "guidance", "reassurance", "actionSteps"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}') as AnalysisResult;
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAssessmentColor = (level: AssessmentLevel) => {
    switch (level) {
      case AssessmentLevel.NORMAL: return 'text-accent bg-accent/10';
      case AssessmentLevel.MONITOR: return 'text-secondary bg-secondary/10';
      case AssessmentLevel.MEDICAL_ATTENTION: return 'text-warning bg-warning/10';
      case AssessmentLevel.EMERGENCY: return 'text-red-600 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Typography as="h2" variant="display" className="text-2xl">Symptom Analyzer</Typography>
        <Button variant="ghost" size="icon" onClick={() => { setImage(null); setText(''); setResult(null); }}>
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="p-0 overflow-hidden">
              <div
                className="aspect-video bg-gray-100 dark:bg-dark-surface flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-surface/80 transition-colors relative"
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <img src={image} alt="Symptom" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-gray-400 mb-2" />
                    <Typography variant="caption">Tap to take a photo of the area</Typography>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="p-4 relative">
                <textarea
                  placeholder="Describe what you're feeling (e.g., swelling, sharp pain, redness)..."
                  className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[100px] text-gray-700 dark:text-gray-200 pr-12"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  onClick={startListening}
                  className={cn(
                    "absolute right-4 bottom-4 p-2 rounded-full transition-all",
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-gray-100 dark:bg-dark-surface text-gray-400 hover:text-primary"
                  )}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </Card>

            <Button
              className="w-full py-4 rounded-2xl text-lg font-semibold"
              disabled={(!image && !text) || isAnalyzing}
              onClick={analyzeSymptom}
            >
              {isAnalyzing ? (
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              ) : (
                <Activity className="w-6 h-6 mr-2" />
              )}
              {isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className={cn(
              "p-4 rounded-2xl flex items-center gap-3",
              getAssessmentColor(result.assessment as AssessmentLevel)
            )}>
              {result.assessment === AssessmentLevel.NORMAL ? <CheckCircle2 /> : <AlertCircle />}
              <Typography variant="display" className="font-bold">
                {result.assessment.replace('_', ' ')}
              </Typography>
            </div>

            <Card className="space-y-4">
              <div>
                <Typography variant="caption" className="uppercase tracking-wider mb-1">Analysis</Typography>
                <Typography>{result.analysis}</Typography>
              </div>

              <div>
                <Typography variant="caption" className="uppercase tracking-wider mb-1">Guidance</Typography>
                <Typography className="text-primary dark:text-secondary font-medium">{result.guidance}</Typography>
              </div>

              <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 italic">
                <Typography className="text-accent-dark">"{result.reassurance}"</Typography>
              </div>
            </Card>

            <div className="space-y-2">
              <Typography variant="display" className="text-lg">Recommended Steps</Typography>
              {result.actionSteps.map((step, i) => (
                <Card key={i} className="flex items-center gap-3 py-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <Typography className="flex-1">{step}</Typography>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full border-2"
              onClick={() => setResult(null)}
            >
              Start New Analysis
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Typography variant="caption" className="text-center block px-4 opacity-50">
        Disclaimer: NeuroNova is an AI assistant and not a substitute for professional medical advice. Always contact your doctor for emergencies.
      </Typography>
    </div>
  );
}
