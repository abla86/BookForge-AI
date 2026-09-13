import { ProjectIntent, WorkPlan, StoryBible, Chapter, VisualCoverConfig } from '../types';

export interface HealthCheckResponse {
  status: string;
  platform: string;
  hasGeminiKey: boolean;
  model: string;
  persistence?: string;
}

export async function checkServerHealth(): Promise<HealthCheckResponse> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return { status: 'offline', platform: 'BookForge AI', hasGeminiKey: false, model: 'local', persistence: 'local-fallback' };
  }
}

export async function analyzeProjectIntent(
  idea: string,
  contentType: string = 'book',
  language: string = 'English'
): Promise<{
  title: string;
  subtitle: string;
  logline: string;
  genre: string;
  subgenre?: string;
  targetAudience: string;
  tone: string;
  targetWordCount: number;
  pacing: 'brisk' | 'measured' | 'epic' | 'contemplative';
  stylisticDirectives: string[];
  visualArtStyle: string;
  chapterCount: number;
  language: string;
}> {
  const res = await fetch('/api/orchestrator/analyze-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, contentType, language })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze project intent');
  }
  return await res.json();
}

export async function buildPlanAndBible(
  title: string,
  subtitle: string,
  rawIdea: string,
  intent: ProjectIntent,
  chapterCount: number = 5,
  language: string = 'English'
): Promise<{ plan: WorkPlan; bible: StoryBible }> {
  const res = await fetch('/api/orchestrator/build-plan-bible', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, subtitle, rawIdea, intent, chapterCount, language })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate work plan and story bible');
  }
  return await res.json();
}

export async function generateChapterProse(
  projectTitle: string,
  chapterPlan: any,
  bible: StoryBible,
  previousSummary: string = '',
  fullPremise: string = '',
  language: string = 'English'
): Promise<{ prose: string; wordCount: number; summary: string; illustrationPrompt: string }> {
  const res = await fetch('/api/orchestrator/generate-chapter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectTitle, chapterPlan, bible, previousSummary, fullPremise, language })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate chapter prose');
  }
  return await res.json();
}

export async function validateChapterProse(
  prose: string,
  chapterPlan: any,
  bible: StoryBible,
  strictness: string = 'balanced'
): Promise<{ passed: boolean; score: number; wordCount: number; feedback: string[]; repairsNeeded: string[] }> {
  const res = await fetch('/api/orchestrator/validate-chapter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prose, chapterPlan, bible, strictness })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to validate chapter prose');
  }
  return await res.json();
}

export async function generateVisualMotif(
  title: string,
  subtitle: string,
  author: string,
  genre: string
): Promise<VisualCoverConfig> {
  const res = await fetch('/api/orchestrator/generate-visual-motif', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, subtitle, author, genre })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate visual motif');
  }
  return await res.json();
}
