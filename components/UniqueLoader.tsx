
import React, { useState, useEffect } from 'react';

interface UniqueLoaderProps {
  activeTool?: string;
}

const UniqueLoader: React.FC<UniqueLoaderProps> = ({ activeTool }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Neural Link...");
  const [hex, setHex] = useState("0x0000");

  const statusMessages = [
    "Grounding Web Signals...",
    "Analyzing Data Shards...",
    "Synthesizing Hinglish Tone...",
    "Applying Advanced AI Logic...",
    "Parsing Visual Entities...",
    "Verifying Global Records...",
    "Finalizing Insight Stream..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        const increment = prev < 40 ? 3 : prev < 75 ? 1 : 0.3;
        return prev + increment;
      });
    }, 100);

    const messageInterval = setInterval(() => {
      setStatus(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
      setHex(`0x${Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')}`);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  // Constants for SVG
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 animate-in fade-in duration-1000">
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* Holographic Background Grid */}
        <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-3xl scale-125 opacity-20 animate-pulse"></div>
        
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Background Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="8"
          />

          {/* Dynamic Progress Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="url(#ringGradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            filter="url(#glow)"
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />

          {/* Outer Dashed Orbit */}
          <circle
            cx={center}
            cy={center}
            r={radius + 25}
            fill="transparent"
            stroke="rgba(59, 130, 246, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 8"
            className="animate-[spin_12s_linear_infinite]"
          />

          {/* Bit-Pulse Points */}
          {[0, 90, 180, 270].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = center + (radius + 25) * Math.cos(rad);
            const y = center + (radius + 25) * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                className="fill-blue-500/40 animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            );
          })}
        </svg>

        {/* Central Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <span className={`text-6xl font-black text-white tracking-tighter ${progress > 90 ? 'animate-glitch' : ''}`}>
                {Math.round(progress)}
              </span>
              <span className="text-xl font-bold text-blue-500 absolute -right-6 top-1">%</span>
            </div>
            
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className="flex gap-1 h-1">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-full rounded-full transition-all duration-300 ${
                      progress > (i + 1) * 25 ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-white/10'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">
                Neural Scan
              </span>
            </div>
          </div>
        </div>

        {/* Floating Peripheral Data */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-[8px] font-mono text-blue-400/30 opacity-0 md:opacity-100">
          <div className="flex items-center gap-1"><span className="w-1 h-1 bg-blue-400/30"></span> HEX_{hex}</div>
          <div className="flex items-center gap-1"><span className="w-1 h-1 bg-blue-400/30"></span> BIT_LAK_{Math.round(progress * 1.4)}</div>
          <div className="flex items-center gap-1"><span className="w-1 h-1 bg-blue-400/30"></span> SIG_VER_1.2</div>
        </div>

        <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-[8px] font-mono text-blue-400/30 text-right opacity-0 md:opacity-100">
          <div className="justify-end flex items-center gap-1">NODE_WEST <span className="w-1 h-1 bg-blue-400/30"></span></div>
          <div className="justify-end flex items-center gap-1">STAT_001_OK <span className="w-1 h-1 bg-blue-400/30"></span></div>
          <div className="justify-end flex items-center gap-1">SYNC_MASTER <span className="w-1 h-1 bg-blue-400/30"></span></div>
        </div>
      </div>

      {/* Primary Status Banner */}
      <div className="mt-8 flex flex-col items-center text-center max-w-sm px-6">
        <div className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-4 flex items-center gap-3">
          <div className="relative w-3 h-3">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-40"></div>
            <div className="absolute inset-0 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-white font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
            {status}
          </p>
        </div>
        <p className="text-slate-500 text-[10px] font-medium leading-relaxed uppercase tracking-widest opacity-40">
          Powered by Gemini 3 Multi-Agent Infrastructure
        </p>
      </div>

      <style>{`
        @keyframes glitch {
          0% { text-shadow: 2px 0 #ff00c1, -2px 0 #00fff9; transform: translate(0); }
          25% { transform: translate(-1px, 1px); }
          50% { text-shadow: -2px 0 #ff00c1, 2px 0 #00fff9; transform: translate(1px, -1px); }
          75% { transform: translate(0); }
          100% { text-shadow: 2px 0 #ff00c1, -2px 0 #00fff9; }
        }
        .animate-glitch {
          animation: glitch 0.3s cubic-bezier(.25,.46,.45,.94) infinite both;
        }
      `}</style>
    </div>
  );
};

export default UniqueLoader;
