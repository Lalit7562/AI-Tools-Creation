
import React, { useState } from 'react';
import { VisualInfo } from '../types';

interface VisualCardProps {
  info: VisualInfo;
}

const VisualCard: React.FC<VisualCardProps> = ({ info }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (info.extractedText) {
      navigator.clipboard.writeText(info.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden animate-in fade-in slide-up duration-500 border border-white/10">
      <div className="p-8 border-b border-white/5 bg-indigo-500/5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            {info.mode === 'ocr' ? 'Text Extraction' : 'Background Magic'}
          </h2>
          <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Visual Studio Output</p>
        </div>
        {info.mode === 'ocr' && (
          <button 
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${
              copied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        )}
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Original Image</p>
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-black/20">
              <img src={info.originalImage} alt="Original" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processed Result</p>
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-black/40 relative">
              {info.mode === 'ocr' ? (
                <div className="p-6 text-slate-200 text-sm font-medium h-full overflow-y-auto whitespace-pre-wrap selection:bg-indigo-500/30">
                  {info.extractedText || "No text detected."}
                </div>
              ) : (
                <img src={info.processedImage} alt="Processed" className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>

        {info.mode === 'bg-remove' && info.processedImage && (
          <div className="flex justify-end">
            <a 
              href={info.processedImage} 
              download="ai-vision-output.png"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              Download Studio PNG
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualCard;
