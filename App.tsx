
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { fetchGSTDetails, fetchIFSCDetails, fetchInstagramDetails, fetchNewsDetails, processVisualAI } from './services/geminiService';
import GSTCard from './components/GSTCard';
import IFSCCard from './components/IFSCCard';
import InstagramCard from './components/InstagramCard';
import NewsCard from './components/NewsCard';
import VisualCard from './components/VisualCard';
import UniqueLoader from './components/UniqueLoader';
import { GSTInfo, IFSCInfo, InstagramInfo, NewsInfo, VisualInfo, GroundingSource, ActiveTool } from './types';

interface ToolDefinition {
  id: ActiveTool;
  title: string;
  subtitle: string;
  placeholder: string;
  icon: string;
  color: string;
  category: 'Finance' | 'Social' | 'Vision';
  description: string;
  latency: string;
  validate: (val: string) => boolean;
  fetch: any;
}

const TOOL_REGISTRY: Record<ActiveTool, ToolDefinition> = {
  gst: {
    id: 'gst',
    category: 'Finance',
    title: 'GST Insight',
    subtitle: 'Corporate Registry',
    placeholder: 'Enter 15-digit GSTIN',
    icon: '🏢',
    color: 'emerald',
    latency: '1.4s',
    description: 'Fetch legal company names, trade details, and active compliance status via official grounding.',
    validate: (val: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val.toUpperCase()),
    fetch: fetchGSTDetails
  },
  ifsc: {
    id: 'ifsc',
    category: 'Finance',
    title: 'IFSC Sync',
    subtitle: 'Banking Node',
    placeholder: 'Enter 11-digit IFSC',
    icon: '💳',
    color: 'emerald',
    latency: '0.8s',
    description: 'Instant branch verification and routing signal synchronization for bank nodes.',
    validate: (val: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val.toUpperCase()),
    fetch: fetchIFSCDetails
  },
  instagram: {
    id: 'instagram',
    category: 'Social',
    title: 'Social Audit',
    subtitle: 'Profile Intel',
    placeholder: 'Enter @username',
    icon: '🤳',
    color: 'pink',
    latency: '1.8s',
    description: 'Public profile intelligence, follower signal verification, and audit of social presence.',
    validate: (val: string) => val.trim().length > 1,
    fetch: fetchInstagramDetails
  },
  news: {
    id: 'news',
    category: 'Social',
    title: 'Pulse News',
    subtitle: 'Creator Trends',
    placeholder: 'Topic (e.g. AI News)',
    icon: '🔥',
    color: 'orange',
    latency: '2.1s',
    description: 'Viral creator trends in Hinglish with specific social media hooks and strategy.',
    validate: (val: string) => val.trim().length > 2,
    fetch: fetchNewsDetails
  },
  visual: {
    id: 'visual',
    category: 'Vision',
    title: 'Vision Lab',
    subtitle: 'Neural Engine',
    placeholder: 'Upload Image',
    icon: '👁️',
    color: 'indigo',
    latency: '2.5s',
    description: 'Multimodal vision for OCR text extraction and intelligent background masking.',
    validate: (val: string) => val.length > 0,
    fetch: null
  }
};

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool | null>(null);
  const [input, setInput] = useState('');
  const [visualMode, setVisualMode] = useState<'ocr' | 'bg-remove'>('ocr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [results, setResults] = useState<{
    gst: { data: GSTInfo; sources: GroundingSource[] } | null;
    ifsc: { data: IFSCInfo; sources: GroundingSource[] } | null;
    instagram: { data: InstagramInfo; sources: GroundingSource[] } | null;
    news: { data: NewsInfo; sources: GroundingSource[] } | null;
    visual: { data: VisualInfo; sources: GroundingSource[] } | null;
  }>({ gst: null, ifsc: null, instagram: null, news: null, visual: null });

  const currentTool = useMemo(() => activeTool ? TOOL_REGISTRY[activeTool] : null, [activeTool]);

  const handleToolSelect = (tool: ActiveTool) => {
    setActiveTool(tool);
    setError(null);
    setInput('');
  };

  const handleBackToDashboard = () => {
    setActiveTool(null);
    setInput('');
    setError(null);
  };

  const triggerSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !currentTool || !activeTool) return;
    
    if (activeTool !== 'visual' && !currentTool.validate(searchQuery)) {
        setError(`Format Mismatch: Please check the ${currentTool.title} input protocol.`);
        return;
    }

    setLoading(true);
    setError(null);
    setResults(prev => ({ ...prev, [activeTool]: null }));

    try {
      if (activeTool === 'visual') {
        const res = await processVisualAI(searchQuery, visualMode);
        setResults(prev => ({
          ...prev,
          visual: { data: { mode: visualMode, originalImage: searchQuery, ...res.data }, sources: [] }
        }));
      } else if (currentTool.fetch) {
        const res = await currentTool.fetch(searchQuery);
        let dataToStore = res.data;
        if (activeTool === 'gst') dataToStore = { ...dataToStore, gstNumber: searchQuery };
        if (activeTool === 'ifsc') dataToStore = { ...dataToStore, ifsc: searchQuery };
        if (activeTool === 'instagram') dataToStore = { ...dataToStore, username: searchQuery };
        if (activeTool === 'news') dataToStore = { ...dataToStore, topic: searchQuery };

        setResults(prev => ({
          ...prev,
          [activeTool]: { data: dataToStore, sources: res.sources }
        }));
      }
    } catch (err: any) {
      setError(err.message || "Sync Timeout: Neural core failed to resolve grounding signals.");
    } finally {
      setLoading(false);
    }
  }, [activeTool, currentTool, visualMode]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setInput(base64);
        if (activeTool === 'visual') triggerSearch(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(input);
  };

  const toolsByCategory = useMemo(() => {
    const groups: Record<string, ToolDefinition[]> = {};
    Object.values(TOOL_REGISTRY).forEach(tool => {
      if (!groups[tool.category]) groups[tool.category] = [];
      groups[tool.category].push(tool);
    });
    return groups;
  }, []);

  return (
    <div className="min-h-screen pb-24 ai-gradient-bg selection:bg-blue-500/30">
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto border-b border-white/5 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleBackToDashboard}>
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
            <span className="text-white text-sm font-black">NC</span>
          </div>
          <h1 className="text-xs font-black tracking-[0.2em] text-white uppercase flex items-center gap-2">
            Neural<span className="text-blue-500">Core</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-blue-500/10 text-blue-400 text-[8px] border border-blue-500/20">v3.1</span>
          </h1>
        </div>
        
        {activeTool ? (
          <button onClick={handleBackToDashboard} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            Return to Hub
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active</span>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {!activeTool ? (
          <div className="animate-in fade-in duration-1000">
            <div className="mb-12">
              <p className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em] mb-3">Intelligence Terminal</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-none">
                Grounded <br/>
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">Multi-Agent Hub.</span>
              </h2>
            </div>

            {/* FINANCE SECTION */}
            <div className="mb-10">
               <div className="flex items-center gap-3 mb-4">
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em]">Section_01 // Finance</span>
                  <div className="h-[1px] bg-emerald-500/10 flex-1"></div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolsByCategory['Finance'].map((tool, i) => (
                    <ToolNode key={tool.id} tool={tool} index={i} onClick={() => handleToolSelect(tool.id)} />
                  ))}
               </div>
            </div>

            {/* SOCIAL SECTION */}
            <div className="mb-10">
               <div className="flex items-center gap-3 mb-4">
                  <span className="text-[8px] font-black text-pink-500 uppercase tracking-[0.4em]">Section_02 // Social</span>
                  <div className="h-[1px] bg-pink-500/10 flex-1"></div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolsByCategory['Social'].map((tool, i) => (
                    <ToolNode key={tool.id} tool={tool} index={i} onClick={() => handleToolSelect(tool.id)} />
                  ))}
               </div>
            </div>

            {/* VISION SECTION */}
            <div className="mb-10">
               <div className="flex items-center gap-3 mb-4">
                  <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.4em]">Section_03 // Vision</span>
                  <div className="h-[1px] bg-indigo-500/10 flex-1"></div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolsByCategory['Vision'].map((tool, i) => (
                    <ToolNode key={tool.id} tool={tool} index={i} onClick={() => handleToolSelect(tool.id)} />
                  ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-up duration-500">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl animate-float">
                {currentTool?.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{currentTool?.title}</h2>
                <div className="flex items-center gap-3">
                   <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.3em]">{currentTool?.subtitle}</p>
                   <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                   <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.3em]">Latency: {currentTool?.latency}</p>
                </div>
              </div>
            </div>

            {activeTool === 'visual' && (
              <div className="flex gap-2 mb-6">
                {(['ocr', 'bg-remove'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setVisualMode(mode)}
                    className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                      visualMode === mode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/10'
                    }`}
                  >
                    {mode === 'ocr' ? 'OCR Extraction' : 'Background Removal'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="relative mb-8">
              {activeTool === 'visual' ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 bg-slate-900/30 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/30 transition-all overflow-hidden"
                >
                  <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
                  {input ? (
                    <img src={input} alt="Preview" className="h-full w-full object-contain p-4" />
                  ) : (
                    <>
                      <div className="text-2xl mb-2 opacity-30">📂</div>
                      <p className="text-slate-600 font-black uppercase tracking-widest text-[8px]">Upload Visual Signal</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative group">
                   <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={currentTool?.placeholder}
                    className="w-full h-14 pl-6 pr-32 bg-slate-900/40 border border-white/5 rounded-xl text-base font-bold focus:outline-none focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-white placeholder:text-slate-700 shadow-xl backdrop-blur-md"
                  />
                  {(activeTool !== 'visual' || input) && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black rounded-lg active:scale-95 transition-all disabled:opacity-50 shadow-lg uppercase tracking-widest"
                    >
                      {loading ? "..." : "Resolve"}
                    </button>
                  )}
                </div>
              )}
            </form>

            {error && <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in"><span className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center">!</span>{error}</div>}

            <div className="space-y-8">
              {loading && <UniqueLoader activeTool={activeTool || undefined} />}
              {!loading && activeTool === 'gst' && results.gst && <GSTCard info={results.gst.data} sources={results.gst.sources} />}
              {!loading && activeTool === 'ifsc' && results.ifsc && <IFSCCard info={results.ifsc.data} sources={results.ifsc.sources} />}
              {!loading && activeTool === 'instagram' && results.instagram && <InstagramCard info={results.instagram.data} sources={results.instagram.sources} />}
              {!loading && activeTool === 'news' && results.news && <NewsCard info={results.news.data} sources={results.news.sources} />}
              {!loading && activeTool === 'visual' && results.visual && <VisualCard info={results.visual.data} />}
              {/* Fix: Use explicit indexing with a type cast to resolve potential narrowing conflicts or null reference errors during dynamic property access. */}
              {activeTool && results[activeTool as keyof typeof results] === null && !loading && (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl opacity-30">
                  <p className="text-slate-600 font-black uppercase tracking-[0.5em] text-[8px]">Grounding System Idle</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style>{`
        .tool-node {
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease, border 0.4s ease;
        }
        .tool-node:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.1);
        }
        .animate-in {
            animation-delay: var(--delay, 0ms);
        }
      `}</style>
    </div>
  );
};

const ToolNode: React.FC<{ tool: ToolDefinition, onClick: () => void, index: number }> = ({ tool, onClick, index }) => (
  <div 
    onClick={onClick} 
    style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}
    className="tool-node glass-card p-5 rounded-2xl cursor-pointer group relative overflow-hidden flex flex-col h-full border border-white/5 animate-in slide-up"
  >
    {/* Minimal Indicator */}
    <div className={`absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-[24px] rounded-full ${
      tool.category === 'Finance' ? 'bg-emerald-500' : tool.category === 'Social' ? 'bg-pink-500' : 'bg-indigo-500'
    }`}></div>

    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-500">{tool.icon}</div>
      <div className="flex flex-col items-end">
         <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Latency</span>
         <span className="text-[8px] font-black text-slate-400 font-mono">{tool.latency}</span>
      </div>
    </div>
    
    <div className="mb-3">
      <h3 className="text-sm font-black text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">{tool.title}</h3>
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{tool.subtitle}</p>
    </div>

    <p className="text-slate-500 text-[10px] font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity line-clamp-2 mb-4">
      {tool.description}
    </p>

    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
       <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em] group-hover:text-slate-500 transition-colors">Invoke Agent</span>
       <span className="text-[10px] text-slate-600 group-hover:translate-x-1 transition-transform group-hover:text-white">→</span>
    </div>
  </div>
);

export default App;
