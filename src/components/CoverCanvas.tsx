import React from 'react';
import { VisualCoverConfig } from '../types';

interface CoverCanvasProps {
  config: VisualCoverConfig;
  mode?: 'front' | 'back' | 'wrap';
  className?: string;
}

export const CoverCanvas: React.FC<CoverCanvasProps> = ({
  config,
  mode = 'front',
  className = ''
}) => {
  const {
    title = 'UNTITLED',
    subtitle = '',
    author = 'Author',
    accentColor = '#d4af37',
    bgColor = '#090e17',
    fontFamily = 'cinzel',
    motif = 'celestial-crest',
    backCoverBlurb = '',
    spineWidthMm = 18,
    barcodeText = '978-1-VELORA-7729'
  } = config;

  const fontClass =
    fontFamily === 'cinzel'
      ? 'font-serif tracking-widest'
      : fontFamily === 'sans'
      ? 'font-sans tracking-tight font-bold'
      : 'font-serif tracking-normal';

  const renderMotifSvg = () => {
    switch (motif) {
      case 'celestial-crest':
        return (
          <g stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.85">
            <circle cx="150" cy="150" r="85" strokeDasharray="3 3" />
            <circle cx="150" cy="150" r="60" />
            <circle cx="150" cy="150" r="35" strokeWidth="1.8" />
            <polygon points="150,55 158,142 245,150 158,158 150,245 142,158 55,150 142,142" fill={accentColor} fillOpacity="0.1" />
            <line x1="150" y1="40" x2="150" y2="260" strokeDasharray="2 4" />
            <line x1="40" y1="150" x2="260" y2="150" strokeDasharray="2 4" />
            <circle cx="150" cy="150" r="6" fill={accentColor} />
            <circle cx="150" cy="90" r="3" fill={accentColor} />
            <circle cx="150" cy="210" r="3" fill={accentColor} />
            <circle cx="90" cy="150" r="3" fill={accentColor} />
            <circle cx="210" cy="150" r="3" fill={accentColor} />
          </g>
        );
      case 'architectural-lines':
        return (
          <g stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.85">
            <path d="M 60 250 L 150 70 L 240 250 Z" />
            <path d="M 90 250 L 150 130 L 210 250 Z" />
            <line x1="150" y1="70" x2="150" y2="250" />
            <circle cx="150" cy="130" r="4" fill={accentColor} />
            <circle cx="150" cy="70" r="6" fill={accentColor} />
            <line x1="40" y1="250" x2="260" y2="250" strokeWidth="2" />
            <line x1="50" y1="256" x2="250" y2="256" strokeWidth="0.8" />
          </g>
        );
      case 'botanical-filigree':
        return (
          <g stroke={accentColor} strokeWidth="1.4" fill="none" opacity="0.85">
            <path d="M 150 250 Q 150 160 110 130 Q 80 110 90 80 Q 110 60 140 90 Q 150 110 150 150" />
            <path d="M 150 250 Q 150 160 190 130 Q 220 110 210 80 Q 190 60 160 90 Q 150 110 150 150" />
            <circle cx="150" cy="65" r="8" fill={accentColor} fillOpacity="0.2" />
            <path d="M 110 130 Q 130 120 125 100" />
            <path d="M 190 130 Q 170 120 175 100" />
          </g>
        );
      case 'minimalist-geometric':
      default:
        return (
          <g stroke={accentColor} strokeWidth="1.5" fill="none" opacity="0.85">
            <rect x="70" y="70" width="160" height="160" transform="rotate(45 150 150)" />
            <rect x="90" y="90" width="120" height="120" />
            <circle cx="150" cy="150" r="50" strokeDasharray="4 4" />
            <circle cx="150" cy="150" r="8" fill={accentColor} />
            <line x1="30" y1="150" x2="270" y2="150" opacity="0.4" />
          </g>
        );
    }
  };

  // 1. FRONT COVER
  if (mode === 'front') {
    return (
      <div
        className={`relative aspect-[1/1.55] rounded-lg shadow-2xl overflow-hidden flex flex-col justify-between p-8 border border-white/10 select-none ${className}`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Subtle texture grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Framing border */}
        <div
          className="absolute inset-4 rounded border pointer-events-none"
          style={{ borderColor: `${accentColor}33` }}
        />
        <div
          className="absolute inset-5 rounded border pointer-events-none"
          style={{ borderColor: `${accentColor}18` }}
        />

        {/* Top Publisher Brand */}
        <div className="relative z-10 text-center pt-2">
          <span
            className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-75"
            style={{ color: accentColor }}
          >
            A VELORA ORIGINAL WORK
          </span>
        </div>

        {/* Center Motif SVG */}
        <div className="relative z-10 my-auto flex justify-center py-4">
          <svg viewBox="0 0 300 300" className="w-48 h-48 drop-shadow-md">
            {renderMotifSvg()}
          </svg>
        </div>

        {/* Bottom Titles & Author */}
        <div className="relative z-10 text-center pb-3 space-y-2">
          <h1
            className={`text-2xl sm:text-3xl uppercase font-bold leading-tight drop-shadow-lg ${fontClass}`}
            style={{ color: '#ffffff' }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="text-xs italic tracking-wider font-light line-clamp-2 max-w-[90%] mx-auto"
              style={{ color: accentColor }}
            >
              {subtitle}
            </p>
          )}

          <div className="pt-4 flex items-center justify-center gap-2">
            <span
              className="h-px w-6"
              style={{ backgroundColor: `${accentColor}66` }}
            />
            <span
              className="text-xs uppercase tracking-[0.25em] font-medium"
              style={{ color: '#ffffff' }}
            >
              {author}
            </span>
            <span
              className="h-px w-6"
              style={{ backgroundColor: `${accentColor}66` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. BACK COVER
  if (mode === 'back') {
    return (
      <div
        className={`relative aspect-[1/1.55] rounded-lg shadow-2xl overflow-hidden flex flex-col justify-between p-8 border border-white/10 select-none ${className}`}
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="absolute inset-4 rounded border pointer-events-none"
          style={{ borderColor: `${accentColor}25` }}
        />

        {/* Praise / Header */}
        <div className="relative z-10 text-center pt-2">
          <p
            className="text-xs tracking-widest uppercase font-semibold"
            style={{ color: accentColor }}
          >
            PRAISE &amp; RECOGNITION
          </p>
        </div>

        {/* Blurb Body */}
        <div className="relative z-10 my-auto px-2 space-y-4 text-center">
          <div className="w-8 h-px mx-auto" style={{ backgroundColor: accentColor }} />
          <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-serif italic line-clamp-8">
            &ldquo;{backCoverBlurb || 'A masterwork produced through the Velora Generative Architecture, challenging the conventions of modern literature and form.'}&rdquo;
          </p>
          <div className="w-8 h-px mx-auto" style={{ backgroundColor: accentColor }} />
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            CRITICAL ACCLAIM &bull; THE VELORA PRESS
          </p>
        </div>

        {/* Bottom Barcode & Imprint */}
        <div className="relative z-10 flex items-end justify-between pt-4 border-t border-white/10">
          <div className="text-left">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">
              PUBLISHED BY VELORA
            </span>
            <span className="text-[9px] font-mono text-slate-300">
              FICTION / SPECULATIVE
            </span>
          </div>

          <div className="bg-white p-1 rounded shadow text-slate-950 text-center">
            {/* Simulated barcode */}
            <div className="flex gap-[2px] h-6 items-center px-1">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 3].map((w, i) => (
                <div
                  key={i}
                  className="bg-black h-full"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <span className="block text-[7px] font-mono tracking-tighter">
              {barcodeText}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. FULL WRAP (Back, Spine, Front combined)
  return (
    <div
      className={`relative w-full aspect-[2.1/1] rounded-xl shadow-2xl overflow-hidden flex border border-white/15 select-none ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Back Section */}
      <div className="w-[45%] h-full p-6 flex flex-col justify-between border-r border-white/5 relative">
        <span
          className="text-[9px] uppercase tracking-[0.25em] font-semibold"
          style={{ color: accentColor }}
        >
          SYNOPSIS
        </span>
        <p className="text-[11px] leading-relaxed text-slate-300 font-serif italic line-clamp-6">
          {backCoverBlurb}
        </p>
        <div className="text-[8px] font-mono text-slate-400">
          {barcodeText} &bull; VELORA PUBLISHING
        </div>
      </div>

      {/* Spine Section */}
      <div
        className="w-[10%] h-full flex flex-col items-center justify-between py-6 border-x border-white/10 relative"
        style={{ backgroundColor: `${bgColor}dd` }}
      >
        <span className="text-[8px] tracking-widest text-slate-400 uppercase rotate-90 my-2">
          VELORA
        </span>
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-[10px] font-bold tracking-wider text-slate-100 uppercase -rotate-90 whitespace-nowrap"
            style={{ color: accentColor }}
          >
            {title} &bull; {author}
          </span>
        </div>
        <span className="text-[7px] font-mono text-slate-400 rotate-90 my-2">
          {spineWidthMm}mm
        </span>
      </div>

      {/* Front Section */}
      <div className="w-[45%] h-full p-6 flex flex-col justify-between relative">
        <div className="text-right">
          <span
            className="text-[8px] uppercase tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            ORIGINAL WORK
          </span>
        </div>
        <div className="my-auto text-center">
          <h2
            className={`text-lg uppercase font-bold tracking-wider leading-tight ${fontClass}`}
            style={{ color: '#ffffff' }}
          >
            {title}
          </h2>
          <p className="text-[10px] italic text-slate-300 mt-1">{subtitle}</p>
        </div>
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-200">
            {author}
          </span>
        </div>
      </div>
    </div>
  );
};
