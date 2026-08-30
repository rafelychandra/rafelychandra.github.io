import { Cpu, ShieldCheck, Layers } from "lucide-react";
import { SkillCategory } from "../types";
import { motion } from "motion/react";

interface SkillsGridProps {
  skills: SkillCategory[];
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  // Retro technical domain banners
  const getAdHeadingBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return "CORE LANGUAGES & DATA STACK";
      case 1:
        return "STREAMING & DISTRIBUTED RAILS";
      default:
        return "CLOUD, DEVOPS & OBSERVABILITY";
    }
  };

  return (
    <section id="technical-advertising" className="py-12 px-4 md:px-8 max-w-7xl mx-auto select-none">
      
      {/* Editorial Section Header */}
      <div className="text-center mb-10 border-y-4 border-retro-black py-5 bg-retro-cream-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded select-none">
        <div className="inline-block bg-retro-orange bg-opacity-15 border border-retro-orange text-retro-orange font-mono text-[10px] font-bold px-3 py-0.5 uppercase rounded tracking-widest mb-2">
          ENGINEERING CAPABILITIES & TOOLKIT
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-black text-retro-black uppercase tracking-tight">
          TECHNICAL ARSENAL & PROFICIENCIES
        </h2>
        <p className="font-mono text-xs text-retro-gray uppercase tracking-wider mt-1.5 font-bold">
          Backend Architecture • Distributed Systems • Financial Reliability
        </p>
      </div>

      {/* Grid of Technical Domain Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {skills.map((grp, sIdx) => {
          return (
            <motion.div
              key={grp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sIdx * 0.12 }}
              className="relative bg-warm-cream border-4 border-retro-black p-6 rounded bg-opacity-95 shadow-[6px_6px_0px_0px_rgba(30,28,26,1)] flex flex-col justify-between"
            >
              {/* Category Domain Banner */}
              <div className="absolute top-[-11px] left-6 bg-retro-yellow px-2.5 py-0.5 border-2 border-retro-black rounded font-mono text-[9px] font-bold text-retro-black uppercase flex items-center gap-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none">
                <Layers size={10} className="text-retro-black" />
                <span>DOMAIN 0{sIdx + 1}</span>
              </div>

              <div>
                {/* Typographic Domain Header Badge */}
                <div className="text-center border-2 border-retro-black bg-retro-orange text-warm-cream font-mono font-black text-[9px] py-1 uppercase tracking-widest rounded mb-5 mt-2 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  {getAdHeadingBadge(sIdx)}
                </div>

                {/* Category title */}
                <div className="text-center mb-6">
                  <h3 className="font-serif text-xl md:text-2xl font-extrabold uppercase tracking-tight text-retro-black leading-tight">
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
                            <span className="font-display font-black text-sm uppercase text-retro-black leading-none flex items-center gap-1.5">
                              <span className="text-retro-orange text-xs">▸</span>
                              {item.name}
                            </span>
                            {item.description && (
                              <p className="font-mono text-[10px] text-retro-gray uppercase tracking-tight mt-1 pl-3.5 leading-snug">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Guarantee badge stamp at the bottom */}
              <div className="border-t-2 border-retro-black mt-6 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-retro-charcoal font-bold uppercase leading-tight">
                  <ShieldCheck size={14} className="text-retro-green" />
                  <span>Production Proven</span>
                </div>
                
                {/* Vintage Badge emblem */}
                <div className="bg-retro-cream-dark text-retro-black border border-retro-black px-2.5 py-0.5 font-mono text-[8px] uppercase font-bold rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  Enterprise Grade
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
