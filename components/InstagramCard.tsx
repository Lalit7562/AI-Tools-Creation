
import React from 'react';
import { InstagramInfo, GroundingSource } from '../types';

interface InstagramCardProps {
  info: InstagramInfo;
  sources: GroundingSource[];
}

const InstagramCard: React.FC<InstagramCardProps> = ({ info, sources }) => {
  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden animate-in fade-in slide-up duration-500 border border-white/10">
      <div className="p-10 border-b border-white/5 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full blur-md opacity-50 animate-pulse"></div>
            <div className="relative w-28 h-28 bg-slate-900 rounded-full p-1 flex items-center justify-center border-2 border-white/10">
              <span className="text-4xl font-black text-slate-700">{info.fullName.charAt(0)}</span>
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-black text-white">@{info.username}</h2>
              {info.isVerified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-slate-300 font-bold mb-4">{info.fullName}</p>
            <p className="text-slate-500 text-sm leading-relaxed italic max-w-xl">{info.bio}</p>
          </div>
        </div>
        
        <div className="flex justify-around md:justify-start md:gap-20 mt-12 text-center">
          <StatItem label="Post Density" value={info.posts} />
          <StatItem label="Global Reach" value={info.followers} />
          <StatItem label="Social Graph" value={info.following} />
        </div>
      </div>

      <div className="p-8 bg-black/20 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${info.isPrivate ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            {info.isPrivate ? 'Restricted Profile' : 'Open Entity'}
        </div>
      </div>

      {sources.length > 0 && (
        <div className="p-8 bg-black/30 border-t border-white/5">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Signal Provenance</h3>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, idx) => (
              source.uri && (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-pink-500/5 border border-pink-500/10 rounded-xl text-xs font-bold text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/20 transition-all"
                >
                  {source.title || 'Web Intelligence'}
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-2xl font-black text-white leading-none mb-2">{value}</p>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
  </div>
);

export default InstagramCard;
