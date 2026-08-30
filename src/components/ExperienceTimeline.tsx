/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, MapPin, Briefcase, ChevronRight, FileCode } from "lucide-react";
import { Experience } from "../types";
import { motion } from "motion/react";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <section id="chronological-experiences" className="py-12 px-4 md:px-8 max-w-7xl mx-auto select-none">
      
      {/* Title block header */}
      <div className="border-4 border-retro-black p-4 md:p-6 mb-10 bg-retro-cream-dark rounded shadow-[4px_4px_0px_0px_rgba(30,28,26,1)]">
        <span className="font-mono text-xs text-retro-orange uppercase font-bold tracking-wider">
          EXPERIENCE ARCHIVE
        </span>
        <h2 className="font-serif text-3xl font-extrabold text-retro-black uppercase tracking-tight mt-0.5">
          PROFESSIONAL JOURNEY & IMPACT
        </h2>
        <p className="font-mono text-xs text-retro-gray uppercase tracking-wider block mt-1">
          Architecting resilient payment rails, Go microservices, and core financial infrastructure
        </p>
      </div>

      {/* Main Timeline track */}
      <div className="relative border-l-4 border-retro-black ml-4 md:ml-12 pl-6 md:pl-12 space-y-12">
        
        {/* Absolute ledger background patterns for look-and-feel */}
        <div className="absolute left-[-22px] top-4 w-10 h-10 bg-retro-yellow border-4 border-retro-black rounded-full flex items-center justify-center animate-pulse">
          <Briefcase size={16} className="text-retro-black" />
        </div>

        {experiences.map((exp, index) => {
          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative bg-warm-cream border-4 border-retro-black p-5 md:p-8 rounded shadow-[6px_6px_0px_0px_rgba(30,28,26,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300"
            >
              {/* Giant circle numbers representing historical records */}
              <div className="absolute top-[-20px] right-4 bg-retro-orange text-warm-cream border-2 border-retro-black w-10 h-10 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
                <span className="font-serif font-bold text-sm">0{index + 1}</span>
              </div>

              {/* Header block */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b-2 border-retro-black pb-4 mb-4">
                <div>
                  <h3 className="font-serif text-2xl font-extrabold text-retro-black uppercase tracking-tight md:leading-none">
                    {exp.company}
                  </h3>
                  <div className="font-mono text-sm text-retro-orange uppercase font-bold mt-1">
                    {exp.role}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono text-retro-gray uppercase font-bold">
                  <span className="flex items-center gap-1 bg-retro-cream-dark px-2 py-1 border border-retro-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <Calendar size={12} className="text-retro-orange" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1 bg-retro-cream-dark px-2 py-1 border border-retro-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <MapPin size={12} className="text-retro-green" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Achievements bullet lists */}
              <div className="space-y-3 mb-6">
                <div className="font-serif text-xs italic text-retro-gray uppercase font-bold tracking-wider">
                  Key Contributions & Technical Impact:
                </div>
                <ul className="space-y-2 text-sm text-retro-charcoal font-sans leading-relaxed">
                  {exp.description.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 select-all">
                      <ChevronRight size={16} className="text-retro-orange mt-0.5 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mechanical Tag badges */}
              <div className="border-t border-dashed border-retro-gray pt-4 flex flex-wrap gap-2 items-center">
                <span className="font-mono text-[9px] uppercase text-retro-gray tracking-wide font-extrabold flex items-center gap-1 mr-1">
                  <FileCode size={10} className="text-retro-orange" />
                  Tech Stack & Tooling:
                </span>
                {exp.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-retro-cream-dark border-2 border-retro-black font-mono text-[10px] font-bold uppercase rounded shadow-[1.5px_1.5px_0px_0px_rgba(30,28,26,1)] text-retro-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Decorative timeline terminator seal */}
      <div className="flex justify-center -mt-4 mb-4 select-none">
        <div className="border-4 border-retro-black py-1 px-4 bg-retro-yellow font-mono text-[10px] tracking-widest uppercase font-bold rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-retro-black">
          • RECORD SEQUENCE COMPLETED •
        </div>
      </div>
    </section>
  );
}
