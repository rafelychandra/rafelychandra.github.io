/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Disc, 
  Music, 
  Radio, 
  Upload, 
  Repeat,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { AudioTrack } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AudioPlayerProps {
  tracks?: AudioTrack[];
  vintageMode?: boolean;
}

const DEFAULT_TRACKS: AudioTrack[] = [
  {
    id: "track-1",
    title: "Wouldn't It Be Nice",
    artist: "The Beach Boys",
    album: "Pet Sounds (1966)",
    genre: "Sunshine Pop / Chamber Rock",
    src: "/assets/audio/track-1.mp3",
    duration: "2:25"
  },
  {
    id: "track-2",
    title: "God Only Knows",
    artist: "The Beach Boys",
    album: "Pet Sounds (1966)",
    genre: "Baroque Pop",
    src: "/assets/audio/track-2.mp3",
    duration: "2:53"
  },
  {
    id: "track-3",
    title: "A Day in the Life",
    artist: "The Beatles",
    album: "Sgt. Pepper's (1967)",
    genre: "Psychedelic Rock",
    src: "/assets/audio/track-3.mp3",
    duration: "5:38"
  },
  {
    id: "track-4",
    title: "Echoes",
    artist: "Pink Floyd",
    album: "Meddle (1971)",
    genre: "Progressive Rock",
    src: "/assets/audio/track-4.mp3",
    duration: "4:42"
  },
  {
    id: "track-5",
    title: "Don't Stop Me Now",
    artist: "Queen",
    album: "Jazz (1978)",
    genre: "Glam Rock",
    src: "/assets/audio/track-5.mp3",
    duration: "3:29"
  }
];

export default function AudioPlayer({ tracks, vintageMode = true }: AudioPlayerProps) {
  const playlist = tracks && tracks.length > 0 ? tracks : DEFAULT_TRACKS;

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customTrackTitle, setCustomTrackTitle] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];
  const activeAudioSrc = customAudioUrl || currentTrack.src;
  const activeTitle = customTrackTitle || currentTrack.title;
  const activeArtist = customAudioUrl ? "Local Audio File" : currentTrack.artist;

  // Format time in mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setLoadError(false);
      }).catch(() => {
        setIsPlaying(false);
        setLoadError(true);
      });
    }
  };

  // Next Track
  const handleNext = () => {
    setCustomAudioUrl(null);
    setCustomTrackTitle(null);
    setLoadError(false);
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  // Prev Track
  const handlePrev = () => {
    setCustomAudioUrl(null);
    setCustomTrackTitle(null);
    setLoadError(false);
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // Seek bar
  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  // Volume slider
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Local file upload support
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomAudioUrl(objectUrl);
      setCustomTrackTitle(file.name.replace(/\.[^/.]+$/, ""));
      setLoadError(false);
      setIsPlaying(false);
    }
  };

  // Audio source change effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = activeAudioSrc;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
          setLoadError(true);
        });
      }
    }
  }, [currentTrackIndex, customAudioUrl]);

  return (
    <div className="bg-retro-cream-dark border-4 border-retro-black p-4 md:p-6 rounded-lg shadow-[6px_6px_0px_0px_rgba(30,28,26,1)] flex flex-col relative overflow-hidden transition-all duration-300">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={activeAudioSrc}
        loop={isLooping}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setLoadError(false);
          }
        }}
        onEnded={() => {
          if (!isLooping) {
            handleNext();
          }
        }}
        onError={() => {
          setLoadError(true);
          setIsPlaying(false);
        }}
      />

      {/* Hidden file input for uploading MP3 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Banner Tag */}
      <span className="absolute top-1.5 right-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-retro-gray select-none">
        HIGH-FIDELITY VINYL TURNTABLE • STEREO MP3
      </span>

      {/* Header */}
      <div className="flex border-b-2 border-retro-black pb-3 mb-4 items-center justify-between text-xs font-mono font-bold uppercase select-none w-full">
        <div className="flex items-center gap-1.5 text-retro-black font-extrabold">
          <Music size={14} className="text-retro-orange shrink-0 animate-pulse" />
          <span>RECEIVER STATION (MP3 VINYL PLAYER)</span>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 bg-warm-cream hover:bg-retro-yellow border-2 border-retro-black px-2.5 py-0.5 rounded font-mono text-[9px] font-bold text-retro-black cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
          title="Play custom MP3 file from your device"
        >
          <Upload size={11} />
          <span>Upload MP3</span>
        </button>
      </div>

      {/* Main Turntable & Control Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Turntable Vinyl Graphic */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
            {/* Spinning Vinyl Record Disc */}
            <div
              onClick={togglePlay}
              className={`absolute inset-0 bg-gradient-to-br from-[#121111] via-[#1a1919] to-[#252323] rounded-full border-4 border-retro-black shadow-lg flex items-center justify-center cursor-pointer transition-transform ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "3s" }}
            >
              {/* Grooves */}
              <div className="absolute w-[88%] h-[88%] rounded-full border border-retro-charcoal/40"></div>
              <div className="absolute w-[74%] h-[74%] rounded-full border border-retro-charcoal/30"></div>
              <div className="absolute w-[56%] h-[56%] rounded-full border border-retro-charcoal/50"></div>
              
              {/* Inner Vinyl Label */}
              <div className="absolute w-[36%] h-[36%] bg-gradient-to-br from-retro-orange to-amber-600 text-warm-cream border-2 border-retro-black rounded-full flex flex-col items-center justify-center select-none text-center p-1 font-sans shadow-inner">
                <span className="text-[6.5px] uppercase font-black tracking-tight leading-none text-warm-cream">
                  {isPlaying ? "33⅓ RPM" : "STEREO"}
                </span>
                <div className="w-2.5 h-2.5 bg-retro-cream-dark border border-retro-black rounded-full mt-0.5"></div>
              </div>
            </div>

            {/* Tonearm Needle */}
            <div
              className={`absolute top-0 right-3 w-12 h-20 origin-top-right transition-transform duration-700 pointer-events-none z-10 ${
                isPlaying ? "rotate-[26deg]" : "rotate-0"
              }`}
            >
              <div className="w-2 h-2 bg-retro-orange border border-retro-black rounded-full absolute right-0 top-0"></div>
              <div className="w-1 h-16 bg-retro-charcoal border-r border-retro-black absolute right-0.5 top-1"></div>
              <div className="w-3 h-4 bg-retro-black absolute -left-1 bottom-0 rounded-xs"></div>
            </div>
          </div>

          <span className="font-mono text-[9px] text-retro-gray uppercase tracking-widest mt-2 font-bold">
            {isPlaying ? "⚡ PLAYING MP3 STREAM" : "● DECK READY"}
          </span>
        </div>

        {/* Right Track Meta & Mechanical Controls */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          {/* Track Information Display Box */}
          <div className="bg-warm-cream border-2 border-retro-black p-3.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(30,28,26,1)]">
            <div className="flex items-center justify-between text-[8.5px] font-mono text-retro-orange font-black uppercase">
              <span>TRACK {currentTrackIndex + 1} / {playlist.length}</span>
              <span>{currentTrack.genre}</span>
            </div>

            <h3 className="font-serif font-black text-xl text-retro-black leading-tight mt-0.5 truncate">
              {activeTitle}
            </h3>
            <p className="font-mono text-xs text-retro-charcoal font-bold mt-0.5 truncate">
              {activeArtist} {currentTrack.album ? `— ${currentTrack.album}` : ""}
            </p>

            {/* Load error helper notification */}
            {loadError && (
              <div className="mt-2 bg-amber-100 border border-amber-400 text-amber-900 p-1.5 rounded text-[9.5px] font-mono flex items-center gap-1.5">
                <AlertCircle size={12} className="text-amber-700 shrink-0" />
                <span>
                  File <code className="font-bold">{activeAudioSrc}</code> belum ditemukan. Silakan letakkan file di <strong>public/assets/audio/</strong> atau klik tombol <strong>Upload MP3</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Progress Seek Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px] text-retro-charcoal font-bold">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-retro-orange cursor-pointer h-1.5 bg-retro-cream rounded-lg"
            />
          </div>

          {/* Buttons Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Play / Next / Prev buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 bg-warm-cream hover:bg-retro-yellow border-2 border-retro-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="Previous Track"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={togglePlay}
                className="px-4 py-2 bg-retro-orange hover:bg-retro-orange-dark text-warm-cream border-2 border-retro-black rounded font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
              </button>

              <button
                onClick={handleNext}
                className="p-2 bg-warm-cream hover:bg-retro-yellow border-2 border-retro-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="Next Track"
              >
                <SkipForward size={16} />
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 border-2 border-retro-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors ${
                  isLooping ? "bg-amber-300 text-black font-bold" : "bg-warm-cream hover:bg-retro-cream"
                }`}
                title="Toggle Repeat / Loop"
              >
                <Repeat size={14} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="cursor-pointer text-retro-black">
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-retro-orange cursor-pointer h-1.5 bg-retro-cream rounded-lg"
                title="Volume"
              />
            </div>
          </div>

          {/* Quick Track Pill Selector */}
          <div className="flex gap-1.5 overflow-x-auto pt-2">
            {playlist.map((track, idx) => (
              <button
                key={track.id || idx}
                onClick={() => {
                  setCustomAudioUrl(null);
                  setCustomTrackTitle(null);
                  setLoadError(false);
                  setCurrentTrackIndex(idx);
                }}
                className={`px-2.5 py-1 rounded font-mono text-[9.5px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer border ${
                  currentTrackIndex === idx && !customAudioUrl
                    ? "bg-purple-900 text-white border-retro-black shadow-xs"
                    : "bg-warm-cream hover:bg-white text-slate-700 border-slate-300"
                }`}
              >
                {idx + 1}. {track.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
