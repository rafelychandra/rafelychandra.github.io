/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scissors, ShieldCheck } from "lucide-react";
import { SkillCategory } from "../types";
import { motion } from "motion/react";

interface SkillsGridProps {
  skills: SkillCategory[];
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  // Little retro badges based on skill index for variation
  const getAdHeadingBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return "NOW STANDARD INSTALLATION!";
      case 1:
        return "100% TRANSISTOR CONTROLLED!";
      default:
        return "TRUSTED BY THE GENTILE MASTER!";
    }
  };

  return (
    <section id="technical-advertising" className="py-12 px-4 md:px-8 max-w-7xl mx-auto select-none">
      
      {/* Newspaper Classifieds Section Header */}
      <div className="text-center mb-10 border-y-4 border-retro-black py-4 bg-retro-cream-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded select-none">
        <h2 className="font-serif text-3xl font-black text-retro-black uppercase tracking-tight">
          THE CLASSIFIED ADVERTISING MART
        </h2>
        <p className="font-mono text-xs text-retro-gray uppercase tracking-wider mt-1 font-bold">
          High-performance systems • Meticulous standards • Instant application downloads
        </p>
      </div>

      {/* Grid of Antique Coupon style blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {skills.map((grp, sIdx) => {
          return (
            <motion.div
              key={grp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sIdx * 0.12 }}
              className="relative bg-warm-cream border-2 border-dashed border-retro-black p-6 rounded bg-opacity-95 shadow-[4px_4px_0px_0px_rgba(30,28,26,1)]"
            >
              {/* Cutting coupon Scissor banner */}
              <div className="absolute top-[-10px] left-8 bg-warm-cream px-2 flex items-center gap-1.5 text-retro-black text-[10px] font-mono lowercase tracking-tight select-none">
                <Scissors size={10} className="transform rotate-90" />
                <span>cut along dotted boundary</span>
              </div>

              {/* Big Typographic promotional advertisement badge */}
              <div className="text-center border-2 border-retro-black bg-retro-orange text-warm-cream font-mono font-black text-[9px] py-1 uppercase tracking-widest rounded mb-5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                {getAdHeadingBadge(sIdx)}
              </div>

              {/* Category title */}
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl font-extrabold uppercase tracking-tight text-retro-black leading-none">
                  {grp.category}
                </h3>
                <div className="border-b-2 border-double border-retro-black w-24 mx-auto mt-2.5"></div>
              </div>

              {/* Ad content skills lists */}
              <div className="space-y-4">
                {grp.items.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="border-b border-dashed border-retro-gray last:border-b-0 pb-3 last:pb-0 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-display font-black text-sm uppercase text-retro-black leading-none">
                            {item.name}
                          </span>
                          {item.description && (
                            <p className="font-mono text-[10px] text-retro-gray uppercase tracking-tight mt-1 leading-snug">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Guarantee badge stamp at the bottom of the classified coupon */}
              <div className="border-t-2 border-retro-black mt-6 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-retro-charcoal font-bold uppercase leading-tight">
                  <ShieldCheck size={14} className="text-retro-green" />
                  <span>Quality Assured</span>
                </div>
                
                {/* Vintage Price Tag emblem */}
                <div className="bg-retro-yellow text-retro-black border border-retro-black px-2 py-0.5 font-mono text-[8px] uppercase font-serif font-black rounded rotate-[-4deg] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  VALUE PACKED!
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
