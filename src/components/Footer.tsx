/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Landmark, ArrowUpRight } from "lucide-react";

interface FooterProps {
  name: string;
  year: string;
  location: string;
  email?: string;
  onOpenVault?: () => void;
}

export default function Footer({ name, year, location, email, onOpenVault }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-retro-black text-warm-cream border-t-4 border-retro-black py-10 px-4 md:px-8 mt-12 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left column info */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-serif font-black text-lg uppercase tracking-wider text-warm-cream">
              {name}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-retro-orange"></div>
            <span className="font-mono text-[10px] text-retro-gray uppercase">
              {year} EDITION
            </span>
          </div>
          
          <p className="font-mono text-[9px] text-retro-gray uppercase tracking-widest mt-1.5 leading-normal">
            OPERATING DIRECTLY OUT OF THE {location.toUpperCase()}<br />
            © {currentYear} ALL CODES COMPILED AND REGISTERED LEGALLY.
          </p>

          {email && (
            <div className="mt-4 bg-retro-charcoal/50 border border-retro-gray/30 p-2.5 rounded max-w-sm inline-block text-left shadow-[2px_2px_0px_0px_rgba(226,93,52,0.3)]">
              <span className="block font-mono text-[8px] uppercase tracking-wider text-retro-gray font-bold">DIRECT DISPATCH CABLE</span>
              <a 
                href={`mailto:${email}`} 
                className="text-retro-yellow hover:text-retro-orange font-mono text-xs font-black uppercase tracking-tight block mt-0.5 select-all hover:underline"
              >
                {email}
              </a>
            </div>
          )}
        </div>

        {/* Decorative Seal insignia center - Clickable secret vault trigger */}
        <button 
          onClick={onOpenVault}
          className="hidden lg:flex flex-col items-center border border-retro-gray border-opacity-45 hover:border-retro-yellow hover:bg-retro-charcoal/40 p-2.5 rounded max-w-[190px] text-center select-none cursor-pointer transition-all group"
          title="Access restricted terminal vault (/vault)"
        >
          <Landmark size={14} className="text-retro-yellow group-hover:scale-110 transition-transform" />
          <span className="font-serif text-[9px] font-bold text-warm-cream uppercase mt-1 group-hover:text-retro-yellow transition-colors">
            CYBERNETIC SEAL OF CRAFT
          </span>
          <span className="font-mono text-[8px] text-retro-gray uppercase block mt-0.5">
            [ 🔒 ACCESS VAULT ]
          </span>
        </button>

        {/* Right column credits/navigation */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
          <a
            href="#"
            className="flex items-center gap-1 font-display text-xs uppercase text-retro-yellow hover:text-retro-orange transition-colors font-bold"
          >
            <span>Back to top index</span>
            <ArrowUpRight size={12} />
          </a>
          <span className="font-mono text-[9px] text-retro-gray uppercase">
            Designed for 100% Client-Side Hardware Efficiency
          </span>
        </div>

      </div>

      {/* Extreme bottom line print credits */}
      <div className="max-w-7xl mx-auto border-t border-retro-gray border-opacity-30 mt-6 pt-4 text-center text-[8px] font-mono text-retro-gray uppercase tracking-[0.2em]">
        TRANSMITTED VIA AIRWAVES • HIGH FIDELITY TRANSISTOR SYSTEM • ENGINEERED WITH PRECISION
      </div>
    </footer>
  );
}
