import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  RefreshCw,
  Edit3,
  Bookmark,
  ShieldCheck,
  ChevronRight,
  Eye,
  Sliders
} from 'lucide-react';
import { Project, Chapter, CharacterProfile, WorldRule, TimelineEvent } from '../types';
import { generateChapterProse, validateChapterProse } from '../services/orchestratorService';

interface WriteModuleProps {
  project: Project;
  onProjectUpdated: (project: Project) => void;
}

export const WriteModule: React.FC<WriteModuleProps> = ({ project, onProjectUpdated }) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'characters' | 'world' | 'timeline' | 'plan'>('reader');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingStatus, setGeneratingStatus] = useState<string>('');
  const [isEditingProse, setIsEditingProse] = useState<boolean>(false);
  const [editedProse, setEditedProse] = useState<string>('');

  const currentChapter: Chapter | undefined = project.chapters[selectedChapterIndex];

  // Manual trigger to generate or regenerate a single chapter
  const handleGenerateSingleChapter = async () => {
    if (!currentChapter) return;
    setIsGenerating(true);
    setGeneratingStatus(`Engaging Prose Engine for Chapter ${currentChapter.chapterNumber}: "${currentChapter.title}"...`);

    try {
      const chapterPlan = project.plan.chaptersPlan.find(
        (cp) => cp.chapterNumber === currentChapter.chapterNumber
      ) || {
        chapterNumber: currentChapter.chapterNumber,
        title: currentChapter.title,
        povCharacter: currentChapter.povCharacter,
        setting: 'The primary setting',
        dramaticObjective: currentChapter.summary,
        plotBeats: ['Opening action', 'Complication', 'Climax', 'Resolution']
      };

      // Previous chapter context
      const prevSummary =
        selectedChapterIndex > 0
          ? `Chapter ${project.chapters[selectedChapterIndex - 1].chapterNumber} concluded with: ${project.chapters[selectedChapterIndex - 1].summary}`
          : '';

      const proseResult = await generateChapterProse(
        project.title,
        chapterPlan,
        project.bible,
        prevSummary,
        project.plan.premise,
        project.intent.language
      );

      setGeneratingStatus('Running Quality Gate & Continuity Validation...');
      const valResult = await validateChapterProse(
        proseResult.prose,
        chapterPlan,
        project.bible,
        'balanced'
      );

      const updatedChapters = [...project.chapters];
      updatedChapters[selectedChapterIndex] = {
        ...currentChapter,
        prose: proseResult.prose,
        wordCount: proseResult.wordCount,
        status: 'completed',
        summary: proseResult.summary,
        qualityScore: valResult.score,
        qualityFeedback: valResult.feedback,
        illustrationPrompt: proseResult.illustrationPrompt,
        generatedAt: new Date().toISOString()
      };

      onProjectUpdated({
        ...project,
        chapters: updatedChapters,
        updatedAt: new Date().toISOString()
      });

      setEditedProse(proseResult.prose);
      setIsGenerating(false);
      setGeneratingStatus('');
    } catch (err: any) {
      alert(`Chapter generation failed: ${err.message}`);
      setIsGenerating(false);
      setGeneratingStatus('');
    }
  };

  const handleSaveEditedProse = () => {
    if (!currentChapter) return;
    const words = editedProse.split(/\s+/).filter(Boolean).length;
    const updatedChapters = [...project.chapters];
    updatedChapters[selectedChapterIndex] = {
      ...currentChapter,
      prose: editedProse,
      wordCount: words,
      status: words > 0 ? 'completed' : 'pending'
    };

    onProjectUpdated({
      ...project,
      chapters: updatedChapters,
      updatedAt: new Date().toISOString()
    });
    setIsEditingProse(false);
  };

  const totalWords = project.chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Module Title & Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-bold text-slate-100">
              {project.title}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {project.contentType.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            By {project.author} &bull; {project.intent.genre} &bull; {totalWords.toLocaleString()} verified words
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          <button
            id="tab-reader"
            type="button"
            onClick={() => setActiveTab('reader')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'reader'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manuscript &amp; Prose</span>
          </button>
          <button
            id="tab-characters"
            type="button"
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'characters'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Characters ({project.bible.characters.length})</span>
          </button>
          <button
            id="tab-world"
            type="button"
            onClick={() => setActiveTab('world')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'world'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>World &amp; Lore ({project.bible.worldBuilding.length})</span>
          </button>
          <button
            id="tab-timeline"
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            id="tab-plan"
            type="button"
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'plan'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Plan &amp; Structure</span>
          </button>
        </div>
      </div>

      {/* 1. MANUSCRIPT & PROSE READER */}
      {activeTab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Chapter Navigator (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Chapter Architecture
                </span>
                <span className="text-xs font-mono text-amber-400">
                  {project.chapters.filter((c) => c.status === 'completed').length} / {project.chapters.length} generated
                </span>
              </div>

              <div className="space-y-2">
                {project.chapters.map((chap, idx) => {
                  const isSelected = selectedChapterIndex === idx;
                  const isDone = chap.status === 'completed' && chap.wordCount > 0;
                  return (
                    <button
                      key={chap.id}
                      id={`chap-nav-${chap.chapterNumber}`}
                      type="button"
                      onClick={() => {
                        setSelectedChapterIndex(idx);
                        setIsEditingProse(false);
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/40 text-slate-100 shadow'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-300/90 font-serif">
                          Chapter {chap.chapterNumber}
                        </span>
                        {isDone ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{chap.wordCount} words</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {chap.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-200 line-clamp-1">
                        {chap.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>POV: {chap.povCharacter}</span>
                        {chap.qualityScore && (
                          <span className="text-amber-300 font-mono">
                            &bull; Score: {chap.qualityScore}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality & Validation Card for current chapter */}
            {currentChapter?.qualityFeedback && currentChapter.qualityFeedback.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Editorial Quality Gates
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {currentChapter.qualityScore || 90}%
                  </span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  {currentChapter.qualityFeedback.map((fb, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 mt-0.5">&bull;</span>
                      <span>{fb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Main Reading / Editing Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {currentChapter ? (
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 sm:p-10 space-y-6">
                {/* Header of Chapter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">
                      Chapter {currentChapter.chapterNumber}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
                      {currentChapter.title}
                    </h2>
                    <p className="text-xs text-slate-400">
                      POV: <strong className="text-slate-300">{currentChapter.povCharacter}</strong> &bull;{' '}
                      {currentChapter.wordCount || 0} words &bull; ~{Math.ceil((currentChapter.wordCount || 0) / 250)} min read
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isEditingProse ? (
                      <button
                        type="button"
                        onClick={handleSaveEditedProse}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Save Edits</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditedProse(currentChapter.prose || '');
                          setIsEditingProse(true);
                        }}
                        disabled={!currentChapter.prose}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Text</span>
                      </button>
                    )}

                    <button
                      type="button"
                      id="btn-generate-chapter"
                      onClick={handleGenerateSingleChapter}
                      disabled={isGenerating}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm shadow-amber-500/20 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{currentChapter.prose ? 'Regenerate Chapter' : 'Generate Chapter'}</span>
                    </button>
                  </div>
                </div>

                {/* Generating banner */}
                {isGenerating && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                    <span className="text-xs font-mono text-amber-200">{generatingStatus}</span>
                  </div>
                )}

                {/* Chapter Content / Prose */}
                {isEditingProse ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedProse}
                      onChange={(e) => setEditedProse(e.target.value)}
                      rows={20}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-serif text-slate-100 text-base leading-relaxed focus:outline-none focus:border-amber-500/50 resize-y"
                    />
                  </div>
                ) : currentChapter.prose ? (
                  <article className="prose prose-invert max-w-none font-serif text-slate-200 text-base sm:text-lg leading-relaxed space-y-5 select-text">
                    {currentChapter.prose
                      .split(/\n\s*\n/)
                      .map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className={
                            pIdx === 0
                              ? 'first-letter:text-4xl first-letter:font-bold first-letter:font-serif first-letter:mr-1.5 first-letter:float-left first-letter:text-amber-400 text-justify'
                              : 'text-justify indent-6'
                          }
                        >
                          {paragraph.trim()}
                        </p>
                      ))}
                  </article>
                ) : (
                  <div className="text-center py-16 space-y-4 border border-dashed border-slate-800 rounded-xl">
                    <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="text-sm font-semibold text-slate-300">
                        Prose Has Not Yet Been Generated
                      </h3>
                      <p className="text-xs text-slate-400">
                        According to the VELORA Core Principle, no dummy placeholders or fake progress bars are shown.
                        Click below to orchestrate authentic prose for Chapter {currentChapter.chapterNumber}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateSingleChapter}
                      disabled={isGenerating}
                      className="px-5 py-2.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Write Chapter {currentChapter.chapterNumber} Now</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a chapter from the left panel to inspect or edit.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CHARACTERS TAB */}
      {activeTab === 'characters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-100">
                Story Bible &bull; Character System
              </h2>
              <p className="text-xs text-slate-400">
                Psychological architectures, vocal cadences, and internal contradictions governing narrative continuity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.bible.characters.map((char) => (
              <div
                key={char.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-100">
                      {char.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                      {char.role} &bull; {char.archetype}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Core Motivation
                    </span>
                    <p className="text-slate-200 mt-0.5">{char.coreMotivation}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Internal Contradiction
                    </span>
                    <p className="text-slate-200 mt-0.5 italic">{char.internalConflict}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Voice &amp; Diction Notes
                    </span>
                    <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800/80">
                      {char.voiceAndDiction}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Physical Appearance
                    </span>
                    <p className="text-slate-400 text-[11px]">{char.physicalAppearance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WORLD BUILDING TAB */}
      {activeTab === 'world' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-100">
              Story Bible &bull; World System &amp; Lore
            </h2>
            <p className="text-xs text-slate-400">
              Physical settings, social order, acoustic or technological rules that dictate environmental texture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.bible.worldBuilding.map((rule) => (
              <div
                key={rule.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/20">
                    {rule.category}
                  </span>
                </div>
                <h3 className="text-base font-serif font-bold text-slate-100">
                  {rule.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {rule.description}
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-300 block mb-0.5">Narrative Consequence:</strong>
                  <span>{rule.narrativeSignificance}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Thematic pillars */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200">
              Thematic Pillars &amp; Continuity Directives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.bible.thematicPillars.map((theme, i) => (
                <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-amber-400 font-mono text-[10px] block mb-1">
                    THEME 0{i + 1}
                  </span>
                  <span>{theme}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-100">
              Chronological Timeline &amp; Causal Nexus
            </h2>
            <p className="text-xs text-slate-400">
              Historical events and plot points ensuring irreversible causal progression.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-amber-500/30 space-y-8 max-w-3xl">
            {project.bible.timeline.map((item, idx) => (
              <div key={item.id} className="relative group">
                {/* Node dot */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-amber-400" />
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {item.timeframe}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Epoch #{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-slate-100">
                    {item.event}
                  </h4>
                  <p className="text-xs text-slate-300">
                    <span className="text-slate-400 font-medium">Repercussion: </span>
                    {item.consequences}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PLAN & STRUCTURE TAB */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-100">
              Work Plan &amp; Three-Act Architecture
            </h2>
            <p className="text-xs text-slate-400">
              The underlying dramatic foundation driving tension, turning points, and resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.plan.threeActBreakdown.map((act, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-400 block">
                  {act.act}
                </span>
                <h4 className="text-sm font-semibold text-slate-100">
                  Focus: {act.focus}
                </h4>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Climax / Turning Point
                  </span>
                  <span>{act.climaxEvent}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200">
              Master Premise &amp; Central Conflict
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-serif text-justify">
              {project.plan.premise}
            </p>
            <p className="text-xs text-amber-200/90 font-mono pt-2 border-t border-slate-800">
              Central Conflict: {project.plan.centralConflict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
