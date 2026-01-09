
import React from 'react';
import { IFSCInfo, GroundingSource } from '../types';

interface IFSCCardProps {
  info: IFSCInfo;
  sources: GroundingSource[];
}

const IFSCCard: React.FC<IFSCCardProps> = ({ info, sources }) => {
  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden animate-in fade-in slide-up duration-500 border border-white/10">
      <div className="p-8 border-b border-white/5 bg-emerald-500/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">{info.bankName}</h2>
          <p className="text-emerald-400 font-mono text-sm tracking-[0.2em] font-bold uppercase">{info.ifsc}</p>
        </div>
        <div className="text-left md:text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">MICR Signal</p>
            <p className="text-lg font-bold text-slate-300">{info.micr || 'N/A'}</p>
        </div>
      </div>
      
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <DetailItem label="Branch" value={info.branch} />
        <DetailItem label="City" value={info.city} />
        <DetailItem label="State" value={info.state} />
        <DetailItem label="Contact" value={info.contact || 'N/A'} />
        <div className="md:col-span-2">
          <DetailItem label="Verified Branch Address" value={info.address} />
        </div>
      </div>

      {sources.length > 0 && (
        <div className="p-8 bg-black/20 border-t border-white/5">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Direct API Feedback</h3>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, idx) => (
              source.uri && (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all"
                >
                  {source.title || 'Official Registry'}
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
    <p className="text-slate-200 font-bold text-lg">{value}</p>
  </div>
);

export default IFSCCard;
