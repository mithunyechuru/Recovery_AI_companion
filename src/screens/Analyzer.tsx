import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, AlertCircle, CheckCircle2, RefreshCw, ChevronRight, X, Activity, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Card, Button, Typography, cn } from '../components/UI';
import { AnalysisResult, AssessmentLevel } from '../types';

const getApiKey = () => {
  return (import.meta as any).env.VITE_GEMINI_API_KEY || '';
};

export function AnalyzerScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    const key = getApiKey();
    if (!key) {
      setError("AI Configuration Error: API Key is missing. Please ensure VITE_GEMINI_API_KEY is set in your .env file.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        setError("AI Configuration Error: API Key is missing. Please check your .env file.");
        return;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              analysis: { type: SchemaType.STRING },
              assessment: { type: SchemaType.STRING },
              guidance: { type: SchemaType.STRING },
              reassurance: { type: SchemaType.STRING },
              actionSteps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            },
            required: ["analysis", "assessment", "guidance", "reassurance", "actionSteps"]
          }
        }
      });

      let prompt = `You are a medical recovery assistant. Analyze the following symptom report (text and/or image). 
      Provide a structured response.
      
      User Report: ${text || "See attached image"}`;

      const contents: any[] = [{ text: prompt }];

      if (image) {
        contents.push({
          inlineData: {
            data: image.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: contents }]
      });

      const data = JSON.parse(result.response.text() || '{}') as AnalysisResult;
      setResult(data);
      setError(null);
      if (ttsEnabled) {
        speak(data.analysis + ". " + data.guidance);
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      const errMsg = err?.message || "Analysis failed. Please try again.";
      setError(`Analysis Error: ${errMsg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={cn(
              "p-2 rounded-xl transition-colors",
              ttsEnabled ? "text-primary bg-primary/10" : "text-gray-400 bg-gray-100"
            )}
          >
            {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <Button variant="ghost" size="icon" onClick={() => { setImage(null); setText(''); setResult(null); }}>
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
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

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <Typography variant="caption">{error}</Typography>
        </motion.div>
      )}

      <Typography variant="caption" className="text-center block px-4 opacity-50">
        Disclaimer: Fade Fit is an AI assistant and not a substitute for professional medical advice. Always contact your doctor for emergencies.
      </Typography>
    </div>
  );
}
