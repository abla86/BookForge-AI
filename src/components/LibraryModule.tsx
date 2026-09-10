import React from 'react';
import {
  FolderOpen,
  Plus,
  BookOpen,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Copy,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Project, PlatformConfig } from '../types';

interface LibraryModuleProps {
  config: PlatformConfig;
  activeProject: Project;
  allProjects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateNewProject: () => void;
  onDuplicateProject: (project: Project) => void;
}

export const LibraryModule: React.FC<LibraryModuleProps> = ({
  config,
  activeProject,
  allProjects,
  onSelectProject,
  onCreateNewProject,
  onDuplicateProject
}) => {
  const brand = config.brandName || 'VELORA';

  const totalWordsAcrossAll = allProjects.reduce(
    (acc, p) => acc + p.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-400" />
            <span>{brand} Library &bull; Works, Repositories &amp; Assets</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Central repository of active creative projects, story bibles, visual folios, and published editions.
          </p>
        </div>

        <button
          type="button"
          id="btn-library-create-new"
          onClick={onCreateNewProject}
          className="px-4 py-2 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>New Creative Project</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Total Projects in Library
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {allProjects.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Across {new Set(allProjects.map((p) => p.contentType)).size} content types
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Total Authored Words
          </span>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {totalWordsAcrossAll.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Verified continuous text
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Active Workspace
          </span>
          <div className="text-sm font-semibold text-slate-200 truncate mt-1">
            {activeProject.title}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Version {activeProject.version} &bull; {activeProject.chapters.length} chapters
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Manuscripts &amp; Publications ({allProjects.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProjects.map((proj) => {
            const isActive = proj.id === activeProject.id;
            const words = proj.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
            const completedChaps = proj.chapters.filter((c) => c.status === 'completed').length;

            return (
              <div
                key={proj.id}
                className={`bg-slate-900/80 border rounded-xl p-5 space-y-4 transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/20">
                      {proj.contentType}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono text-emerald-400 font-medium">
                        &bull; Active
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-serif font-bold text-slate-100">
                    {proj.title}
                  </h4>
                  {proj.subtitle && (
                    <p className="text-xs text-slate-400 italic">
                      {proj.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {proj.intent.logline}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{words.toLocaleString()} words</span>
                    <span>
                      {completedChaps}/{proj.chapters.length} chapters
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectProject(proj)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <span>{isActive ? 'Current Work' : 'Load Project'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Duplicate project"
                      onClick={() => onDuplicateProject(proj)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
