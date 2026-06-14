/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Play, Square, Music, Volume2, VolumeX, Radio, Disc, ChevronRight, ChevronLeft, Link, Plus, Upload } from "lucide-react";
import { VinylMelody } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AudioPlayerProps {
  melodyConfig: VinylMelody;
  playlist?: VinylMelody[];
  vintageMode: boolean;
}

export default function AudioPlayer({ melodyConfig, playlist = [], vintageMode }: AudioPlayerProps) {
  // Combine custom playlist or default to melodyConfig if empty and declare in state
  const [tracks, setTracks] = useState<(VinylMelody & { audioUrl?: string; audioFile?: File })[]>(() => {
    return playlist && playlist.length > 0 ? playlist : [melodyConfig];
  });
  
  const [activeSong, setActiveSong] = useState<VinylMelody & { audioUrl?: string; audioFile?: File }>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [tempo, setTempo] = useState(activeSong.bpm || 100);
  const [isSynthesizedOk, setIsSynthesizedOk] = useState(false);

  // Custom track generator state variables
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"synth" | "mp3">("mp3");
  const [newBpm, setNewBpm] = useState(100);
  const [newVibe, setNewVibe] = useState<"warm" | "space" | "coffee" | "neon">("warm");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const crackleIntervalRef = useRef<number | null>(null);
  const musicIntervalRef = useRef<number | null>(null);
  const synthNodesLocal = useRef<AudioNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Stop music on unmount
  useEffect(() => {
    return () => {
      stopSynthesizer();
      if (localAudioRef.current) {
        localAudioRef.current.pause();
        localAudioRef.current.src = "";
        localAudioRef.current = null;
      }
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

  const playSynthesizer = async (trackOverride?: VinylMelody & { audioUrl?: string; audioFile?: File }, tempoOverride?: number) => {
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
      const vol = Math.random() * 0.04 + 0.012;
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
    }, 240);

    // Play MP3 audio signal
    if (currentTrack.audioUrl) {
      if (!localAudioRef.current) {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.loop = true;
        localAudioRef.current = audio;
      }
      const audio = localAudioRef.current;
      audio.src = currentTrack.audioUrl;

      if (!mediaElementSourceRef.current) {
        mediaElementSourceRef.current = ctx.createMediaElementSource(audio);
      }
      mediaElementSourceRef.current.disconnect();
      mediaElementSourceRef.current.connect(masterGain);

      // set speed matching activeSong.bpm settings
      const speed = currentTempo / 100;
      audio.playbackRate = Math.min(Math.max(speed, 0.45), 2.2);

      audio.play().catch(e => {
        console.warn("Local playback failed or requires gesture:", e);
      });
    } else {
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
    }

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

    // Stop HTML5 Audio Element playback
    if (localAudioRef.current) {
      localAudioRef.current.pause();
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

  const selectTrack = (track: VinylMelody & { audioUrl?: string; audioFile?: File }) => {
    const wasPlaying = isPlaying;
    stopSynthesizer();
    setActiveSong(track);
    setTempo(track.bpm || 100);
    if (wasPlaying) {
      setTimeout(() => {
        playSynthesizer(track, track.bpm || 100);
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
    <div 
      id="retro-turntable-panel" 
      className="bg-retro-cream-dark border-4 border-retro-black p-4 md:p-6 rounded-lg shadow-[6px_6px_0px_0px_rgba(30,28,26,1)] flex flex-col relative overflow-hidden transition-all duration-300"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          if (file.type.startsWith("audio/") || file.name.endsWith(".mp3") || file.name.endsWith(".wav") || file.name.endsWith(".m4a")) {
            const url = URL.createObjectURL(file);
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            const newTrack = {
              title: nameWithoutExt,
              genre: "Dropped Stereo Signal",
              bpm: 100,
              audioUrl: url,
              audioFile: file
            };
            setTracks(prev => [...prev, newTrack]);
            setTimeout(() => {
              selectTrack(newTrack);
              setTimeout(() => {
                playSynthesizer(newTrack, 100);
              }, 100);
            }, 120);
          }
        }
      }}
    >
      
      {/* Drag & Drop Visual Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-retro-orange/95 border-4 border-dashed border-retro-black z-50 flex flex-col items-center justify-center text-warm-cream p-4 text-center cursor-copy select-none"
          >
            <div className="animate-bounce mb-3">
              <Disc size={44} className="text-warm-cream" />
            </div>
            <span className="font-serif font-black text-lg uppercase tracking-tight">DROP MP3 TO PRESS VINYL DISC!</span>
            <span className="font-mono text-[10px] mt-1.5 max-w-sm opacity-95 block leading-relaxed">
              Your MP3 is processed entirely locally inside your browser interface. No network transfers are dispatched!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newspaper headline style badge */}
      <span className="absolute top-1.5 right-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-retro-gray select-none">
        AMPLIFIED TRANSISTOR REPLAY SERVICE NO. 12
      </span>

      {/* TABS HEADER FOR MODE SELECTION */}
      <div className="flex flex-col sm:flex-row border-b-2 border-retro-black pb-3 mb-4 justify-between items-center text-xs font-mono font-bold uppercase select-none w-full gap-2">
        <div className="flex items-center gap-1.5 text-retro-black font-extrabold">
          <Music size={14} className="text-retro-orange shrink-0 animate-pulse" />
          <span>RECEIVER STATION INTERFACE (ANALOG SYNTH)</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="synth"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-4"
        >
            {/* CONTROLS AREA */}
            <div className="flex flex-col md:flex-row items-center gap-6">
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
                    <span className="text-[6.5px] uppercase font-black tracking-tight leading-none text-warm-cream">
                      {isPlaying ? "SPINNING" : "MONO"}
                    </span>
                    {/* Tiny turntable hole */}
                    <div className="w-2 h-2 bg-retro-cream-dark border border-retro-black rounded-full mt-0.5"></div>
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
              <div className="flex-1 w-full space-y-3">
                {/* Playlist metadata cards */}
                <div className="bg-warm-cream border-2 border-retro-black p-3 rounded shadow-[3px_3px_0px_0px_rgba(30,28,26,1)] transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-retro-orange bg-opacity-20"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-serif text-[9px] text-retro-orange font-black uppercase tracking-wide">
                      <Radio size={11} className="text-retro-orange animate-pulse" />
                      Now Playing Record ({currentIndex + 1}/{tracks.length})
                    </div>
                    <span className="font-mono text-[8px] text-retro-gray uppercase font-bold tracking-wider">
                      {activeSong.genre}
                    </span>
                  </div>
                  
                  <h4 className="font-serif font-black text-retro-black text-base uppercase leading-tight mt-1 truncate">
                    {activeSong.title}
                  </h4>
                  
                  <p className="font-mono text-[9px] text-retro-gray uppercase truncate mt-0.5">
                    {activeSong.audioUrl 
                      ? `Playback Pitch: ${tempo}% • Signal: Stereo Audio` 
                      : `Transistor Speed: ${tempo} BPM • Waveform: Triangle`}
                  </p>
                </div>

                {/* Button deck */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* PREVIOUS TRACK BUTTON */}
                  <button
                    onClick={playPrevious}
                    className="p-1.5 border-2 border-retro-black bg-warm-cream hover:bg-retro-cream-dark text-retro-black rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(30,28,26,1)] cursor-pointer flex items-center justify-center relative z-25"
                    title="Previous Track"
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                  </button>

                  {/* PLAY BUTTON */}
                  <button
                    onClick={handleTogglePlay}
                    id="retro-play-btn"
                    className={`px-3 py-1.5 border-2 border-retro-black font-display font-medium text-xs uppercase flex items-center gap-1.5 rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(30,28,26,1)] transition-all cursor-pointer relative z-25 ${
                      isPlaying
                        ? "bg-retro-orange text-warm-cream hover:bg-retro-orange-dark"
                        : "bg-retro-yellow text-retro-black hover:bg-opacity-90"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square size={10} fill="currentColor" />
                        <span>Stop Disc</span>
                      </>
                    ) : (
                      <>
                        <Play size={10} fill="currentColor" />
                        <span>Spin Vinyl</span>
                      </>
                    )}
                  </button>

                  {/* NEXT TRACK BUTTON */}
                  <button
                    onClick={playNext}
                    className="p-1.5 border-2 border-retro-black bg-warm-cream hover:bg-retro-cream-dark text-retro-black rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(30,28,26,1)] cursor-pointer flex items-center justify-center relative z-25"
                    title="Next Track"
                  >
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>

                  {/* MUTE BUTTON */}
                  <button
                    onClick={handleToggleMute}
                    id="retro-mute-btn"
                    className="p-1.5 border-2 border-retro-black bg-warm-cream hover:bg-retro-cream-dark text-retro-black rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(30,28,26,1)] cursor-pointer relative z-25"
                    title={isMuted ? "Unmute Beats" : "Mute Sound"}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>

                  {/* Tempo / Pitch slider */}
                  <div className="flex-grow min-w-[90px] flex items-center gap-1.5 px-2 py-0.5 bg-retro-cream-dark border border-retro-black bg-opacity-20 rounded relative z-25">
                    <span className="font-mono text-[8px] text-retro-charcoal uppercase select-none">Pitch</span>
                    <input
                      type="range"
                      min="60"
                      max="140"
                      value={tempo}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTempo(val);
                        if (isPlaying) {
                          if (activeSong.audioUrl) {
                            if (localAudioRef.current) {
                              localAudioRef.current.playbackRate = val / 100;
                            }
                          } else {
                            stopSynthesizer();
                            setTimeout(() => playSynthesizer(activeSong, val), 80);
                          }
                        }
                      }}
                      className="w-full h-1 bg-retro-black rounded appearance-none cursor-ew-resize opacity-80"
                    />
                    <span className="font-mono text-[8px] text-retro-charcoal font-bold w-4 text-right">{tempo}</span>
                  </div>
                </div>
                
                <div className="text-[8px] font-mono text-retro-gray italic leading-none">
                  * Dynamic real-time browser-native Web Audio synthesizer. No network buffers required.
                </div>
              </div>
            </div>

          </motion.div>
      </AnimatePresence>

      {/* CHIPPED VINYL PLAYLIST CATALOG (Visible on both view settings!) */}
      <div className="border-t border-dashed border-retro-gray pt-4 mt-4 select-none">
        <div className="flex items-center justify-between pb-1.5 mb-2 font-serif text-[10px] uppercase font-bold text-retro-orange">
          <span>[ CHIPPED VINYL PLAYLIST CATALOG ]</span>
          <span className="font-mono text-[8px] text-retro-gray">{tracks.length} SIGNALS TUNED</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tracks.map((track, idx) => {
            const isActive = activeSong.title === track.title;
            return (
              <button
                key={idx}
                onClick={() => selectTrack(track)}
                className={`w-full text-left p-2 border rounded flex items-center justify-between text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-retro-yellow/30 border-retro-orange font-bold text-retro-orange shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]"
                    : "bg-warm-cream/40 border-retro-black/20 hover:bg-warm-cream/80"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`${isActive ? "text-retro-orange font-black" : "text-retro-gray"}`}>
                    {isActive ? "●" : `${idx + 1}.`}
                  </span>
                  <span className="truncate">{track.title}</span>
                </div>
                <span className="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded select-none shrink-0 ml-1 text-retro-gray">
                  {track.bpm} BPM
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Retro Form Drawer/Section for pressing/adding dynamic records */}
      <div className="border-t border-dashed border-retro-gray pt-4 mt-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setFormError("");
              setFormSuccess(false);
            }}
            className="flex items-center gap-1 text-[9px] font-mono uppercase font-black text-retro-orange bg-warm-cream px-2.5 py-1.5 border-2 border-retro-orange rounded hover:bg-retro-orange hover:text-warm-cream cursor-pointer transition-all active:translate-y-[1px]"
          >
            <Plus size={10} strokeWidth={3} />
            <span>{isFormOpen ? "CLOSE INSTRUMENT PRESS" : "PRESS NEW RECORD / CREATE RETRO TRACK"}</span>
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-warm-cream border-2 border-retro-black p-3.5 rounded mt-3 space-y-3 shadow-[3px_3px_0px_0px_rgba(30,28,26,1)] transition-all">
            <h5 className="font-serif font-extrabold text-xs text-retro-black uppercase tracking-tight">
              CALIBRATE CUSTOM EMISSION SIGNAL
            </h5>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[9px] text-retro-gray uppercase font-bold mb-1">
                  EMISSION TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Favorite Melody"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-retro-cream-dark border border-retro-black rounded p-1.5 text-xs font-mono text-retro-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-retro-gray uppercase font-bold mb-1">
                  BROADCAST SIGNAL TYPE
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewType("mp3");
                      setFormError("");
                    }}
                    className={`flex-1 py-1 px-1.5 border text-[9px] font-mono font-bold rounded uppercase cursor-pointer transition-colors ${
                      newType === "mp3"
                        ? "bg-retro-black text-warm-cream border-retro-black"
                        : "bg-warm-cream text-retro-black border-retro-black/30 hover:border-retro-black"
                    }`}
                  >
                    💿 Local MP3
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewType("synth");
                      setFormError("");
                    }}
                    className={`flex-1 py-1 px-1.5 border text-[9px] font-mono font-bold rounded uppercase cursor-pointer transition-colors ${
                      newType === "synth"
                        ? "bg-retro-black text-warm-cream border-retro-black"
                        : "bg-warm-cream text-retro-black border-retro-black/30 hover:border-retro-black"
                    }`}
                  >
                    🎹 Synth
                  </button>
                </div>
              </div>
            </div>

            {newType === "mp3" ? (
              <div className="border-2 border-dashed border-retro-orange/40 p-4 bg-retro-cream/40 rounded flex flex-col items-center justify-center text-center">
                <Upload size={22} className="text-retro-orange mb-1.5 animate-bounce" />
                <span className="font-serif font-black text-xs text-retro-black uppercase">CHOOSE YOUR LOCAL MP3 FILE</span>
                <input
                  type="file"
                  accept="audio/mp3, audio/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setSelectedFile(file);
                      if (!newTitle.trim()) {
                        setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }
                  }}
                  className="mt-2 text-[10px] font-mono text-retro-charcoal border-2 border-retro-black p-1 bg-warm-cream rounded cursor-pointer w-full max-w-xs focus:outline-none"
                />
                {selectedFile && (
                  <span className="text-[10px] text-green-700 font-mono font-bold mt-2">
                    ✓ File Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] text-retro-gray uppercase font-bold mb-1">
                    AMBIENT GENRE MOOD
                  </label>
                  <select
                    value={newVibe}
                    onChange={(e: any) => setNewVibe(e.target.value)}
                    className="w-full bg-retro-cream-dark border border-retro-black rounded p-1.5 text-xs font-mono text-retro-black focus:outline-none appearance-none"
                  >
                    <option value="warm">Atmospheric Lounge Jazz</option>
                    <option value="space">Space Ambient Sci-Fi</option>
                    <option value="coffee">Late Night Coffee Jazz</option>
                    <option value="neon">Neon Synthwave Pulse</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-retro-gray uppercase font-bold mb-1">
                    TEMPO VALUE SPEED ({newBpm} BPM)
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={newBpm}
                    onChange={(e) => setNewBpm(Number(e.target.value))}
                    className="w-full h-1 mt-3 bg-retro-black rounded appearance-none cursor-ew-resize opacity-85"
                  />
                </div>
              </div>
            )}

            {formError && (
              <div className="text-[10px] font-mono text-red-600 font-bold bg-red-100 p-1 px-2 rounded border border-red-300">
                ⚠️ Error: {formError}
              </div>
            )}

            {formSuccess && (
              <div className="text-[10px] font-mono text-green-700 font-bold bg-green-100 p-1 px-2 rounded border border-green-300">
                🎉 Success: Emission record registered and selected!
              </div>
            )}

            <button
              onClick={() => {
                setFormError("");
                setFormSuccess(false);

                if (!newTitle.trim()) {
                  setFormError("Title is required to press the record.");
                  return;
                }

                if (newType === "mp3") {
                  if (!selectedFile) {
                    setFormError("Please select an MP3/audio file to press the record.");
                    return;
                  }
                  
                  const url = URL.createObjectURL(selectedFile);
                  const newTrackObj = {
                    title: newTitle.trim(),
                    genre: "Imported MP3 Signal",
                    bpm: 100, // unit rating 
                    audioUrl: url,
                    audioFile: selectedFile
                  };

                  setTracks(prev => [...prev, newTrackObj]);
                  setFormSuccess(true);
                  // Select immediately & spin vinyl
                  setTimeout(() => {
                    selectTrack(newTrackObj);
                  }, 150);

                  // reset
                  setNewTitle("");
                  setSelectedFile(null);
                } else {
                  const chordOptions = {
                    warm: [
                      [174.61, 220.00, 261.63, 329.63], // Fmaj7
                      [146.83, 174.61, 220.00, 261.63], // Dm7
                      [196.00, 233.08, 293.66, 349.23], // Gm7
                      [130.81, 164.81, 196.00, 233.08]  // C7
                    ],
                    space: [
                      [130.81, 155.56, 196.00, 233.08],
                      [103.83, 155.56, 207.65, 246.94],
                      [174.61, 207.65, 261.63, 311.13],
                      [98.00, 146.83, 196.00, 246.94]
                    ],
                    coffee: [
                      [110.00, 164.81, 220.00, 277.18],
                      [146.83, 220.00, 293.66, 369.99],
                      [123.47, 146.83, 220.00, 293.66],
                      [164.81, 246.94, 329.63, 392.00]
                    ],
                    neon: [
                      [146.83, 185.00, 220.00, 293.66],
                      [110.00, 130.81, 196.00, 246.94],
                      [130.81, 164.81, 196.00, 261.63],
                      [98.00, 146.83, 196.00, 246.94]
                    ]
                  };

                  const genreLabels = {
                    warm: "Lounge Jazz",
                    space: "Space Ambient Sci-Fi",
                    coffee: "Late Night Coffee Jazz",
                    neon: "Synthwave Pulse"
                  };

                  const newTrackObj = {
                    title: newTitle.trim(),
                    genre: genreLabels[newVibe] || "Atmospheric Lounge",
                    bpm: newBpm,
                    chords: chordOptions[newVibe]
                  };

                  setTracks(prev => [...prev, newTrackObj]);
                  setFormSuccess(true);
                  // Select immediately & play
                  setTimeout(() => {
                    selectTrack(newTrackObj);
                  }, 150);

                  // reset
                  setNewTitle("");
                }
              }}
              className="w-full py-2 border-2 border-retro-black bg-retro-yellow hover:bg-opacity-95 text-retro-black font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 rounded shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(30,28,26,1)] transition-all cursor-pointer"
            >
              <span>PRESS & PRESS SIGNAL INTO CASSETTE RECORD</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
