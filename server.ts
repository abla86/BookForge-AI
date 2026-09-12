import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const STATE_DIR = process.env.BOOKFORGE_STATE_DIR || path.join(process.cwd(), 'data');
const MAX_STATE_BYTES = 5 * 1024 * 1024;
const MAX_CLIENT_ID_LENGTH = 100;

app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://generativelanguage.googleapis.com; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  next();
});
app.use(express.json({ limit: '2mb', strict: true }));

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const now = Date.now();
  const key = req.ip || 'unknown';
  const current = requestCounts.get(key);
  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return next();
  }
  current.count += 1;
  if (current.count > RATE_LIMIT) return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  return next();
}
app.use('/api', rateLimit);

let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not configured on the server');
  if (!aiClient) aiClient = new GoogleGenAI({ apiKey: key });
  return aiClient;
}

function requireString(value: unknown, field: string, maxLength = 100_000): string {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(`Missing ${field}`);
  if (value.length > maxLength) throw new Error(`${field} is too long`);
  return value.trim();
}

function jsonResult(text: string): unknown {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned);
}

function getClientId(req: express.Request): string {
  const raw = req.header('x-client-id')?.trim() || '';
  if (!/^[0-9a-f-]{36}$/i.test(raw) || raw.length > MAX_CLIENT_ID_LENGTH) {
    throw new Error('Invalid client id');
  }
  return raw.toLowerCase();
}

function stateFileFor(clientId: string): string {
  return path.join(STATE_DIR, `state-${clientId}.json`);
}

async function readState(clientId: string): Promise<unknown | null> {
  try {
    const raw = await fs.readFile(stateFileFor(clientId), 'utf8');
    return JSON.parse(raw);
  } catch (error: any) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeState(clientId: string, state: unknown): Promise<void> {
  const serialized = JSON.stringify(state);
  if (Buffer.byteLength(serialized, 'utf8') > MAX_STATE_BYTES) throw new Error('State payload exceeds the 5 MB limit');
  await fs.mkdir(STATE_DIR, { recursive: true, mode: 0o700 });
  const stateFile = stateFileFor(clientId);
  const temp = `${stateFile}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temp, serialized, { encoding: 'utf8', mode: 0o600 });
  await fs.rename(temp, stateFile);
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', platform: 'BookForge AI', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY), model: GEMINI_MODEL, persistence: 'server-file-per-client' });
});

app.get('/api/state', async (req, res) => {
  try {
    const clientId = getClientId(req);
    const state = await readState(clientId);
    res.json(state ?? { activeProject: null, allProjects: [], platformConfig: null });
  } catch (error: any) {
    res.status(error?.message === 'Invalid client id' ? 400 : 500).json({ error: error?.message || 'Unable to read project state' });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    const clientId = getClientId(req);
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ error: 'Invalid state payload' });
    await writeState(clientId, req.body);
    res.status(204).end();
  } catch (error: any) {
    const status = error?.message === 'Invalid client id' ? 400 : error?.message?.includes('5 MB') ? 413 : 500;
    res.status(status).json({ error: error?.message || 'Unable to save project state' });
  }
});

app.post('/api/orchestrator/analyze-intent', async (req, res) => {
  try {
    const idea = requireString(req.body?.idea, 'idea', 20_000);
    const contentType = typeof req.body?.contentType === 'string' ? req.body.contentType.slice(0, 100) : 'book';
    const language = typeof req.body?.language === 'string' ? req.body.language.slice(0, 100) : 'English';
    const prompt = `You are BookForge AI's Strategic Intent Orchestrator. Analyze this user concept for a ${contentType}.\n\nCONCEPT:\n${idea}\n\nLANGUAGE: ${language}\n\nReturn ONLY valid JSON matching this schema:\n{"title":"","subtitle":"","logline":"","genre":"","subgenre":"","targetAudience":"","tone":"","targetWordCount":35000,"pacing":"measured","stylisticDirectives":[""],"visualArtStyle":"","chapterCount":5}`;
    const response = await getGemini().models.generateContent({ model: GEMINI_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
    if (!response.text) throw new Error('AI returned an empty intent response');
    return res.json(jsonResult(response.text));
  } catch (error: any) {
    return res.status(error?.message?.startsWith('Missing ') ? 400 : 503).json({ error: error?.message || 'Intent analysis failed' });
  }
});

app.post('/api/orchestrator/build-plan-bible', async (req, res) => {
  try {
    const title = requireString(req.body?.title, 'title', 500);
    const rawIdea = requireString(req.body?.rawIdea, 'rawIdea', 20_000);
    const chapterCount = Math.max(1, Math.min(30, Number(req.body?.chapterCount || 5)));
    const subtitle = typeof req.body?.subtitle === 'string' ? req.body.subtitle.slice(0, 500) : '';
    const intent = req.body?.intent || {};
    const language = typeof req.body?.language === 'string' ? req.body.language.slice(0, 100) : 'English';
    const prompt = `You are BookForge AI's Lead Story Architect. Build a comprehensive Work Plan and Story Bible.\nTitle: ${title}\nSubtitle: ${subtitle}\nIdea: ${rawIdea}\nGenre: ${intent.genre || 'Fiction'} | Tone: ${intent.tone || 'Immersive'} | Language: ${language}\nRequired chapters: ${chapterCount}\n\nReturn ONLY valid JSON with keys plan and bible. plan must contain premise, centralConflict, threeActBreakdown, and chaptersPlan. Generate exactly ${chapterCount} chapters. bible must contain characters, worldBuilding, timeline, thematicPillars, narrativeRules, continuityChecklist. Keep continuity explicit and internally consistent.`;
    const response = await getGemini().models.generateContent({ model: GEMINI_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
    if (!response.text) throw new Error('AI returned an empty plan response');
    return res.json(jsonResult(response.text));
  } catch (error: any) {
    return res.status(error?.message?.startsWith('Missing ') ? 400 : 503).json({ error: error?.message || 'Plan generation failed' });
  }
});

app.post('/api/orchestrator/generate-chapter', async (req, res) => {
  try {
    const projectTitle = requireString(req.body?.projectTitle, 'projectTitle', 500);
    const chapterPlan = req.body?.chapterPlan;
    if (!chapterPlan || typeof chapterPlan !== 'object') return res.status(400).json({ error: 'Missing chapter plan' });
    const previousSummary = typeof req.body?.previousSummary === 'string' ? req.body.previousSummary.slice(0, 20_000) : '';
    const fullPremise = typeof req.body?.fullPremise === 'string' ? req.body.fullPremise.slice(0, 20_000) : '';
    const language = typeof req.body?.language === 'string' ? req.body.language.slice(0, 100) : 'English';
    const prompt = `You are BookForge AI's Master Prose Engine. Write the complete prose for Chapter ${chapterPlan.chapterNumber}: "${chapterPlan.title}". Project: ${projectTitle}. Premise: ${fullPremise}. Language: ${language}. POV: ${chapterPlan.povCharacter}. Setting: ${chapterPlan.setting}. Objective: ${chapterPlan.dramaticObjective}. Plot beats: ${JSON.stringify(chapterPlan.plotBeats || [])}. Story bible characters: ${JSON.stringify(req.body?.bible?.characters || [])}. World rules: ${JSON.stringify(req.body?.bible?.worldBuilding || [])}. Themes: ${JSON.stringify(req.body?.bible?.thematicPillars || [])}. Previous context: ${previousSummary}. Write real, complete literary prose, not an outline or placeholder. Target approximately 800-1400 words. Do not use markdown headings.`;
    const response = await getGemini().models.generateContent({ model: GEMINI_MODEL, contents: prompt });
    const prose = response.text?.trim() || '';
    if (!prose) throw new Error('AI returned empty chapter prose');
    const wordCount = prose.split(/\s+/).filter(Boolean).length;
    return res.json({ prose, wordCount, summary: `Chapter ${chapterPlan.chapterNumber}: ${chapterPlan.title} (${chapterPlan.povCharacter} at ${chapterPlan.setting})`, illustrationPrompt: `A dramatic cinematic illustration for ${projectTitle}, chapter ${chapterPlan.chapterNumber}, ${chapterPlan.setting}, ${chapterPlan.povCharacter}.` });
  } catch (error: any) {
    return res.status(error?.message?.startsWith('Missing ') ? 400 : 503).json({ error: error?.message || 'Chapter generation failed' });
  }
});

app.post('/api/orchestrator/validate-chapter', async (req, res) => {
  try {
    const prose = requireString(req.body?.prose, 'prose', 200_000);
    const chapterPlan = req.body?.chapterPlan || {};
    const strictness = typeof req.body?.strictness === 'string' ? req.body.strictness.slice(0, 30) : 'balanced';
    const wordCount = prose.split(/\s+/).filter(Boolean).length;
    const prompt = `You are BookForge AI's Editorial Quality Gate. Evaluate this chapter against the plan. Word count: ${wordCount}. Title: ${chapterPlan.title || ''}. POV: ${chapterPlan.povCharacter || ''}. Objective: ${chapterPlan.dramaticObjective || ''}. Strictness: ${strictness}.\n\nPROSE:\n${prose.slice(0, 12_000)}\n\nEvaluate continuity, sensory texture, pacing/tension, dialogue, and completeness. Return ONLY valid JSON: {"passed":true,"score":0,"wordCount":${wordCount},"feedback":[""],"repairsNeeded":[]}. Score 0-100. Do not invent facts not present in the supplied material.`;
    const response = await getGemini().models.generateContent({ model: GEMINI_MODEL, contents: prompt, config: { responseMimeType: 'application/json' } });
    if (!response.text) throw new Error('AI returned empty validation');
    return res.json(jsonResult(response.text));
  } catch (error: any) {
    return res.status(error?.message?.startsWith('Missing ') ? 400 : 503).json({ error: error?.message || 'Chapter validation failed' });
  }
});

app.post('/api/orchestrator/generate-visual-motif', async (req, res) => {
  try {
    const title = typeof req.body?.title === 'string' ? req.body.title.slice(0, 500) : 'UNTITLED';
    const subtitle = typeof req.body?.subtitle === 'string' ? req.body.subtitle.slice(0, 500) : '';
    const author = typeof req.body?.author === 'string' ? req.body.author.slice(0, 300) : '';
    const genre = typeof req.body?.genre === 'string' ? req.body.genre.slice(0, 200) : '';
    const style = typeof req.body?.style === 'string' ? req.body.style.slice(0, 100) : 'minimalist';
    const palettes: Record<string, { bg: string; accent: string; font: string; motif: string }> = {
      fiction: { bg: '#090d16', accent: '#d4af37', font: 'serif', motif: 'celestial-crest' },
      fantasy: { bg: '#0d131a', accent: '#38bdf8', font: 'serif', motif: 'architectural-lines' },
      romance: { bg: '#140c11', accent: '#fb7185', font: 'display', motif: 'botanical-filigree' },
      default: { bg: '#121214', accent: '#f59e0b', font: 'serif', motif: 'minimalist-geometric' }
    };
    const key = genre.toLowerCase().includes('fantasy') ? 'fantasy' : genre.toLowerCase().includes('romance') ? 'romance' : genre.toLowerCase().includes('fiction') ? 'fiction' : 'default';
    const chosen = palettes[key];
    return res.json({ title: title || 'UNTITLED', subtitle, author, accentColor: chosen.accent, bgColor: chosen.bg, fontFamily: chosen.font, motif: `${style}-${chosen.motif}`, backCoverBlurb: '', spineWidthMm: 16, barcodeText: '', generatedBy: 'deterministic-cover-renderer' });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Visual motif generation failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`BookForge AI server online at http://0.0.0.0:${PORT}`));
}

startServer().catch((error) => {
  console.error('Fatal server startup error:', error);
  process.exit(1);
});
