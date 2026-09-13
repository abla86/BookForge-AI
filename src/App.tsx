import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CreateModule } from './components/CreateModule';
import { WriteModule } from './components/WriteModule';
import { VisualModule } from './components/VisualModule';
import { ForgeModule } from './components/ForgeModule';
import { PublishModule } from './components/PublishModule';
import { LibraryModule } from './components/LibraryModule';
import { ControlModule } from './components/ControlModule';
import { INITIAL_PROJECT } from './data/sampleProjects';
import { Project, PlatformConfig } from './types';
import { checkServerHealth } from './services/orchestratorService';
import { loadServerSnapshot, readLocalSnapshot, saveServerSnapshot, writeLocalSnapshot } from './services/projectPersistence';

const DEFAULT_CONFIG: PlatformConfig = {
  brandName: 'BookForge AI',
  activeModule: 'create',
  modelId: 'gemini-3.8-flash',
  orchestratorWorkers: 2,
  qualityGateStrictness: 'balanced',
  autoRepairChapters: true
};

const localSnapshot = readLocalSnapshot();

export default function App() {
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(localSnapshot.platformConfig ?? DEFAULT_CONFIG);
  const [activeProject, setActiveProject] = useState<Project>(localSnapshot.activeProject ?? INITIAL_PROJECT);
  const [allProjects, setAllProjects] = useState<Project[]>(localSnapshot.allProjects.length ? localSnapshot.allProjects : [INITIAL_PROJECT]);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [serverStateLoaded, setServerStateLoaded] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;
    Promise.all([checkServerHealth(), loadServerSnapshot()]).then(([health, snapshot]) => {
      if (cancelled) return;
      setHasGeminiKey(health.hasGeminiKey);
      if (snapshot) {
        if (snapshot.platformConfig) setPlatformConfig(snapshot.platformConfig);
        if (snapshot.activeProject) setActiveProject(snapshot.activeProject);
        if (snapshot.allProjects?.length) setAllProjects(snapshot.allProjects);
      }
      setServerStateLoaded(true);
    }).catch(() => {
      if (!cancelled) setServerStateLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const snapshot = { activeProject, allProjects, platformConfig };
    writeLocalSnapshot(snapshot);
    if (!serverStateLoaded) return;
    setSaveState('saving');
    const timer = window.setTimeout(() => {
      saveServerSnapshot(snapshot).then((ok) => setSaveState(ok ? 'saved' : 'error'));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [activeProject, allProjects, platformConfig, serverStateLoaded]);

  const handleUpdateConfig = (updates: Partial<PlatformConfig>) => {
    setPlatformConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectModule = (module: PlatformConfig['activeModule']) => {
    setPlatformConfig((prev) => ({ ...prev, activeModule: module }));
  };

  const handleProjectUpdated = (updated: Project) => {
    setActiveProject(updated);
    setAllProjects((prev) => {
      const index = prev.findIndex((p) => p.id === updated.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = updated;
        return next;
      }
      return [updated, ...prev];
    });
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    handleSelectModule('write');
  };

  const handleCreateNewProject = () => {
    handleSelectModule('create');
  };

  const handleDuplicateProject = (project: Project) => {
    const dup: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} (Draft 2)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: project.version + 1
    };
    setAllProjects((prev) => [dup, ...prev]);
    setActiveProject(dup);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      <Header
        config={platformConfig}
        activeProject={activeProject}
        onSelectModule={handleSelectModule}
        hasGeminiKey={hasGeminiKey}
      />

      <main className="flex-1">
        {platformConfig.activeModule === 'create' && (
          <CreateModule config={platformConfig} activeProject={activeProject} onProjectUpdated={handleProjectUpdated} onNavigateToModule={handleSelectModule} />
        )}
        {platformConfig.activeModule === 'write' && (
          <WriteModule project={activeProject} onProjectUpdated={handleProjectUpdated} />
        )}
        {platformConfig.activeModule === 'visual' && (
          <VisualModule project={activeProject} onProjectUpdated={handleProjectUpdated} />
        )}
        {platformConfig.activeModule === 'forge' && (
          <ForgeModule config={platformConfig} project={activeProject} onProjectUpdated={handleProjectUpdated} onNavigateToModule={handleSelectModule} />
        )}
        {platformConfig.activeModule === 'publish' && (
          <PublishModule config={platformConfig} project={activeProject} onNavigateToModule={handleSelectModule} />
        )}
        {platformConfig.activeModule === 'library' && (
          <LibraryModule config={platformConfig} activeProject={activeProject} allProjects={allProjects} onSelectProject={handleSelectProject} onCreateNewProject={handleCreateNewProject} onDuplicateProject={handleDuplicateProject} />
        )}
        {platformConfig.activeModule === 'control' && (
          <ControlModule config={platformConfig} onUpdateConfig={handleUpdateConfig} activeProject={activeProject} />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-slate-400 uppercase tracking-wider">{platformConfig.brandName} PLATFORM</span>
          <span>&bull;</span>
          <span>Idea &rarr; Creation &rarr; Production &rarr; Visuals &rarr; Assembly &rarr; Publish</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>Persistence: {saveState === 'saving' ? 'saving…' : saveState === 'error' ? 'save failed' : 'server-backed'}</span>
          <span>&bull;</span>
          <span>Continuous Quality Gates Active</span>
        </div>
      </footer>
    </div>
  );
}
