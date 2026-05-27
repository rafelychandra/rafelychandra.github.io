/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Play, Square, Music, Volume2, VolumeX, Radio, Disc, ChevronRight, ChevronLeft } from "lucide-react";
import { VinylMelody } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AudioPlayerProps {
  melodyConfig: VinylMelody;
  playlist?: VinylMelody[];
  vintageMode: boolean;
}

export default function AudioPlayer({ melodyConfig, playlist = [], vintageMode }: AudioPlayerProps) {
  // Combine custom playlist or default to melodyConfig if empty
  const tracks = playlist && playlist.length > 0 ? playlist : [melodyConfig];
  
  const [activeSong, setActiveSong] = useState<VinylMelody>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [tempo, setTempo] = useState(activeSong.bpm);
  const [isSynthesizedOk, setIsSynthesizedOk] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const crackleIntervalRef = useRef<number | null>(null);
  const musicIntervalRef = useRef<number | null>(null);
  const synthNodesLocal = useRef<AudioNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

  // Stop music on unmount
  useEffect(() => {
    return () => {
      stopSynthesizer();
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        setIsSynthesizedOk(true);
      }
    }
  };

  const playSynthesizer = async (trackOverride?: VinylMelody, tempoOverride?: number) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const currentTrack = trackOverride || activeSong;
    const currentTempo = tempoOverride || tempo;

    // Set master volume masterGain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Create 1: Vinyl Surface Crackle generator
    // Generates soft noise bursts that emulate dust in vinyl grooves
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const crackleGenerator = () => {
      if (!isPlaying && !audioCtxRef.current) return;
      
      // Let's create an intermittent soft tick
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 1200;
      bandpass.Q.value = 3.0;

      const noiseGain = ctx.createGain();
      // random crackle volumes
      const vol = Math.random() * 0.03 + 0.01;
      noiseGain.gain.setValueAtTime(vol, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      source.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(masterGain);

      source.start();
      synthNodesLocal.current.push(source);
    };

    // Run crackle intermittently
    crackleIntervalRef.current = window.setInterval(() => {
      if (Math.random() > 0.4) {
        crackleGenerator();
      }
    }, 250);

    // Create 2: Soft Retro Jazz Electric Chords or custom track chords definitions
    const chords = currentTrack.chords || [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [196.00, 233.08, 293.66, 349.23], // Gm7
      [130.81, 164.81, 196.00, 233.08]  // C7
    ];

    let chordIndex = 0;
    const playChordNote = (freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const nodeGain = ctx.createGain();
      const lowpass = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.value = freq;

      lowpass.type = "lowpass";
      lowpass.frequency.value = 450; // Muffly warm old tone

      nodeGain.gain.setValueAtTime(0, ctx.currentTime);
      nodeGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15); // gentle attack
      nodeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration - 0.15); // slow release

      osc.connect(lowpass);
      lowpass.connect(nodeGain);
      nodeGain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      synthNodesLocal.current.push(osc);
    };

    const beatDuration = (60 / currentTempo) * 4; // 1 chord every 4 beats

    const playJazzBar = () => {
      const notes = chords[chordIndex];
      // Play chord notes staggered slightly (vintage human feel)
      notes.forEach((freq, idx) => {
        const stagger = idx * 0.04;
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state === "running") {
            playChordNote(freq, beatDuration - stagger - 0.2);
          }
        }, stagger * 1000);
      });

      // Play soft warm bass note on root
      const bassFreq = notes[0] / 2;
      playChordNote(bassFreq, beatDuration - 0.1);

      chordIndex = (chordIndex + 1) % chords.length;
    };

    // Play first immediate bar
    playJazzBar();

    // Loop progressions
    musicIntervalRef.current = window.setInterval(() => {
      playJazzBar();
    }, beatDuration * 1000);

    setIsPlaying(true);
  };

  const stopSynthesizer = () => {
    // Clear intervals
    if (crackleIntervalRef.current) {
      clearInterval(crackleIntervalRef.current);
      crackleIntervalRef.current = null;
    }
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }

    // Stop active audio nodes
    try {
      synthNodesLocal.current.forEach(node => {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
          node.stop();
        }
      });
    } catch (e) {
      // Ignored
    }
    synthNodesLocal.current = [];

    if (masterGainRef.current) {
      masterGainRef.current.disconnect();
      masterGainRef.current = null;
    }

    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSynthesizer();
    } else {
      playSynthesizer();
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(nextMuted ? 0 : 0.08, audioCtxRef.current?.currentTime || 0);
    }
  };

  const selectTrack = (track: VinylMelody) => {
    const wasPlaying = isPlaying;
    stopSynthesizer();
    setActiveSong(track);
    setTempo(track.bpm);
    if (wasPlaying) {
      setTimeout(() => {
        playSynthesizer(track, track.bpm);
      }, 120);
    }
  };

  const currentIndex = tracks.findIndex(t => t.title === activeSong.title);

  const playPrevious = () => {
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    selectTrack(tracks[prevIndex]);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % tracks.length;
    selectTrack(tracks[nextIndex]);
  };

  return (
    <div id="retro-turntable-panel" className="bg-retro-cream-dark border-4 border-retro-black p-4 md:p-6 rounded-lg shadow-[6px_6px_0px_0px_rgba(30,28,26,1)] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden transition-all duration-300">
      
      {/* Newspaper headline style badge */}
      <span className="absolute top-1 right-2 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-retro-gray select-none">
        AMPLIFIED TRANSISTOR REPLAY SERVICE NO. 9
      </span>

      {/* LEFT SECTION: Active Record & Player Controls */}
      <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
        
        {/* Record Graphic */}
        <div className="relative w-32 h-32 md:w-36 md:h-36 flex-shrink-0 flex items-center justify-center">
          {/* Vinyl Disc shadow boundary */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-[#121111] via-[#1a1919] to-[#252323] rounded-full border-4 border-retro-black shadow-md flex items-center justify-center cursor-pointer transition-transform duration-1000 ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "3.5s" }}
            onClick={handleTogglePlay}
          >
            {/* Vinyl grooves */}
            <div className="absolute w-[85%] h-[85%] rounded-full border border-retro-charcoal border-opacity-40"></div>
            <div className="absolute w-[70%] h-[70%] rounded-full border border-retro-charcoal border-opacity-30"></div>
            <div className="absolute w-[50%] h-[50%] rounded-full border border-retro-charcoal border-opacity-50"></div>
            
            {/* Inner label paper colored retro yellow / orange */}
            <div className="absolute w-[36%] h-[36%] bg-retro-orange text-warm-cream border-2 border-retro-black rounded-full flex flex-col items-center justify-center select-none text-center p-1 font-sans">
              <span className="text-[6px] uppercase font-black tracking-tight leading-none text-warm-cream">
                60s MONO
              </span>
              {/* Tiny turntable hole */}
              <div className="w-2.5 h-2.5 bg-retro-cream-dark border border-retro-black rounded-full mt-0.5"></div>
            </div>
          </div>

          {/* Tonearm Selector needle */}
          <div 
            className={`absolute top-0 right-4 w-12 h-16 origin-top-right transition-transform duration-700 pointer-events-none z-10 ${
              isPlaying ? "rotate-20" : "-rotate-12"
            }`}
          >
            {/* Needle Arm */}
            <div className="absolute top-0 right-0 w-1.5 h-16 bg-retro-gray border border-retro-black rounded-full transform -skew-x-6"></div>
            {/* Needle head cartridge */}
            <div className="absolute bottom-0 -left-1 w-3.5 h-5 bg-retro-yellow border border-retro-black rounded"></div>
          </div>
        </div>

        {/* Control Mechanics */}
        <div className="flex-1 w-full space-y-3.5">
          {/* Playlist metadata cards */}
          <div className="bg-warm-cream border-2 border-retro-black p-3.5 rounded shadow-[3px_3px_0px_0px_rgba(30,28,26,1)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-retro-orange bg-opacity-20"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-serif text-[10px] text-retro-orange font-black uppercase tracking-wide">
                <Radio size={12} className="text-retro-orange animate-pulse" />
                Now Broadcasting Record ({currentIndex + 1}/{tracks.length})
              </div>
              <span className="font-mono text-[8px] text-retro-gray uppercase font-bold tracking-wider">
                {activeSong.genre}
              </span>
            </div>
            
            <h4 className="font-serif font-black text-retro-black text-base uppercase leading-tight mt-1 truncate">
              {activeSong.title}
            </h4>
            
            <p className="font-mono text-[9px] text-retro-gray uppercase truncate mt-1">
              Transistor Speed: {tempo} BPM • Waveform: Triangle
            </p>
          </div>

          {/* Button deck */}
          <div className="flex flex-wrap items-center gap-2">
            {/* PREVIOUS TRACK BUTTON */}
            <button
              onClick={playPrevious}
              className="p-2 border-2 border-retro-black bg-warm-cream hover:bg-retro-cream-dark text-retro-black rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(30,28,26,1)] cursor-pointer flex items-center justify-center"
              title="Previous Track"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            {/* PLAY BUTTON */}
            <button
              onClick={handleTogglePlay}
              id="retro-play-btn"
              className={`px-3 py-2 border-2 border-retro-black font-display font-medium text-xs uppercase flex items-center gap-1.5 rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(30,28,26,1)] transition-all cursor-pointer ${
                isPlaying
                  ? "bg-retro-orange text-warm-cream hover:bg-retro-orange-dark"
                  : "bg-retro-yellow text-retro-black hover:bg-opacity-90"
              }`}
            >
              {isPlaying ? (
                <>
                  <Square size={12} fill="currentColor" />
                  Stop Disc
                </>
              ) : (
                <>
                  <Play size={12} fill="currentColor" />
                  Spin Vinyl
                </>
              )}
            </button>

            {/* NEXT TRACK BUTTON */}
            <button
              onClick={playNext}
              className="p-2 border-2 border-retro-black bg-warm-cream hover:bg-retro-cream-dark text-retro-black rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(30,28,26,1)] cursor-pointer flex items-center justify-center"
              title="Next Track"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>

            {/* MUTE BUTTON */}
            <button
              onClick={handleToggleMute}
              id="retro-mute-btn"
              className="p-2 border-2 border-retro-black bg-warm-cream hover:bg-retro-cream-dark text-retro-black rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(30,28,26,1)] cursor-pointer"
              title={isMuted ? "Unmute Beats" : "Mute Sound"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Tempo adjuster slider dials */}
            <div className="flex-1 min-w-[120px] flex items-center gap-2 px-1">
              <span className="font-mono text-[9px] text-retro-charcoal uppercase select-none">Pitch</span>
              <input
                type="range"
                min="60"
                max="140"
                value={tempo}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTempo(val);
                  if (isPlaying) {
                    stopSynthesizer();
                    setTimeout(() => playSynthesizer(activeSong, val), 80);
                  }
                }}
                className="w-full h-1 h-accent-retro-orange bg-retro-black rounded appearance-none cursor-ew-resize bg-opacity-70"
              />
              <span className="font-mono text-[9px] text-retro-charcoal font-bold w-6">{tempo}</span>
            </div>
          </div>
          
          <div className="text-[9px] font-mono text-retro-gray italic leading-none">
            * Utilizing high-precision browser oscillator telemetry. Dynamic real-time synthesizer feedback.
          </div>
        </div>
      </div>
    </div>
  );
}
