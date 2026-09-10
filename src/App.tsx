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

const STORAGE_KEY_PROJECT = 'velora_active_project_v1';
const STORAGE_KEY_ALL_PROJECTS = 'velora_all_projects_v1';
const STORAGE_KEY_CONFIG = 'velora_platform_config_v1';

export default function App() {
  // Load initial config
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      brandName: 'VELORA',
      activeModule: 'create',
      modelId: 'gemini-3.8-flash',
      orchestratorWorkers: 2,
      qualityGateStrictness: 'balanced',
      autoRepairChapters: true
    };
  });

  // Load active project
  const [activeProject, setActiveProject] = useState<Project>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PROJECT;
  });

  // Load all projects
  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALL_PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [INITIAL_PROJECT];
  });

  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Health check on mount
  useEffect(() => {
    checkServerHealth().then((res) => {
      setHasGeminiKey(res.hasGeminiKey);
    });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(platformConfig));
    } catch {}
  }, [platformConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(activeProject));
    } catch {}
  }, [activeProject]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALL_PROJECTS, JSON.stringify(allProjects));
    } catch {}
  }, [allProjects]);

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
      {/* Global Header */}
      <Header
        config={platformConfig}
        activeProject={activeProject}
        onSelectModule={handleSelectModule}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {platformConfig.activeModule === 'create' && (
          <CreateModule
            config={platformConfig}
            activeProject={activeProject}
            onProjectUpdated={handleProjectUpdated}
            onNavigateToModule={handleSelectModule}
          />
        )}

        {platformConfig.activeModule === 'write' && (
          <WriteModule
            project={activeProject}
            onProjectUpdated={handleProjectUpdated}
          />
        )}

        {platformConfig.activeModule === 'visual' && (
          <VisualModule
            project={activeProject}
            onProjectUpdated={handleProjectUpdated}
          />
        )}

        {platformConfig.activeModule === 'forge' && (
          <ForgeModule
            config={platformConfig}
            project={activeProject}
            onProjectUpdated={handleProjectUpdated}
            onNavigateToModule={handleSelectModule}
          />
        )}

        {platformConfig.activeModule === 'publish' && (
          <PublishModule
            config={platformConfig}
            project={activeProject}
            onNavigateToModule={handleSelectModule}
          />
        )}

        {platformConfig.activeModule === 'library' && (
          <LibraryModule
            config={platformConfig}
            activeProject={activeProject}
            allProjects={allProjects}
            onSelectProject={handleSelectProject}
            onCreateNewProject={handleCreateNewProject}
            onDuplicateProject={handleDuplicateProject}
          />
        )}

        {platformConfig.activeModule === 'control' && (
          <ControlModule
            config={platformConfig}
            onUpdateConfig={handleUpdateConfig}
            activeProject={activeProject}
          />
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-slate-400 uppercase tracking-wider">
            {platformConfig.brandName} PLATFORM
          </span>
          <span>&bull;</span>
          <span>Idea &rarr; Creation &rarr; Production &rarr; Visuals &rarr; Assembly &rarr; Publish</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>Target Window: &le;10 min</span>
          <span>&bull;</span>
          <span>Continuous Quality Gates Active</span>
        </div>
      </footer>
    </div>
  );
}
