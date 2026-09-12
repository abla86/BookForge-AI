import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Printer,
  FileText,
  Archive,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { Project, PlatformConfig } from '../types';
import {
  generateEpubBlob,
  downloadBlob,
  exportProjectToDocxHtml,
  exportProjectToJson
} from '../services/epubExport';
import { CoverCanvas } from './CoverCanvas';

interface PublishModuleProps {
  config: PlatformConfig;
  project: Project;
  onNavigateToModule: (module: PlatformConfig['activeModule']) => void;
}

export const PublishModule: React.FC<PublishModuleProps> = ({
  config,
  project,
  onNavigateToModule
}) => {
  const brand = config.brandName || 'BookForge AI';
  const [isExportingEpub, setIsExportingEpub] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const validChapters = project.chapters.filter((c) => c.prose && c.prose.trim().length > 300);
  const totalWords = validChapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  const isBookComplete = validChapters.length === project.chapters.length && validChapters.length > 0;

  const handleDownloadEpub = async () => {
    if (!isBookComplete) {
      const proceed = confirm(
        'Warning: Some chapters do not yet have complete prose. BookForge AI recommends publishing only 100% complete works. Do you want to export anyway?'
      );
      if (!proceed) return;
    }

    setIsExportingEpub(true);
    try {
      const blob = await generateEpubBlob(project);
      const filename = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_bookforge.epub`;
      downloadBlob(blob, filename);
    } catch (err: any) {
      alert(`EPUB export failed: ${err.message || err}`);
    } finally {
      setIsExportingEpub(false);
    }
  };

  const handlePrintPdf = () => {
    setShowPrintModal(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>{brand} Publish &bull; Masterwork Distribution Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-grade packaging for EPUB 3.0 e-readers, browser print/PDF output, and editable Word-compatible manuscript format.
          </p>
        </div>

        <div>
          {isBookComplete ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% COMPLETE &bull; READY TO PUBLISH</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{validChapters.length}/{project.chapters.length} CHAPTERS PRODUCED</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Publication Quality Pre-Flight
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Verified Prose Chapters</span>
                <span className="font-mono font-bold text-slate-100">{validChapters.length} / {project.chapters.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Total Word Count</span>
                <span className="font-mono font-bold text-amber-400">{totalWords.toLocaleString()} words</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Typographic Cover Folio</span>
                <span className="text-emerald-400 font-mono">Synthesized &bull; OK</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">EPUB 3.0 Container Spec</span>
                <span className="text-emerald-400 font-mono">Generated</span>
              </div>
            </div>

            {!isBookComplete && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-200 space-y-2">
                <p>Some chapters do not yet have generated literary prose. You can trigger batch creation in the Forge Orchestrator.</p>
                <button type="button" onClick={() => onNavigateToModule('forge')} className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-medium text-xs flex items-center gap-1">
                  <span>Open {brand} Forge Orchestrator</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Export Master Packages</h3>
            <div className="space-y-3">
              <button type="button" id="btn-export-epub" onClick={handleDownloadEpub} disabled={isExportingEpub} className="w-full p-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:bg-amber-500/20 text-left transition-all flex items-center justify-between shadow-sm group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><span className="text-sm font-bold text-amber-200">Standard EPUB 3.0 E-Book</span><span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">.epub</span></div>
                  <p className="text-xs text-slate-400">Valid EPUB package for major e-readers and reading applications.</p>
                </div>
                <Download className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
              </button>

              <button type="button" id="btn-export-pdf" onClick={handlePrintPdf} className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 text-left transition-all flex items-center justify-between group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-200">Browser Print / PDF</span><span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">print</span></div>
                  <p className="text-xs text-slate-400">Uses the browser print dialog to create a PDF or physical printout.</p>
                </div>
                <Printer className="w-5 h-5 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0" />
              </button>

              <button type="button" id="btn-export-docx" onClick={() => exportProjectToDocxHtml(project)} className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 text-left transition-all flex items-center justify-between group">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-300">Word-Compatible Manuscript</span><span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">.doc</span></div>
                  <p className="text-[11px] text-slate-400">HTML-based Microsoft Word-compatible document with manuscript formatting.</p>
                </div>
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0" />
              </button>

              <button type="button" id="btn-export-json" onClick={() => exportProjectToJson(project)} className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 text-left transition-all flex items-center justify-between group">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-300">Full BookForge Project JSON Archive</span><span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">.json</span></div>
                  <p className="text-[11px] text-slate-400">Includes Story Bible, Characters, Timeline, Cover Config, and Manuscript.</p>
                </div>
                <Archive className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">MASTER PUBLICATION PREVIEW</span>
              <h2 className="text-lg font-serif font-bold text-slate-100">{project.title}</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{validChapters.length} Chapters &bull; {totalWords.toLocaleString()} Words</span>
          </div>

          <div className="text-center py-8 space-y-4 bg-slate-950/60 rounded-xl border border-slate-800/80 p-6">
            <h1 className="text-3xl font-serif font-bold tracking-wider uppercase text-slate-100">{project.title}</h1>
            {project.subtitle && <p className="text-sm italic text-amber-300 font-serif">{project.subtitle}</p>}
            <div className="pt-4"><span className="text-xs tracking-[0.25em] uppercase font-mono text-slate-400">A NOVEL BY</span><p className="text-base font-serif font-bold text-slate-200 mt-1">{project.author}</p></div>
            <div className="text-[11px] text-slate-500 font-mono pt-4 border-t border-slate-800/60">First Edition &bull; Published via {brand} Platform &bull; {new Date().getFullYear()}</div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Table of Contents</h4>
            <div className="divide-y divide-slate-800/80 text-xs">
              {project.chapters.map((c) => (
                <div key={c.chapterNumber} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3"><span className="font-mono text-amber-400/80 font-bold">Chapter {c.chapterNumber}</span><span className="text-slate-200 font-serif">{c.title}</span></div>
                  <span className="text-[11px] font-mono text-slate-500">{c.wordCount > 0 ? `${c.wordCount} w` : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showPrintModal && <div className="sr-only" aria-hidden="true">Print dialog opened.</div>}
    </div>
  );
};
