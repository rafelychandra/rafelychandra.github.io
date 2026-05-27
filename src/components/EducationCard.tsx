/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, GraduationCap, Trophy, ClipboardCheck } from "lucide-react";
import { Education } from "../types";
import { motion } from "motion/react";

interface EducationCardProps {
  educations: Education[];
}

export default function EducationCard({ educations }: EducationCardProps) {
  return (
    <section id="educational-creds" className="py-12 px-4 md:px-8 max-w-7xl mx-auto select-none">
      <div className="text-center mb-10">
        <div className="inline-block bg-retro-green bg-opacity-20 border-2 border-retro-green text-retro-green font-mono text-[10px] font-bold px-3 py-1 uppercase rounded tracking-widest mb-2.5">
          SCHOLASTIC CERTIFICATION RECORDS
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-retro-black uppercase tracking-tight">
          ACADEMIC APPRENTICESHIP
        </h2>
        <div className="w-24 h-1 bg-retro-black mx-auto mt-3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {educations.map((edu, idx) => {
          return (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-warm-cream border-4 border-retro-black p-6 md:p-8 rounded relative shadow-[6px_6px_0px_0px_rgba(30,28,26,1)] flex flex-col justify-between"
            >
              {/* Retro top corner decorative label */}
              <div className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-wide text-retro-orange bg-retro-cream-dark px-2 py-0.5 border border-retro-black rounded">
                Record No: ACC-{100 + idx}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-retro-green text-warm-cream border border-retro-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <GraduationCap size={16} />
                  </div>
                  <span className="font-mono text-xs uppercase text-retro-orange tracking-wider font-extrabold">
                    {edu.degree}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold uppercase text-retro-black leading-snug tracking-tight">
                  {edu.school}
                </h3>
                
                <div className="font-mono text-xs text-retro-gray uppercase font-bold mt-1 max-w-md">
                  Major: {edu.major} • Academic Period: {edu.period}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="font-serif text-xs italic text-retro-charcoal uppercase font-bold flex items-center gap-1">
                    <Trophy size={11} className="text-retro-yellow" />
                    Recognized Milestones:
                  </div>

                  <ul className="space-y-2 text-xs md:text-sm text-retro-charcoal font-sans leading-relaxed pl-1">
                    {edu.achievements.map((achieve, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5 select-all">
                        <span className="text-retro-green font-bold text-base leading-none">•</span>
                        <span>{achieve}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-retro-gray mt-6 pt-4 flex justify-between items-center text-[10px] font-mono text-retro-gray uppercase font-bold">
                <span>Verified Seal Signed Ledger</span>
                <span className="text-retro-green text-opacity-80">● Status Active</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
