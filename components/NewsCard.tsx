
import React from 'react';
import { NewsInfo, GroundingSource } from '../types';

interface NewsCardProps {
  info: NewsInfo;
  sources: GroundingSource[];
}

const NewsCard: React.FC<NewsCardProps> = ({ info, sources }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-up duration-500">
      <div className="glass-card p-8 rounded-[2rem] border border-white/10 bg-orange-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-2">Real-time Trend Analysis</h3>
          <h2 className="text-4xl font-black text-white tracking-tighter capitalize">"{info.topic}"</h2>
        </div>
        <div className="flex -space-x-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">
              🔥
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {info.newsItems.map((item, idx) => (
          <div key={idx} className="glass-card p-10 rounded-[3rem] border border-white/5 hover:border-orange-500/20 transition-all group relative overflow-hidden">
            {/* Viral Badge */}
            <div className="absolute top-8 right-8 flex flex-col items-center">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Viral Potential</div>
              <div className="text-2xl font-black text-orange-400">{item.viralScore}%</div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">Story 0{idx+1}</span>
                    <h4 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors leading-tight">
                        {item.title}
                    </h4>
                </div>
                
                <p className="text-slate-300 text-lg font-medium leading-relaxed">
                  {item.summary}
                </p>

                {/* Viral Hook */}
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Reel Hook (Hinglish)</span>
                  </div>
                  <p className="text-emerald-200 text-lg font-black italic">
                    "{item.hook}"
                  </p>
                </div>

                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Creator Strategy</span>
                  </div>
                  <p className="text-blue-200 text-sm font-semibold">
                    {item.creatorTip}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-4">
                 <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black text-slate-300 hover:text-white transition-all uppercase tracking-widest"
                  >
                    Read Full Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sources.length > 0 && (
        <div className="p-8 glass-card rounded-[2.5rem] border border-white/5">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Signal Verification</h3>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, idx) => (
              source.uri && (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  {source.title || 'Official Source'}
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;
