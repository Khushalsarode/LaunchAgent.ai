import React, { useState, useRef, useEffect, useMemo } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
import {
  Send, Mic, Volume2, VolumeX,
  X, MessageSquare, Sparkles, Terminal
} from "lucide-react";

const ProjectChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Systems online. I am your Agentic Launch Co-founder. How can we accelerate your idea today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Initialize ElevenLabs Client
  const elevenlabs = useMemo(() => new ElevenLabsClient({
    apiKey: import.meta.env.VITE_EVELEN_LAB_VOICE_KEY,
  }), []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔊 ELEVENLABS VOICE LOGIC
  const speakResponse = async (text) => {
    if (muted || !text) return;
    try {
      const audio = await elevenlabs.textToSpeech.convert(
        "JBFqnCBsd6RMkjVDRZzb", // George
        {
          text: text,
          modelId: "eleven_turbo_v2_5",
          outputFormat: "mp3_44100_128",
        }
      );
      await play(audio);
    } catch (error) {
      console.error("ElevenLabs Voice Error:", error);
    }
  };

  // 🧠 GEMINI & FLOW LOGIC
  const handleSend = async (voiceInput = null) => {
    const finalInput = voiceInput || input;
    if (!finalInput.trim() || loading) return;

    // 1. Add User Message to UI
    const currentMessages = [...messages, { role: "user", text: finalInput }];
    setMessages(currentMessages);
    setInput("");
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      // NOTE: Using gemini-1.5-flash for maximum stability/uplink
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Context: You are the 'Launch Intelligence Agent'.
        Style: Professional, sharp, brief, founder-focused.
        User Prompt: ${finalInput}
      `;

      const result = await model.generateContent(prompt);
      const botText = result.response.text();

      // 2. Add Bot Message to UI
      setMessages(prev => [...prev, { role: "bot", text: botText }]);

      // 3. Trigger Voice (Works for both Text and Voice inputs)
      if (!muted) {
        speakResponse(botText);
      }
    } catch (err) {
      console.error("Uplink Error:", err);
      setMessages(prev => [...prev, { role: "bot", text: "Signal lost. Re-check API uplink." }]);
    } finally {
      setLoading(false);
    }
  };

  // 🎤 MIC LOGIC
  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser not supported. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      handleSend(transcript); // This sends to Gemini, which then triggers the voice
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center z-[100] transition-all active:scale-95"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-[#02040a] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden z-[100] backdrop-blur-2xl">
          {/* Header */}
          <div className="bg-white/5 border-b border-white/5 px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-indigo-400" />
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Agent Intelligence</h2>
            </div>
            <button onClick={() => setMuted(!muted)} className="text-slate-500 hover:text-white">
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          {/* Chat Space */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white/5 text-slate-300 rounded-tl-none border border-white/5"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="animate-pulse text-indigo-500 text-xs">Processing...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  className="w-full bg-white/5 px-5 py-3.5 rounded-2xl outline-none text-slate-200 border border-white/10 text-xs"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="System command..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={toggleListening}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${listening ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}
                >
                  <Mic size={18} />
                </button>
              </div>
              <button onClick={() => handleSend()} className="bg-indigo-600 p-3.5 rounded-2xl text-white">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectChatbot;