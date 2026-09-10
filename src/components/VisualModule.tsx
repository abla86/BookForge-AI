import React, { useState } from 'react';
import {
  Palette,
  Layers,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { Project, VisualCoverConfig, VisualAsset } from '../types';
import { CoverCanvas } from './CoverCanvas';
import { generateVisualMotif } from '../services/orchestratorService';

interface VisualModuleProps {
  project: Project;
  onProjectUpdated: (project: Project) => void;
}

export const VisualModule: React.FC<VisualModuleProps> = ({ project, onProjectUpdated }) => {
  const [viewMode, setViewMode] = useState<'front' | 'back' | 'wrap'>('front');
  const [activeTab, setActiveTab] = useState<'cover' | 'illustrations'>('cover');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const coverConfig: VisualCoverConfig = project.coverConfig || {
    title: project.title,
    subtitle: project.subtitle || '',
    author: project.author,
    accentColor: '#d4af37',
    bgColor: '#090e17',
    fontFamily: 'cinzel',
    motif: 'celestial-crest',
    backCoverBlurb: project.intent?.logline || 'An extraordinary journey through mind and form.',
    spineWidthMm: 18,
    barcodeText: '978-1-VELORA-7729'
  };

  const updateCoverConfig = (updates: Partial<VisualCoverConfig>) => {
    const updated = { ...coverConfig, ...updates };
    onProjectUpdated({
      ...project,
      coverConfig: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleRandomizeMotif = async () => {
    setIsSynthesizing(true);
    try {
      const generated = await generateVisualMotif(
        project.title,
        project.subtitle || '',
        project.author,
        project.intent?.genre || 'Fiction'
      );
      updateCoverConfig(generated);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Add an illustration asset for a chapter
  const handleAddIllustrationForChapter = (chapterNumber: number) => {
    const chap = project.chapters.find((c) => c.chapterNumber === chapterNumber);
    const newAsset: VisualAsset = {
      id: `asset-ill-ch${chapterNumber}-${Date.now()}`,
      type: 'illustration',
      chapterNumber,
      title: `Chapter ${chapterNumber} Illustrated Plate: ${chap?.title || 'Scene'}`,
      prompt: chap?.illustrationPrompt || `Dramatic cinematic illustration for ${project.title} Chapter ${chapterNumber}, rich atmospheric lighting, oil on canvas.`,
      style: project.intent?.visualArtStyle || 'Dark Basalt Slate with Burnished Copper Linework',
      placementDescription: `Chapter ${chapterNumber} Header Spread`
    };

    onProjectUpdated({
      ...project,
      visualAssets: [...project.visualAssets, newAsset],
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <span>VELORA Visual &bull; Cover &amp; Illustration Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Crafting the publication's visual grammar: typography, palette, vector motifs, and chapter plates.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            id="tab-visual-cover"
            type="button"
            onClick={() => setActiveTab('cover')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'cover'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cover Folio &amp; Spine</span>
          </button>
          <button
            id="tab-visual-illustrations"
            type="button"
            onClick={() => setActiveTab('illustrations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'illustrations'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Chapter Plates ({project.visualAssets.filter((a) => a.type === 'illustration').length})</span>
          </button>
        </div>
      </div>

      {/* 1. COVER STUDIO */}
      {activeTab === 'cover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Cover Architecture Controls
                </h3>
                <button
                  type="button"
                  onClick={handleRandomizeMotif}
                  disabled={isSynthesizing}
                  className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isSynthesizing ? 'animate-spin' : ''}`} />
                  <span>Synthesize Motif</span>
                </button>
              </div>

              {/* View mode toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">Preview Perspective</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['front', 'back', 'wrap'] as const).map((m) => (
                    <button
                      key={m}
                      id={`btn-view-${m}`}
                      type="button"
                      onClick={() => setViewMode(m)}
                      className={`py-1.5 px-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                        viewMode === m
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motif Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">Vector Graphic Motif</label>
                <select
                  value={coverConfig.motif}
                  onChange={(e) => updateCoverConfig({ motif: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="celestial-crest">Celestial Harmonic Crest</option>
                  <option value="minimalist-geometric">Minimalist Geometric Diamond</option>
                  <option value="architectural-lines">Monumental Architectural Lines</option>
                  <option value="botanical-filigree">Organic Botanical Filigree</option>
                </select>
              </div>

              {/* Typography */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">Display Typography</label>
                <select
                  value={coverConfig.fontFamily}
                  onChange={(e) => updateCoverConfig({ fontFamily: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="cinzel">Cinzel (Classical Luxury Serif)</option>
                  <option value="serif">Newsreader (Warm Literary Serif)</option>
                  <option value="sans">Plus Jakarta (Modern Geometric Sans)</option>
                </select>
              </div>

              {/* Color Palettes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 block">Accent / Foil Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={coverConfig.accentColor}
                      onChange={(e) => updateCoverConfig({ accentColor: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300 uppercase">
                      {coverConfig.accentColor}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 block">Background Tone</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={coverConfig.bgColor}
                      onChange={(e) => updateCoverConfig({ bgColor: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300 uppercase">
                      {coverConfig.bgColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Spine width & back blurb */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-medium text-slate-300 block">Back Cover Synopsis Blurb</label>
                <textarea
                  rows={3}
                  value={coverConfig.backCoverBlurb}
                  onChange={(e) => updateCoverConfig({ backCoverBlurb: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 resize-none font-serif leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Calculated Spine Width:</span>
                  <span className="font-mono text-amber-300 font-bold">{coverConfig.spineWidthMm} mm</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={40}
                  value={coverConfig.spineWidthMm}
                  onChange={(e) => updateCoverConfig({ spineWidthMm: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right: Live Rendered Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <div className="w-full max-w-md">
              <CoverCanvas config={coverConfig} mode={viewMode} />
            </div>

            <p className="text-[11px] text-slate-400 mt-4 text-center font-mono">
              Live Vector Folio Preview &bull; Ready for High-Res EPUB Titlepage &amp; Print Jacket
            </p>
          </div>
        </div>
      )}

      {/* 2. ILLUSTRATIONS STUDIO */}
      {activeTab === 'illustrations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-100">
                Internal Chapter Illustration Plates
              </h2>
              <p className="text-xs text-slate-400">
                Structured visual prompts matching the aesthetic rules of {project.intent.visualArtStyle}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.chapters.map((chap) => {
              const existingAsset = project.visualAssets.find(
                (a) => a.type === 'illustration' && a.chapterNumber === chap.chapterNumber
              );

              return (
                <div
                  key={chap.chapterNumber}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-amber-400">
                      Chapter {chap.chapterNumber} Plate
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {chap.title}
                    </span>
                  </div>

                  {existingAsset ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          Visual Scene Specification
                        </span>
                        <p className="text-slate-200 leading-relaxed font-serif">
                          &ldquo;{existingAsset.prompt}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Style: {existingAsset.style}</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Ready for Production
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center space-y-3 border border-dashed border-slate-800 rounded-lg">
                      <p className="text-xs text-slate-400">No illustration plate bound to this chapter.</p>
                      <button
                        type="button"
                        onClick={() => handleAddIllustrationForChapter(chap.chapterNumber)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Synthesize Chapter {chap.chapterNumber} Plate</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
