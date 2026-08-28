/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sliders, RefreshCw, FileText, Sparkles, Image, Radio } from "lucide-react";
import { Profile } from "../types";

interface NavbarProps {
  profile: Profile;
  siteTitle: string;
  vintageMode: boolean;
  setVintageMode: (mode: boolean) => void;
  grainIntensity: number;
  setGrainIntensity: (val: number) => void;
  onOpenVault?: () => void;
}

export default function Navbar({
  profile,
  siteTitle,
  vintageMode,
  setVintageMode,
  grainIntensity,
  setGrainIntensity,
  onOpenVault,
}: NavbarProps) {
  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <nav className="w-full bg-warm-cream border-b-4 border-retro-black relative z-30 select-none">
      {/* Top Banner: Vintage Classification banner */}
      <div className="bg-retro-black text-warm-cream text-center py-1.5 px-4 font-mono text-[10px] uppercase tracking-[0.25em] font-medium flex justify-between items-center">
        <span className="font-bold text-left text-warm-cream">
          CLASSIFIED PORTFOLIO ENVELOPE
        </span>
        <span className="hidden sm:inline">OFFICIAL COMPUTATIONAL REGISTRY • {profile.establishmentYear}</span>
        <span className="font-mono">{profile.location}</span>
      </div>

      {/* Main double column print logo */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-extrabold tracking-tight text-retro-black uppercase">
              {profile.name}
            </span>
            <div className="bg-retro-orange text-warm-cream font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wide border border-retro-black rounded rotate-[3deg] inline-block font-bold">
              Senior Tech
            </div>
          </div>
          <p className="font-mono text-xs text-retro-gray uppercase tracking-wider mt-1 font-bold">
            {profile.role}
          </p>
        </div>

        {/* Navigation items / controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#chronological-experiences"
            className="px-3.5 py-1.5 font-display text-xs uppercase font-medium text-retro-black hover:bg-retro-cream-dark border-2 border-transparent hover:border-retro-black rounded transition-all"
          >
            Work History
          </a>
          <a
            href="#educational-creds"
            className="px-3.5 py-1.5 font-display text-xs uppercase font-medium text-retro-black hover:bg-retro-cream-dark border-2 border-transparent hover:border-retro-black rounded transition-all"
          >
            Education
          </a>
          <a
            href="#technical-advertising"
            className="px-3.5 py-1.5 font-display text-xs uppercase font-medium text-retro-black hover:bg-retro-cream-dark border-2 border-transparent hover:border-retro-black rounded transition-all"
          >
            Skill Grid
          </a>

          {/* Interactive Lab Control Button */}
          <button
            onClick={() => setControlsOpen(!controlsOpen)}
            id="nav-controls-toggle"
            className={`px-3 py-1.5 border-2 border-retro-black font-display font-medium text-xs uppercase flex items-center gap-1.5 rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors ${
              controlsOpen ? "bg-retro-yellow text-retro-black" : "bg-warm-cream text-retro-black hover:bg-retro-cream-dark"
            }`}
          >
            <Sliders size={12} />
            <span>Tune Vibe</span>
          </button>
        </div>
      </div>

      {/* Retro tuning deck box overlay */}
      {controlsOpen && (
        <div className="bg-retro-cream-dark border-t-2 border-retro-black p-4 transition-all animate-none">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-retro-black p-3 rounded bg-warm-cream relative">
              <div className="absolute top-[-10px] left-3 bg-retro-cream-dark px-2 font-serif text-[10px] font-bold text-retro-orange uppercase">
                Visual Print Contrast
              </div>
              <div className="flex items-center justify-between mt-1.5 mb-3">
                <span className="font-mono text-xs text-retro-charcoal uppercase">1960s Sepia Ink</span>
                <button
                  onClick={() => setVintageMode(!vintageMode)}
                  className={`px-2.5 py-1 text-[10px] border-2 border-retro-black font-mono uppercase font-bold rounded cursor-pointer ${
                    vintageMode
                      ? "bg-retro-green text-warm-cream shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-warm-cream text-retro-black hover:bg-retro-cream-dark"
                  }`}
                >
                  {vintageMode ? "Enabled" : "Disabled"}
                </button>
              </div>
              <p className="font-mono text-[9px] text-retro-gray leading-normal">
                Sepia Tone increases contrast, shifts color levels, and integrates an eye-safe physical parchment filter.
              </p>
            </div>

            <div className="border-2 border-retro-black p-3 rounded bg-warm-cream relative">
              <div className="absolute top-[-10px] left-3 bg-retro-cream-dark px-2 font-serif text-[10px] font-bold text-retro-yellow uppercase">
                Paper Texture Noise
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="font-mono text-xs text-retro-charcoal uppercase">GRAIN:</span>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={grainIntensity}
                  onChange={(e) => setGrainIntensity(Number(e.target.value))}
                  className="w-full accent-retro-orange cursor-ew-resize"
                />
                <span className="font-mono text-xs font-bold text-retro-black">{grainIntensity * 10}%</span>
              </div>
              <p className="font-mono text-[9px] text-retro-gray leading-normal mt-2.5">
                Adjusts the density of simulated static newsprint grain. Setting to 0 achieves clean modern vector curves.
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center max-w-3xl mx-auto border-t border-retro-gray pt-3.5 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-retro-orange"></span>
            <p className="font-mono text-[10px] text-retro-charcoal uppercase">
              Notice: This portfolio is fully dynamic. All textual data compiles server-side from <span className="font-bold underline text-retro-orange">src/data.json</span>.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Editorial Newspaper Rules line */}
      <div className="border-t border-retro-black py-0.5">
        <div className="border-t-4 border-retro-black"></div>
      </div>
    </nav>
  );
}
