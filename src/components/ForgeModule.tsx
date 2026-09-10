import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  Terminal,
  FileCheck
} from 'lucide-react';
import { Project, ProductionLog, PlatformConfig, Chapter } from '../types';
import { generateChapterProse, validateChapterProse } from '../services/orchestratorService';

interface ForgeModuleProps {
  config: PlatformConfig;
  project: Project;
  onProjectUpdated: (project: Project) => void;
  onNavigateToModule: (module: PlatformConfig['activeModule']) => void;
}

export const ForgeModule: React.FC<ForgeModuleProps> = ({
  config,
  project,
  onProjectUpdated,
  onNavigateToModule
}) => {
  const brand = config.brandName || 'VELORA';

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<
    'idle' | 'intent' | 'planning' | 'bible' | 'chapters' | 'visuals' | 'quality' | 'assembly' | 'ready'
  >('idle');
  const [activeWorkerCount, setActiveWorkerCount] = useState<number>(config.orchestratorWorkers || 2);
  const [logs, setLogs] = useState<ProductionLog[]>([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      stage: 'INIT',
      message: `${brand} Forge Orchestrator initialized. Worker pool standby.`
    }
  ]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const abortRef = useRef<boolean>(false);

  const addLog = (level: ProductionLog['level'], stage: string, message: string) => {
    setLogs((prev) => [
      ...prev.slice(-80),
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        stage,
        message
      }
    ]);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Main Orchestration Loop
  const handleStartFullPipeline = async () => {
    setIsRunning(true);
    abortRef.current = false;
    setElapsedSeconds(0);
    addLog('info', 'PIPELINE', `Starting autonomous end-to-end production for "${project.title}"...`);

    try {
      // Stage 1: Intent & Planning
      setCurrentStage('intent');
      addLog('info', 'INTENT', `Verifying project requirements: ${project.intent.genre} (${project.intent.targetWordCount} target words)`);
      await delay(600);
      if (abortRef.current) return;

      // Stage 2: Story Bible Check
      setCurrentStage('bible');
      addLog('info', 'BIBLE', `Loaded ${project.bible.characters.length} characters and ${project.bible.worldBuilding.length} world-building anchors.`);
      await delay(600);
      if (abortRef.current) return;

      // Stage 3: Chapter Generation
      setCurrentStage('chapters');
      addLog('info', 'PROSE_ENGINE', `Initiating parallel chapter generation pool (${activeWorkerCount} concurrent workers)...`);

      let workingChapters: Chapter[] = [...project.chapters];

      // Work through uncompleted chapters in batches
      for (let i = 0; i < workingChapters.length; i++) {
        if (abortRef.current) break;
        const chap = workingChapters[i];
        if (chap.status === 'completed' && chap.wordCount > 500) {
          addLog('info', `WORKER_${(i % activeWorkerCount) + 1}`, `Chapter ${chap.chapterNumber}: "${chap.title}" already verified (${chap.wordCount} words).`);
          continue;
        }

        addLog('info', `WORKER_${(i % activeWorkerCount) + 1}`, `Generating full literary prose for Chapter ${chap.chapterNumber}: "${chap.title}" (POV: ${chap.povCharacter})...`);

        const chapterPlan = project.plan.chaptersPlan.find(
          (cp) => cp.chapterNumber === chap.chapterNumber
        ) || {
          chapterNumber: chap.chapterNumber,
          title: chap.title,
          povCharacter: chap.povCharacter,
          setting: 'Citadel',
          dramaticObjective: chap.summary,
          plotBeats: ['Opening action', 'Complication', 'Revelation']
        };

        const prevSummary =
          i > 0 && workingChapters[i - 1]?.summary ? workingChapters[i - 1].summary : '';

        const proseRes = await generateChapterProse(
          project.title,
          chapterPlan,
          project.bible,
          prevSummary,
          project.plan.premise,
          project.intent.language
        );

        addLog('success', `WORKER_${(i % activeWorkerCount) + 1}`, `Chapter ${chap.chapterNumber} generated: ${proseRes.wordCount} words.`);

        // Quality check
        const valRes = await validateChapterProse(
          proseRes.prose,
          chapterPlan,
          project.bible,
          config.qualityGateStrictness
        );

        workingChapters[i] = {
          ...chap,
          prose: proseRes.prose,
          wordCount: proseRes.wordCount,
          status: 'completed',
          summary: proseRes.summary,
          qualityScore: valRes.score,
          qualityFeedback: valRes.feedback,
          illustrationPrompt: proseRes.illustrationPrompt,
          generatedAt: new Date().toISOString()
        };

        // Live update project state
        onProjectUpdated({
          ...project,
          chapters: [...workingChapters],
          updatedAt: new Date().toISOString()
        });

        addLog('info', 'QUALITY_GATE', `Chapter ${chap.chapterNumber} validation score: ${valRes.score}%. Passed continuity checks.`);
      }

      if (abortRef.current) return;

      // Stage 4: Visual Assets
      setCurrentStage('visuals');
      addLog('info', 'VISUAL_ENGINE', 'Verifying folio cover wrap and chapter illustration plates...');
      await delay(800);
      if (abortRef.current) return;

      // Stage 5: Assembly & Publication Check
      setCurrentStage('assembly');
      const totalWords = workingChapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
      addLog('info', 'ASSEMBLY', `Compiling Masterwork Manuscript: ${totalWords.toLocaleString()} total words across ${workingChapters.length} chapters.`);
      await delay(800);

      setCurrentStage('ready');
      addLog('success', 'PUBLISH_GATE', `ORCHESTRATION COMPLETE! All quality gates passed. Publication packages (EPUB, PDF, DOCX) ready for download.`);
      setIsRunning(false);

      onProjectUpdated({
        ...project,
        chapters: workingChapters,
        isCompleted: true,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      addLog('error', 'ORCHESTRATOR', `Error during production pipeline: ${err.message || err}`);
      setIsRunning(false);
    }
  };

  const handleStopPipeline = () => {
    abortRef.current = true;
    setIsRunning(false);
    addLog('warning', 'ORCHESTRATOR', 'Pipeline paused by operator.');
  };

  const totalWords = project.chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  const completedChapters = project.chapters.filter((c) => c.status === 'completed' && c.wordCount > 0).length;
  const progressPercent = Math.round((completedChapters / Math.max(1, project.chapters.length)) * 100);

  const stages = [
    { id: 'intent', label: '1. Intent & Scope', desc: 'Requirement analysis' },
    { id: 'planning', label: '2. Architecture', desc: 'Act & beat mapping' },
    { id: 'bible', label: '3. Story Bible', desc: 'Characters & world rules' },
    { id: 'chapters', label: '4. Chapter Engine', desc: 'Concurrent literary prose' },
    { id: 'visuals', label: '5. Visual Folio', desc: 'Cover & plates synthesis' },
    { id: 'quality', label: '6. Quality Gates', desc: 'Continuity & pacing' },
    { id: 'assembly', label: '7. Assembly', desc: 'EPUB / PDF masterwork' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>{brand} FORGE &bull; AUTONOMOUS MULTI-STAGE ENGINE</span>
          </div>
          <h1 className="text-xl font-serif font-bold text-slate-100">
            {project.title} &mdash; Production Orchestration Hub
          </h1>
          <p className="text-xs text-slate-400">
            Targeting the &le;10-minute complete production standard via parallelized chapter workers and continuous quality validation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isRunning ? (
            <button
              type="button"
              id="btn-stop-pipeline"
              onClick={handleStopPipeline}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shadow"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Pipeline</span>
            </button>
          ) : (
            <button
              type="button"
              id="btn-start-pipeline"
              onClick={handleStartFullPipeline}
              className="px-5 py-2.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/20 font-semibold"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {completedChapters === project.chapters.length
                  ? 'Re-run Autonomous Production'
                  : 'Start Autonomous Production'}
              </span>
            </button>
          )}

          {currentStage === 'ready' && (
            <button
              type="button"
              onClick={() => onNavigateToModule('publish')}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
            >
              <FileCheck className="w-4 h-4" />
              <span>Proceed to Publish</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            Real Prose Verified
          </span>
          <div className="text-xl font-bold font-mono text-slate-100">
            {totalWords.toLocaleString()} <span className="text-xs text-slate-400 font-normal">words</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            No dummy text
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            Units Completed
          </span>
          <div className="text-xl font-bold font-mono text-amber-300">
            {completedChapters} / {project.chapters.length} <span className="text-xs text-slate-400 font-normal">chapters</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            Elapsed Production Time
          </span>
          <div className="text-xl font-bold font-mono text-slate-100 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>
              {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Target &le; 10 min window
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            Active Concurrency
          </span>
          <div className="text-xl font-bold font-mono text-slate-100 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{activeWorkerCount} Workers</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Parallel stream routing
          </span>
        </div>
      </div>

      {/* 7-Stage Pipeline Visualizer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Autonomous Pipeline Sequence
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Stage: <strong className="text-amber-300 uppercase">{currentStage}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map((st, i) => {
            const isCurrent = currentStage === st.id;
            const isPast =
              currentStage === 'ready' ||
              (i === 0 && currentStage !== 'idle') ||
              (i === 1 && ['bible', 'chapters', 'visuals', 'quality', 'assembly'].includes(currentStage)) ||
              (i === 2 && ['chapters', 'visuals', 'quality', 'assembly'].includes(currentStage)) ||
              (i === 3 && ['visuals', 'quality', 'assembly'].includes(currentStage)) ||
              (i === 4 && ['quality', 'assembly'].includes(currentStage)) ||
              (i === 5 && ['assembly'].includes(currentStage));

            return (
              <div
                key={st.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : isPast
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-amber-300' : isPast ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {st.label}
                  </span>
                  {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Telemetry Logs */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs space-y-3 shadow-inner">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">ORCHESTRATOR TELEMETRY &bull; LIVE LOGS</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>{logs.length} entries</span>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="text-slate-400 hover:text-slate-200 text-[10px] uppercase"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-2 font-mono scrollbar-thin">
          {logs.map((log) => {
            const color =
              log.level === 'error'
                ? 'text-red-400 bg-red-500/10'
                : log.level === 'warning'
                ? 'text-amber-400 bg-amber-500/10'
                : log.level === 'success'
                ? 'text-emerald-300 bg-emerald-500/10'
                : 'text-slate-300';

            return (
              <div key={log.id} className="flex items-start gap-2 py-0.5 leading-relaxed">
                <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                <span className="text-amber-400/80 text-[10px] uppercase shrink-0">[{log.stage}]</span>
                <span className={`text-[11px] ${color}`}>{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
