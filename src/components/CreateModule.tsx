import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  Wand2,
  SlidersHorizontal,
  Compass,
  CheckCircle,
  Clock
} from 'lucide-react';
import { CONTENT_TYPES, GENRE_PRESETS } from '../data/contentTypes';
import { ContentType, Project, PlatformConfig, ProjectIntent } from '../types';
import { analyzeProjectIntent, buildPlanAndBible, generateVisualMotif } from '../services/orchestratorService';

interface CreateModuleProps {
  config: PlatformConfig;
  activeProject: Project;
  onProjectUpdated: (project: Project) => void;
  onNavigateToModule: (module: PlatformConfig['activeModule']) => void;
}

export const CreateModule: React.FC<CreateModuleProps> = ({
  config,
  activeProject,
  onProjectUpdated,
  onNavigateToModule
}) => {
  const brand = config.brandName || 'VELORA';

  const [rawIdea, setRawIdea] = useState(
    activeProject.rawIdea ||
      'In a secluded monastery clinging to the Arctic fjords, an archivist discovers an illuminated manuscript whose text actively changes when read under moonlight, revealing the lost coordinates of an ancient deep-sea civilization.'
  );
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(activeProject.contentType || 'book');
  const [chapterCount, setChapterCount] = useState<number>(activeProject.chapters.length || 5);
  const [authorName, setAuthorName] = useState<string>(activeProject.author || 'Author');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const handleApplyPreset = (promptText: string) => {
    setRawIdea(promptText);
  };

  const handleStartOrchestration = async () => {
    if (!rawIdea.trim()) return;
    setIsProcessing(true);

    try {
      // Step 1: Analyze Intent
      setProcessingStep('Analyzing creative intent, audience resonance & dramatic pacing...');
      const rawAnalysis = await analyzeProjectIntent(rawIdea, selectedContentType, selectedLanguage);
      const intentAnalysis: ProjectIntent = {
        genre: rawAnalysis.genre,
        subgenre: rawAnalysis.subgenre,
        targetAudience: rawAnalysis.targetAudience,
        tone: rawAnalysis.tone,
        targetWordCount: rawAnalysis.targetWordCount,
        language: selectedLanguage,
        pacing: rawAnalysis.pacing,
        stylisticDirectives: rawAnalysis.stylisticDirectives,
        visualArtStyle: rawAnalysis.visualArtStyle,
        logline: rawAnalysis.logline
      };

      // Step 2: Build Plan and Bible
      setProcessingStep('Synthesizing Work Plan & comprehensive Story Bible (Characters, World, Timeline)...');
      const planAndBible = await buildPlanAndBible(
        rawAnalysis.title,
        rawAnalysis.subtitle,
        rawIdea,
        intentAnalysis,
        chapterCount,
        selectedLanguage
      );

      // Step 3: Generate Visual Motif
      setProcessingStep('Synthesizing bespoke typographic cover design & palette motif...');
      const coverConfig = await generateVisualMotif(
        rawAnalysis.title,
        rawAnalysis.subtitle,
        authorName,
        intentAnalysis.genre
      );

      // Prepare initial chapter objects
      const newChapters = planAndBible.plan.chaptersPlan.map((cp) => ({
        id: `chap-${cp.chapterNumber}-${Date.now()}`,
        chapterNumber: cp.chapterNumber,
        title: cp.title,
        povCharacter: cp.povCharacter,
        summary: cp.dramaticObjective,
        prose: '',
        wordCount: 0,
        status: 'pending' as const,
        illustrationPrompt: `Atmospheric illustration for ${rawAnalysis.title}: ${cp.setting}, featuring ${cp.povCharacter}.`
      }));

      const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: rawAnalysis.title,
        subtitle: rawAnalysis.subtitle,
        author: authorName,
        contentType: selectedContentType,
        rawIdea,
        intent: intentAnalysis,
        plan: planAndBible.plan,
        bible: planAndBible.bible,
        chapters: newChapters,
        coverConfig,
        visualAssets: [
          {
            id: `asset-cover-${Date.now()}`,
            type: 'cover_front',
            title: `${rawAnalysis.title} — Primary Folio Cover`,
            prompt: `Front cover for ${rawAnalysis.title}, style of ${intentAnalysis.visualArtStyle}`,
            style: intentAnalysis.visualArtStyle,
            placementDescription: 'Front Cover'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isCompleted: false
      };

      onProjectUpdated(newProject);
      setProcessingStep('Project Blueprint ready! Redirecting to Forge Orchestrator...');
      setTimeout(() => {
        setIsProcessing(false);
        onNavigateToModule('forge');
      }, 900);
    } catch (err: any) {
      alert(`Orchestration initialization failed: ${err.message || err}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Intro Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{brand} CREATE &bull; ONE IDEA &rarr; COMPLETE WORK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 tracking-tight">
            Transform Your Raw Vision into an Autonomous Creative Production
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Specify a premise, thematic prompt, or narrative spark. The platform orchestrates the full
            dramatic intent, world rules, three-act structure, and multi-chapter timeline before triggering
            autonomous generation.
          </p>
        </div>
      </div>

      {/* Grid: Left is Idea Input, Right is Content Types & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Idea Formulation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="raw-idea-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                Raw Idea / Production Prompt
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {rawIdea.length} characters
              </span>
            </div>

            <textarea
              id="raw-idea-input"
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              rows={6}
              disabled={isProcessing}
              placeholder="Describe your story, book concept, world, or creative publication in natural detail..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-sans leading-relaxed resize-y"
            />

            {/* Quick Inspiration Presets */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium block">
                Quick Idea Sparks &amp; Tested Premises:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  id="preset-fjord"
                  onClick={() =>
                    handleApplyPreset(
                      'In a secluded monastery clinging to the Arctic fjords, an archivist discovers an illuminated manuscript whose text actively changes when read under moonlight, revealing the lost coordinates of an ancient deep-sea civilization.'
                    )
                  }
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-colors text-left"
                >
                  Arctic Fjord Manuscript
                </button>
                <button
                  type="button"
                  id="preset-clockwork"
                  onClick={() =>
                    handleApplyPreset(
                      'A disgraced watchmaker in 1890 Vienna is hired by the imperial crown to build a clockwork automaton that can predict seismic tremors, only to realize the machine is translating whispers from beneath the Earth.'
                    )
                  }
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-colors text-left"
                >
                  Viennese Clockwork Mystery
                </button>
                <button
                  type="button"
                  id="preset-meridian"
                  onClick={() =>
                    handleApplyPreset(
                      'In a world where vocal sound is outlawed by the High Archivists to enforce civic peace, an acoustician intercepts an encrypted sub-bass frequency that proves the historic Silence of 1912 was an orchestrated deception.'
                    )
                  }
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-colors text-left"
                >
                  Acoustic Meridian Dystopia
                </button>
              </div>
            </div>

            {/* Author & Language Config */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <label htmlFor="author-input" className="block text-xs font-medium text-slate-300 mb-1">
                  Author / Creator Byline
                </label>
                <input
                  id="author-input"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. S. K. Valen"
                />
              </div>

              <div>
                <label htmlFor="language-select" className="block text-xs font-medium text-slate-300 mb-1">
                  Target Language
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="English">English</option>
                  <option value="Norwegian">Norwegian (Norsk)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="French">French (Français)</option>
                  <option value="Spanish">Spanish (Español)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Execution Button */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-sm font-semibold text-slate-200">
                Ready to Initialize Production Pipeline?
              </span>
              <p className="text-xs text-slate-400">
                This triggers Intent extraction, World Bible generation, and multi-chapter blueprinting.
              </p>
            </div>

            <button
              type="button"
              id="btn-initialize-project"
              onClick={handleStartOrchestration}
              disabled={isProcessing || !rawIdea.trim()}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isProcessing
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-wait'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Orchestrating...</span>
                </>
              ) : (
                <>
                  <span>Synthesize Project Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Live Progress feedback if running */}
          {isProcessing && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
              <p className="text-xs font-mono text-amber-200">{processingStep}</p>
            </div>
          )}
        </div>

        {/* Content Type Architecture & Target Scope (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Target Content Architecture
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Plug-in Modules
              </span>
            </div>

            <p className="text-xs text-slate-400">
              The platform core is format-agnostic. Choose the primary production workflow:
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {CONTENT_TYPES.map((type) => {
                const isSelected = selectedContentType === type.id;
                return (
                  <button
                    key={type.id}
                    id={`type-select-${type.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedContentType(type.id);
                      setChapterCount(type.defaultCount);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-slate-100 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{type.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-amber-300/90 border border-amber-500/20">
                        {type.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {type.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span>{type.targetWordCountRange}</span>
                      <span>&bull;</span>
                      <span>{type.outputFormats.slice(0, 2).join(', ')}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Scope / Chapter Count slider */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">
                  Target Production Units ({CONTENT_TYPES.find((c) => c.id === selectedContentType)?.unitName || 'Chapters'}):
                </span>
                <span className="font-mono text-amber-400 font-bold">{chapterCount}</span>
              </div>
              <input
                type="range"
                min={3}
                max={10}
                value={chapterCount}
                onChange={(e) => setChapterCount(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Each unit will be blueprinted with dramatic objectives, POV perspectives, and plot beats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
