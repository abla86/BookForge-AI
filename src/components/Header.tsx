import React from 'react';
import {
  Sparkles,
  PenTool,
  Palette,
  Cpu,
  BookOpen,
  FolderOpen,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PlatformConfig, Project } from '../types';

interface HeaderProps {
  config: PlatformConfig;
  activeProject: Project;
  onSelectModule: (module: PlatformConfig['activeModule']) => void;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  activeProject,
  onSelectModule,
  hasGeminiKey
}) => {
  const brand = config.brandName || 'VELORA';

  const modules: { id: PlatformConfig['activeModule']; label: string; sub: string; icon: any }[] = [
    { id: 'create', label: `${brand} Create`, sub: 'Idé → Prosjekt', icon: Sparkles },
    { id: 'write', label: `${brand} Write`, sub: 'Tekst & Bible', icon: PenTool },
    { id: 'visual', label: `${brand} Visual`, sub: 'Cover & Art', icon: Palette },
    { id: 'forge', label: `${brand} Forge`, sub: 'Orkestrator', icon: Cpu },
    { id: 'publish', label: `${brand} Publish`, sub: 'EPUB & PDF', icon: BookOpen },
    { id: 'library', label: `${brand} Library`, sub: 'Verk & Assets', icon: FolderOpen },
    { id: 'control', label: `${brand} Control`, sub: 'AI & Brand', icon: Sliders }
  ];

  const totalWords = activeProject.chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  const completedChaps = activeProject.chapters.filter((c) => c.status === 'completed').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-serif font-black text-lg shadow-lg shadow-amber-500/20">
              {brand.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-widest text-slate-100 text-lg uppercase">
                  {brand}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Platform
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                AI Creative Production &amp; Publishing
              </p>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = config.activeModule === m.id;
              return (
                <button
                  key={m.id}
                  id={`nav-tab-${m.id}`}
                  onClick={() => onSelectModule(m.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <span className="block leading-none">{m.label}</span>
                    <span className="text-[9px] opacity-70 block leading-tight font-mono">{m.sub}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Project Status & AI Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-200 truncate max-w-[160px]">
                {activeProject.title}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {totalWords.toLocaleString()} words &bull; {completedChaps}/{activeProject.chapters.length} chap
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                hasGeminiKey
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}
              title={hasGeminiKey ? 'Gemini 3.8 Flash Online' : 'Standard Generative Engine Active'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${hasGeminiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline">{hasGeminiKey ? 'Gemini Online' : 'Core Engine'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
