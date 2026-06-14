/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, ArrowDownRight, Globe, Landmark, Clock, FileBadge } from "lucide-react";
import { Profile } from "../types";
import { motion } from "motion/react";

interface HeroSectionProps {
  profile: Profile;
  newspaperName: string;
  todaysDateOverride?: string;
  quoteOfTheDay: string;
}

export default function HeroSection({
  profile,
  newspaperName,
  todaysDateOverride,
  quoteOfTheDay,
}: HeroSectionProps) {
  // Simple functional date string
  const formattedDate = todaysDateOverride || new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto select-none">
      {/* Newspaper Masthead Layout */}
      <div className="border-4 border-retro-black p-4 md:p-6 bg-warm-cream rounded shadow-[4px_4px_0px_0px_rgba(30,28,26,1)] relative overflow-hidden">
        
        {/* Background Vintage Lining */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[radial-gradient(#1e1c1a_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>

        {/* Masthead Header Details */}
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left border-b-2 border-retro-black pb-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-retro-orange animate-pulse" />
            <span className="font-mono text-xs text-retro-charcoal font-semibold uppercase tracking-wider">
              PRINT EDITION NO. 85
            </span>
          </div>
          
          <div className="font-serif italic text-lg text-retro-black tracking-wide font-semibold text-center">
            "The Authority on Electronic Machinery & Structural Typography"
          </div>

          <div className="bg-retro-black text-warm-cream text-xs font-mono px-3 py-1 font-bold rounded">
            VOL. LXIV
          </div>
        </div>

        {/* Huge Newspaper Title */}
        <div className="py-6 md:py-8 text-center border-b-4 border-retro-black select-none">
          <h1 className="font-serif font-black tracking-tighter leading-none italic uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-retro-black select-all">
            {newspaperName}
          </h1>
        </div>

        {/* Secondary Masthead Banner: Dynamic Date, price, and statement */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 border-b-2 border-retro-black font-mono text-xs text-retro-charcoal gap-2 font-bold select-none">
          <div>{profile.location.toUpperCase()}</div>
          <div className="border-t border-b sm:border-y-0 border-retro-gray py-1 sm:py-0 w-full sm:w-auto text-center font-extrabold text-retro-orange">
            {formattedDate}
          </div>
          <div>PRICE: 10 CENTS</div>
        </div>

        {/* News Layout Grid: Main Headline Column (Full Width) */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 pt-6">
          
          {/* Main Editorial Text (Full Width Span) */}
          <div className="flex flex-col justify-between border-b lg:border-b-0 border-retro-black pb-8 lg:pb-0">
            <div className="space-y-4">
              <div className="border-b border-dashed border-retro-gray pb-2">
                <span className="bg-retro-yellow text-retro-black font-mono text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mr-2.5 inline-block">
                  {profile.role.toUpperCase()}
                </span>
                <span className="font-sans font-bold text-retro-black text-lg uppercase tracking-tight leading-tight block sm:inline mt-1.5 sm:mt-0">
                  RAFELY CHANDRA UNVEILS DIGITAL APPARATUS CODE
                </span>
              </div>

              {/* Internal layout grid to put profile portrait side by side with the news article */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Left side within Editorial: Profile picture section */}
                <div className="md:col-span-4 flex flex-col">
                  {/* Aspect ratio frame with vintage grayscale/sepia filter support */}
                  <div className="aspect-[4/5] bg-retro-yellow/10 border-4 border-retro-black mb-3 relative flex flex-col items-center justify-center overflow-hidden transition-all duration-500 shadow-[3px_3px_0px_0px_rgba(30,28,26,1)] hover:shadow-[4px_4px_0px_0px_rgba(242,100,25,1)] group rounded-xs">
                    <div className="absolute inset-0 border-[6px] border-warm-cream/30 z-10 pointer-events-none"></div>
                    
                    {profile.picture ? (
                      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-retro-cream-dark">
                        <img
                          src={profile.picture}
                          alt={profile.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale sepia-[0.15] contrast-[1.25] brightness-[0.92] group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // If the local file is not found, fallback gracefully to the classic tech schematic
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* 1960s Newsprint Screen Halftone Overlay */}
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-[0.22] mix-blend-multiply bg-repeat"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23000'/%3E%3C/svg%3E")`,
                            backgroundSize: '3px 3px'
                          }}
                        ></div>
                        {/* Editorial Warm Sepia Multiply Accent */}
                        <div className="absolute inset-0 bg-retro-orange/5 mix-blend-multiply pointer-events-none"></div>
                      </div>
                    ) : (
                      /* Classic modular vector schematic of mid-century technical operator */
                      <div className="w-full h-full flex flex-col items-center justify-center bg-retro-cream-dark p-3.5 relative select-none">
                        <div className="absolute inset-1.5 border border-dashed border-retro-orange/20 rounded-xs"></div>
                        
                        <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-retro-black" fill="none" stroke="currentColor" strokeWidth="2.5">
                          {/* Face outline */}
                          <circle cx="50" cy="35" r="18" className="stroke-retro-black fill-warm-cream/50" />
                          <circle cx="50" cy="35" r="15" className="stroke-retro-orange" strokeDasharray="2 1" />
                          
                          {/* Iconic 1960s style heavy rims glasses */}
                          <path d="M37 34h26M37 35 a6 6 0 0 0 11 0 M52 35 a6 6 0 0 0 11 0" className="stroke-retro-black fill-retro-yellow/35" strokeWidth="2" />
                          <path d="M50 32v4" className="stroke-retro-black" />

                          {/* Flat hair cap style */}
                          <path d="M33 26h34l-2 -3c-3-3 -10-4 -15-4s-12 1 -15 4z" className="fill-retro-black" />

                          {/* Neck, Tie and Collar details */}
                          <path d="M48 53h4v15l-2 3l-2 -3z" className="fill-retro-orange stroke-retro-black" strokeWidth="1.5" />
                          <path d="M42 53l8 2l8-2" className="stroke-retro-black" />

                          {/* Operator shoulders jacket */}
                          <path d="M22 80c0-10 10-27 28-27s28 17 28 27" className="stroke-retro-black fill-retro-cream-dark" />
                        </svg>
                        
                        <span className="font-mono text-[8px] text-retro-orange font-bold uppercase tracking-widest mt-1">
                          OFFICIAL PHOTO
                        </span>
                      </div>
                    )}

                    {/* Stamp Caption block */}
                    <div className="absolute bottom-0 w-full bg-retro-black text-warm-cream py-1 text-center font-mono text-[9px] uppercase font-bold tracking-wider z-20">
                      {profile.name}
                    </div>
                  </div>

                  {/* Identification registry number */}
                  <div className="border-2 border-dashed border-retro-gray p-1.5 text-center bg-retro-cream-dark/40 rounded-xs">
                    <span className="font-mono text-[8px] font-bold text-retro-gray block uppercase">REGULATION CODE</span>
                    <span className="font-mono text-[10px] font-black text-retro-orange select-all">AV-620941-F</span>
                  </div>
                </div>

                {/* Right side within Editorial: Main dropcap narrative & paragraphs */}
                <div className="md:col-span-8 space-y-4">
                  {/* Bold first paragraph with dynamic drop cap */}
                  <p className="font-serif text-retro-black text-base md:text-lg font-medium leading-relaxed italic relative">
                    <span className="float-left text-4xl font-extrabold text-retro-orange mr-2 sm:mr-3 mt-1 font-serif border-4 border-retro-black px-1.5 pb-0.5 bg-retro-cream-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                      {profile.retroNarrative[0]?.charAt(0)}
                    </span>
                    {profile.retroNarrative[0]?.slice(1)}
                  </p>

                  <p className="text-xs md:text-sm text-retro-charcoal font-sans leading-relaxed select-all">
                    {profile.retroNarrative[1]}
                  </p>
                </div>

              </div>

              {/* Extra narrative block and quote */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 text-xs md:text-sm text-retro-charcoal font-sans leading-relaxed">
                <div className="md:col-span-4"></div>
                <div className="md:col-span-8 space-y-4 border-t border-retro-gray pt-4 bg-retro-cream-dark bg-opacity-30 p-3 rounded-xs font-serif font-medium">
                  <p className="font-sans text-xs md:text-sm text-retro-charcoal leading-relaxed">{profile.retroNarrative[2]}</p>
                  
                  {/* Retro blockquote quoteOfTheDay */}
                  <div className="border-l-4 border-retro-orange pl-3 italic text-xs text-retro-black py-0.5 select-all leading-normal bg-warm-cream/40 p-1.5 rounded-r">
                    "{quoteOfTheDay}"
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action buttons & links inside newspaper element */}
            <div className="pt-6 mt-6 border-t-2 border-retro-black flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                {profile.socials.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 border-2 border-retro-black bg-warm-cream hover:bg-retro-yellow text-retro-black font-mono text-[10px] font-bold tracking-tight uppercase flex items-center gap-1 rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(30,28,26,1)] transition-colors"
                  >
                    <ArrowDownRight size={10} className="text-retro-orange" />
                    {link.platform}
                  </a>
                ))}
              </div>

              <a
                href={`mailto:${profile.contact.email}`}
                className="px-4 py-1.5 border-2 border-retro-black bg-retro-orange text-warm-cream hover:bg-retro-orange-dark font-display font-bold text-xs uppercase flex items-center gap-1.5 rounded shadow-[3px_3px_0px_0px_rgba(30,28,26,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(30,28,26,1)] transition-all cursor-pointer"
              >
                <Mail size={12} />
                <span>Dispatch Cable (Email)</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
