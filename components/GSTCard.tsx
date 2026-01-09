
import React from 'react';
import { GSTInfo, GroundingSource } from '../types';

interface GSTCardProps {
  info: GSTInfo;
  sources: GroundingSource[];
}

const GSTCard: React.FC<GSTCardProps> = ({ info, sources }) => {
  const statusColors = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Inactive: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const currentStatusStyle = statusColors[info.gstStatus as keyof typeof statusColors] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden animate-in fade-in slide-up duration-500 border border-white/10">
      <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">{info.legalName}</h2>
          <p className="text-blue-400 font-mono text-sm tracking-[0.2em] font-bold">{info.gstNumber}</p>
        </div>
        <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] border self-start md:self-center ${currentStatusStyle}`}>
          {info.gstStatus.toUpperCase()}
        </span>
      </div>
      
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <DetailItem label="Trade Name" value={info.tradeName || 'N/A'} />
        <DetailItem label="Constitution" value={info.constitutionOfBusiness} />
        <DetailItem label="Taxpayer Type" value={info.taxpayerType} />
        <DetailItem label="Registration Date" value={info.registrationDate} />
        <DetailItem label="State Jurisdiction" value={info.stateJurisdiction} />
        <DetailItem label="Center Jurisdiction" value={info.centerJurisdiction} />
        <div className="md:col-span-2">
          <DetailItem label="Principal Address" value={info.address} />
        </div>
      </div>

      {sources.length > 0 && (
        <div className="p-8 bg-black/20 border-t border-white/5">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Verification Provenance</h3>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, idx) => (
              source.uri && (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all"
                >
                  {source.title || 'Official Document'}
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

export default GSTCard;
