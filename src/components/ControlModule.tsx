import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Zap,
  ShieldCheck,
  DollarSign,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Bookmark,
  Award
} from 'lucide-react';
import { PlatformConfig, Project } from '../types';

interface ControlModuleProps {
  config: PlatformConfig;
  onUpdateConfig: (newConfig: Partial<PlatformConfig>) => void;
  activeProject: Project;
}

export const ControlModule: React.FC<ControlModuleProps> = ({
  config,
  onUpdateConfig,
  activeProject
}) => {
  const currentBrand = config.brandName || 'VELORA';
  const [customBrandInput, setCustomBrandInput] = useState<string>(currentBrand);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Suggested Platform Naming Candidates
  const nameCandidates = [
    {
      name: 'VELORA',
      tagline: 'An AI Creative Production & Publishing Platform',
      rationale: 'Versatile, fluid, timeless latin root (velox/valere), untethered from just books.'
    },
    {
      name: 'OMNICRAFT',
      tagline: 'Autonomous Creative Synthesis Suite',
      rationale: 'Expresses the complete arc from Idea to Final Multi-format Publication.'
    },
    {
      name: 'AUTEUR',
      tagline: 'Orchestrated High-Vision Publishing Engine',
      rationale: 'Evokes master-director craftsmanship and artistic authority.'
    },
    {
      name: 'SYNTHEX',
      tagline: 'The Autonomous Creative Forge',
      rationale: 'Direct emphasis on synthesizing raw human ideas into publishable reality.'
    },
    {
      name: 'AETHERIS',
      tagline: 'Creative Intelligence & Production Architecture',
      rationale: 'Elevated aesthetic, literary, clean Scandinavian cadence.'
    },
    {
      name: 'OPUS ONE',
      tagline: 'From Idea Spark to Published Masterwork',
      rationale: 'Direct reference to a creator’s definitive, finished work.'
    }
  ];

  const handleApplyBrand = (name: string) => {
    onUpdateConfig({ brandName: name.trim().toUpperCase() });
    setCustomBrandInput(name.trim().toUpperCase());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const totalWords = activeProject.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
  const estimatedTokens = totalWords * 1.35 + 4000;
  const estimatedCost = ((estimatedTokens / 1_000_000) * 0.35).toFixed(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>{currentBrand} Control &bull; Brand Identity, AI Routing &amp; Admin</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure platform branding, AI model orchestration, worker concurrency, and quality gate standards.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Platform Brand Updated
          </span>
        )}
      </div>

      {/* 1. BRAND & PLATFORM NAMING LAB */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PLATFORM BRANDING LAB &bull; IDEA &rarr; CREATION &rarr; PRODUCTION &rarr; PUBLISH</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-slate-100">
              Platform Brand &amp; Ecosystem Identity
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Define the master brand for the platform. Changing the identity here instantly cascades across
              all modules (e.g. {currentBrand} Create, {currentBrand} Write, {currentBrand} Forge, {currentBrand} Publish)
              and exported publication imprints.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              Active Brand
            </span>
            <span className="text-xl font-serif font-bold text-amber-400">
              {currentBrand}
            </span>
          </div>
        </div>

        {/* Custom Brand Input */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Custom Brand Name
            </label>
            <input
              type="text"
              value={customBrandInput}
              onChange={(e) => setCustomBrandInput(e.target.value)}
              placeholder="e.g. VELORA, OMNICRAFT, VALORA..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm font-serif font-bold tracking-wider text-slate-100 uppercase focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button
            type="button"
            id="btn-apply-brand"
            onClick={() => handleApplyBrand(customBrandInput)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shrink-0 transition-colors shadow"
          >
            Apply Brand Identity
          </button>
        </div>

        {/* Curated Candidates Grid */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 block">
            Curated High-Impact Brand Candidates:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nameCandidates.map((cand) => {
              const isSelected = currentBrand === cand.name;
              return (
                <div
                  key={cand.name}
                  onClick={() => handleApplyBrand(cand.name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-serif font-bold tracking-wider text-slate-100">
                      {cand.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-300/90 font-medium">{cand.tagline}</p>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {cand.rationale}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. AI ORCHESTRATION & MODEL ROUTING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Engine Config */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            AI Model Routing &amp; Worker Concurrency
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Primary Creative Intelligence Model
              </label>
              <select
                value={config.modelId}
                onChange={(e) => onUpdateConfig({ modelId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
              >
                <option value="gemini-3.8-flash">
                  Gemini 3.8 Flash (High-Speed &bull; Optimized for &le;10-min Production)
                </option>
                <option value="gemini-3.1-pro-preview">
                  Gemini 3.1 Pro (Deep Complex Reasoning &bull; Dense World-building)
                </option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">
                  Worker Concurrency (Parallel Chapter Streams)
                </label>
                <span className="font-mono text-amber-400 font-bold">
                  {config.orchestratorWorkers} workers
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={config.orchestratorWorkers}
                onChange={(e) => onUpdateConfig({ orchestratorWorkers: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Higher concurrency speeds up multi-chapter novel synthesis within the 10-minute target window.
              </p>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Quality Gate Strictness Level
              </label>
              <select
                value={config.qualityGateStrictness}
                onChange={(e) => onUpdateConfig({ qualityGateStrictness: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
              >
                <option value="strict">Strict (Requires &ge;85% continuity &amp; sensory score)</option>
                <option value="balanced">Balanced (Standard commercial publishing threshold)</option>
                <option value="relaxed">Relaxed (Permits rapid exploratory drafting)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Cost & Telemetry */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Production Economics &amp; Cost Control
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Estimated Project Tokens</span>
              <span className="font-mono text-slate-100 font-bold">
                ~{estimatedTokens.toLocaleString()} tokens
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Projected Gemini API Cost</span>
              <span className="font-mono text-emerald-400 font-bold">
                ${estimatedCost} USD
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Target Production Window</span>
              <span className="font-mono text-amber-300 font-bold">
                &le; 10 minutes
              </span>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed">
              <p>
                VELORA’s multi-worker orchestration routes requests through concise contextual prompts and
                checkpoints, minimizing redundant token regeneration while guaranteeing character voice
                continuity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
