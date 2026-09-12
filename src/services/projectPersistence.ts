import { Project, PlatformConfig } from '../types';

const PROJECTS_KEY = 'velora_all_projects_v1';
const ACTIVE_KEY = 'velora_active_project_v1';
const CONFIG_KEY = 'velora_platform_config_v1';

export interface PersistenceSnapshot {
  activeProject: Project | null;
  allProjects: Project[];
  platformConfig: PlatformConfig | null;
}

function readLocal<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage is a fallback only; server persistence remains authoritative.
  }
}

export function readLocalSnapshot(): PersistenceSnapshot {
  return {
    activeProject: readLocal<Project>(ACTIVE_KEY),
    allProjects: readLocal<Project[]>(PROJECTS_KEY) ?? [],
    platformConfig: readLocal<PlatformConfig>(CONFIG_KEY)
  };
}

export function writeLocalSnapshot(snapshot: PersistenceSnapshot): void {
  if (snapshot.activeProject) writeLocal(ACTIVE_KEY, snapshot.activeProject);
  writeLocal(PROJECTS_KEY, snapshot.allProjects);
  if (snapshot.platformConfig) writeLocal(CONFIG_KEY, snapshot.platformConfig);
}

export async function loadServerSnapshot(): Promise<PersistenceSnapshot | null> {
  try {
    const response = await fetch('/api/state', { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    return (await response.json()) as PersistenceSnapshot;
  } catch {
    return null;
  }
}

export async function saveServerSnapshot(snapshot: PersistenceSnapshot): Promise<boolean> {
  try {
    const response = await fetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(snapshot)
    });
    return response.ok;
  } catch {
    return false;
  }
}
