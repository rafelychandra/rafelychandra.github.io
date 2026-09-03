/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import {
  Lock,
  Unlock,
  ShieldAlert,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Sparkles,
  Film,
  Music,
  Heart,
  Briefcase,
  GraduationCap,
  Trophy,
  Dribbble,
  Disc,
  Tv,
  FileText,
  User,
  Instagram,
  RotateCcw,
  Calendar,
  Layers,
  Play,
  Pause,
  Volume2,
  Video,
  X,
  Camera
} from "lucide-react";
import { VaultConfig, Profile, MediaPosterItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface VaultViewProps {
  vaultConfig?: VaultConfig;
  profile: Profile;
  onExit: () => void;
}

const STORAGE_KEY_AUTH = "rc_vault_authenticated";
const STORAGE_KEY_PASS = "rc_vault_passcode";

interface MediaPosterCardProps {
  media: MediaPosterItem;
  idx: number;
  badgePrefix?: string;
  icon?: "film" | "tv" | "music";
}

function MediaPosterCard({ media, idx, badgePrefix = "ITEM", icon = "film" }: MediaPosterCardProps) {
  const [extIdx, setExtIdx] = useState(0);
  const exts = [".jpg", ".png", ".jpeg", ".webp"];
  const [imgFailed, setImgFailed] = useState(false);

  // Extract base filename without extension
  const basePath = media.poster.replace(/\.[^/.]+$/, "");
  const currentSrc = extIdx === 0 ? media.poster : `${basePath}${exts[extIdx]}`;

  const handleError = () => {
    if (extIdx < exts.length - 1) {
      setExtIdx((prev) => prev + 1);
    } else {
      setImgFailed(true);
    }
  };

  const posterThemes = [
    "from-amber-900 via-orange-950 to-slate-950 border-amber-600 text-amber-200",
    "from-blue-900 via-indigo-950 to-slate-950 border-blue-500 text-blue-200",
    "from-emerald-900 via-teal-950 to-slate-950 border-emerald-500 text-emerald-200",
    "from-red-900 via-rose-950 to-slate-950 border-red-500 text-red-200",
    "from-purple-900 via-zinc-950 to-slate-950 border-purple-500 text-purple-200",
    "from-pink-900 via-fuchsia-950 to-slate-950 border-pink-500 text-pink-200"
  ];
  const theme = posterThemes[idx % posterThemes.length];

  return (
    <div className="group relative aspect-[2/3] max-h-[58vh] w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-slate-300 hover:border-purple-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-slate-900 text-white">
      {!imgFailed ? (
        <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={currentSrc}
            alt={media.title}
            onError={handleError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-3 sm:p-4">
            <span className="font-mono text-[8.5px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {badgePrefix === "CINEMA" ? media.year : `${media.year || ""}${media.genre ? ` • ${media.genre.split("/")[0]}` : ""}`}
            </span>
            <h4 className="font-sans font-black text-sm sm:text-base text-white leading-tight mt-0.5 drop-shadow">
              {media.title}
            </h4>
          </div>
        </div>
      ) : (
        <div className={`w-full h-full p-3 sm:p-4 flex flex-col justify-between bg-gradient-to-b ${theme} relative`}>
          <div className="flex items-center justify-between border-b border-white/20 pb-1.5">
            <span className="font-mono text-[8px] sm:text-[9.5px] uppercase font-bold tracking-widest opacity-80">
              {badgePrefix}
            </span>
            <span className="font-mono text-[8.5px] sm:text-[10px] bg-white/20 px-2 py-0.5 rounded font-black text-white">
              {media.year}
            </span>
          </div>

          <div className="text-center my-auto py-2">
            {icon === "film" && <Film size={26} className="mx-auto mb-2 opacity-70" />}
            {icon === "tv" && <Tv size={26} className="mx-auto mb-2 opacity-70" />}
            {icon === "music" && <Music size={26} className="mx-auto mb-2 opacity-70" />}
            <h4 className="font-serif font-black text-sm sm:text-base uppercase leading-tight tracking-tight text-white drop-shadow">
              {media.title}
            </h4>
            {badgePrefix !== "CINEMA" && media.genre && (
              <span className="font-mono text-[8.5px] sm:text-[10px] opacity-75 uppercase tracking-wide block mt-1">
                {media.genre}
              </span>
            )}
          </div>

          <div className="border-t border-dashed border-white/30 pt-2 text-center">
            <span className="text-[7.5px] sm:text-[8.5px] font-mono text-white/50 block uppercase tracking-tighter">
              Drop: {media.poster.split("/").pop()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface IntroPhotoCardProps {
  idx: number;
  label: string;
  theme?: string;
  span?: string;
  aspect?: string;
}

function IntroPhotoCard({ idx, label, theme, span, aspect }: IntroPhotoCardProps) {
  const [extIdx, setExtIdx] = useState(0);
  const exts = [".jpg", ".png", ".jpeg", ".webp"];
  const [hasError, setHasError] = useState(false);

  const currentSrc = `/assets/intro/photo-${idx + 1}${exts[extIdx]}`;

  const handleError = () => {
    if (extIdx < exts.length - 1) {
      setExtIdx((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const defaultTheme = theme || "from-purple-100 via-white to-amber-50";

  return (
    <div
      className={`group relative rounded-xl overflow-hidden shadow-xs border-2 border-slate-200 hover:border-purple-600 hover:shadow-md transition-all duration-300 flex flex-col justify-between bg-slate-900 text-white ${span || "col-span-1"
        } ${aspect || "h-full min-h-[90px]"}`}
    >
      {!hasError ? (
        <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={currentSrc}
            alt={label}
            onError={handleError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
            <span className="font-mono text-[9px] text-white font-bold">{label}</span>
          </div>
        </div>
      ) : (
        <div className={`w-full h-full p-2 flex flex-col justify-between items-center text-center bg-gradient-to-br ${defaultTheme} text-slate-800`}>
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-[8px] text-purple-900 font-bold bg-purple-200/70 px-1.5 py-0.5 rounded">
              PHOTO {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
            </span>
            <span className="text-xs opacity-60">📸</span>
          </div>

          <div className="my-auto py-0.5">
            <h5 className="font-sans font-black text-[10px] sm:text-[11px] uppercase tracking-tight text-slate-900 leading-tight">
              {label}
            </h5>
            <span className="text-[7px] font-mono text-slate-500 block mt-0.5">
              photo-{idx + 1}.jpg
            </span>
          </div>

          <div className="w-full border-t border-dashed border-slate-300 pt-0.5 text-[6.5px] font-mono text-slate-400 uppercase">
            Drop in public/assets/intro/
          </div>
        </div>
      )}

      {/* Index Number Badge */}
      <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-white text-[7px] font-mono font-bold px-1 rounded z-10">
        #{idx + 1}
      </div>
    </div>
  );
}

interface VinylPhotoCardProps {
  idx: number;
  theme?: string;
}

function VinylPhotoCard({ idx, theme }: VinylPhotoCardProps) {
  const [extIdx, setExtIdx] = useState(0);
  const exts = [".jpg", ".png", ".jpeg", ".webp"];
  const [hasError, setHasError] = useState(false);

  const currentSrc = `/assets/vinyl/vinyl-${idx + 1}${exts[extIdx]}`;

  const handleError = () => {
    if (extIdx < exts.length - 1) {
      setExtIdx((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const defaultTheme = theme || "from-amber-950 via-slate-900 to-black text-amber-200";

  return (
    <div className="group relative aspect-[4/3] sm:aspect-[5/6] rounded-2xl overflow-hidden shadow-md border-2 border-slate-300 hover:border-amber-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-slate-950 text-white">
      {!hasError ? (
        <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
          <img
            src={currentSrc}
            alt={`Vinyl photo ${idx + 1}`}
            onError={handleError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle vinyl groove border highlight */}
          <div className="absolute inset-0 border-4 border-black/20 rounded-2xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-3">
            <span className="font-mono text-[8.5px] text-amber-400 font-bold uppercase tracking-wider">
              DISC 0{idx + 1}
            </span>
          </div>
        </div>
      ) : (
        <div className={`w-full h-full p-3 flex flex-col justify-between bg-gradient-to-br ${defaultTheme} relative`}>
          <div className="flex items-center justify-between border-b border-white/20 pb-1">
            <span className="font-mono text-[8px] uppercase font-bold tracking-widest text-amber-300">
              VINYL #{idx + 1}
            </span>
            <Disc size={13} className="text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
          </div>

          <div className="text-center my-auto py-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-black/40 border border-amber-400/40 flex items-center justify-center mb-1.5 shadow-inner">
              <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface CareerPhoto {
  src: string;
  caption?: string;
}

export interface CareerGalleryModalData {
  company: string;
  role: string;
  period: string;
  photos: CareerPhoto[];
}

function CareerGalleryPhoto({ photo, idx }: { photo: CareerPhoto; idx: number }) {
  const [extIdx, setExtIdx] = useState(0);
  const exts = [".jpg", ".png", ".jpeg", ".webp"];
  const [imgFailed, setImgFailed] = useState(false);

  const basePath = photo.src.replace(/\.[^/.]+$/, "");
  const currentSrc = extIdx === 0 ? photo.src : `${basePath}${exts[extIdx]}`;

  const handleError = () => {
    if (extIdx < exts.length - 1) {
      setExtIdx((prev) => prev + 1);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 hover:border-purple-500 flex flex-col justify-end group shadow-lg transition-all">
      {!imgFailed ? (
        <img
          src={currentSrc}
          alt={`Career photo ${idx + 1}`}
          onError={handleError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full p-6 flex flex-col justify-between items-center text-center bg-gradient-to-br from-purple-950 via-slate-900 to-black text-purple-200">
          <div className="w-full flex justify-between items-center opacity-70 font-mono text-[10px] uppercase border-b border-white/10 pb-1.5">
            <span>PHOTO {String(idx + 1).padStart(2, "0")}</span>
            <Camera size={15} className="text-amber-400" />
          </div>
          <div className="my-auto py-4 flex flex-col items-center">
            <Camera size={38} className="text-purple-400/60 mb-2" />
            <span className="font-mono text-xs font-bold text-white/80 uppercase tracking-widest">
              CAREER PHOTO #{idx + 1}
            </span>
          </div>
          <span className="font-mono text-[9px] text-white/50 block uppercase tracking-tight">
            Drop: {photo.src.split("/").pop()}
          </span>
        </div>
      )}
    </div>
  );
}

interface VideoTemplatePlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  subtitle?: string;
}

function VideoTemplatePlayer({
  src = "/assets/basketball/video.mp4",
  poster = "/assets/basketball/poster.jpg",
  title = "Basketball Highlights & Tape",
  subtitle = "Filkom UB • Amartha 3x3 • Sparring Highlights"
}: VideoTemplatePlayerProps) {
  const [extIdx, setExtIdx] = useState(0);
  const exts = [".mp4", ".mov", ".webm", ".m4v"];
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isYoutube = src.includes("youtube.com") || src.includes("youtu.be");
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const currentSrc = isYoutube || src.startsWith("http")
    ? src
    : src.replace(/\.[^/.]+$/, "") + exts[extIdx];

  const handleVideoError = () => {
    if (!isYoutube && extIdx < exts.length - 1) {
      setExtIdx((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[360px] bg-slate-950 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-800 flex flex-col justify-between group">
      {/* If YouTube Embed */}
      {isYoutube ? (
        <iframe
          src={getEmbedUrl(src)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full min-h-[320px] rounded-2xl"
        />
      ) : !hasError ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black min-h-[280px]">
          <video
            ref={videoRef}
            src={currentSrc}
            poster={poster}
            playsInline
            loop
            muted={isMuted}
            onError={handleVideoError}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover max-h-[440px]"
            onClick={togglePlay}
          />

          {/* Control overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between pointer-events-none">
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="font-mono text-[10px] text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs border border-amber-500/30">
                🏀 GAME TAPE
              </span>
              <span className="font-mono text-[9px] text-white/80 bg-black/60 px-2 py-0.5 rounded">
                1080P HD
              </span>
            </div>

            <div className="flex items-center justify-between pointer-events-auto">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">{subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 font-bold shadow-lg cursor-pointer"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Big Play button when paused */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-all hover:scale-110 shadow-2xl z-10 cursor-pointer"
            >
              <Play size={24} className="ml-0.5" />
            </button>
          )}
        </div>
      ) : (
        /* Video Template Placeholder */
        <div className="w-full h-full min-h-[300px] p-5 md:p-6 flex flex-col justify-between items-center text-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white relative">
          <div className="flex items-center justify-between w-full border-b border-white/10 pb-2.5">
            <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <Video size={12} /> VIDEO TEMPLATE
            </span>
            <span className="font-mono text-[9px] text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded font-bold">
              MP4 / WEBM / MOV / YOUTUBE
            </span>
          </div>

          <div className="my-auto py-3 max-w-md">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center text-2xl mb-2.5 shadow-lg group-hover:scale-105 transition-transform">
              🏀
            </div>
            <h4 className="font-black text-base text-white tracking-tight">
              {title}
            </h4>
            <p className="text-xs text-purple-200 mt-0.5">
              {subtitle}
            </p>

            <div className="mt-3.5 bg-black/50 border border-white/10 rounded-xl p-3 text-left">
              <span className="font-mono text-[9px] text-amber-400 uppercase font-bold block mb-1">
                Parsing Video:
              </span>
              <p className="text-[10.5px] text-slate-300 font-mono leading-relaxed">
                • Taruh file di <code className="text-amber-300 bg-black/60 px-1 py-0.5 rounded">public/assets/basketball/video.mp4</code><br />
                • Atau isi prop <code className="text-purple-300 bg-black/60 px-1 py-0.5 rounded">src="URL"</code> (MP4 / WebM / YouTube link)
              </p>
            </div>
          </div>

          <div className="w-full flex items-center justify-between pt-2.5 border-t border-white/10 text-[9px] font-mono text-slate-400">
            <span>READY FOR VIDEO SOURCE</span>
            <span className="text-amber-400 font-bold">🏀 BASKETBALL HIGHLIGHTS</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VaultView({ vaultConfig, profile, onExit }: VaultViewProps) {
  // Passcode resolution
  const defaultPass = vaultConfig?.defaultPasscode || "1411";
  const [currentPasscode, setCurrentPasscode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PASS) || defaultPass;
  });

  const [inputCode, setInputCode] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEY_AUTH) === "true";
  });
  const [errorStatus, setErrorStatus] = useState<string>("");
  const [shake, setShake] = useState<boolean>(false);

  // Presentation State
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerGalleryModalData | null>(null);
  const currentYear = new Date().getFullYear();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input on mount if not authenticated
  useEffect(() => {
    if (!isAuthenticated && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAuthenticated]);

  // Sync native browser fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard navigation for presentation
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedCareer) {
          e.preventDefault();
          setSelectedCareer(null);
          return;
        }
        if (isFullscreen) {
          exitFullscreenMode();
        }
        return;
      }

      if (selectedCareer) return; // Don't navigate slides if gallery popup is open

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, isFullscreen, selectedCareer]);

  // Toggle true 1-screen browser fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fallback to CSS fullscreen
      setIsFullscreen((prev) => !prev);
    }
  };

  const exitFullscreenMode = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
    setIsFullscreen(false);
  };

  // Audio feedback synthesis
  const playRetroTone = (freq: number, type: OscillatorType = "sine", duration: number = 0.08) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted without user gesture
    }
  };

  const handleAuthorize = (codeToVerify?: string) => {
    const code = codeToVerify !== undefined ? codeToVerify : inputCode;
    if (code.trim() === currentPasscode) {
      playRetroTone(880, "sine", 0.15);
      setTimeout(() => playRetroTone(1320, "sine", 0.2), 100);
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, "true");
      setErrorStatus("");
      setInputCode("");
    } else {
      playRetroTone(160, "sawtooth", 0.25);
      setErrorStatus("PASSCODE INVALID // ACCESS DENIED");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setInputCode("");
    }
  };

  const handleLockout = () => {
    exitFullscreenMode();
    playRetroTone(220, "sawtooth", 0.15);
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    setInputCode("");
    setErrorStatus("");
  };

  const handleKeypadPress = (digit: string) => {
    playRetroTone(600 + parseInt(digit || "0") * 40, "sine", 0.05);
    if (inputCode.length < 8) {
      const nextCode = inputCode + digit;
      setInputCode(nextCode);
      if (nextCode.length === currentPasscode.length) {
        handleAuthorize(nextCode);
      }
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
    playRetroTone(700, "sine", 0.04);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
    playRetroTone(500, "sine", 0.04);
  };

  // =========================================================================
  // PRESENTATION SLIDES DEFINITIONS (13 Clean Native Slides)
  // =========================================================================
  const SLIDES = [
    // 0: COVER SLIDE
    {
      id: "cover",
      title: "KYC - Know Your Colleague",
      subtitle: `CHANKEEY • ${currentYear}`,
      notes: "Sapaan pembuka & pengenalan sesi KYC Chandra.",
      render: () => (
        <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[#451B69] via-[#351253] to-[#200A34] text-white relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-sm">
            <Sparkles size={14} className="text-amber-300 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-200 font-bold">
              AMARTHA • KYC PRESENTATION
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight leading-tight uppercase drop-shadow-md">
            KYC — Know Your Colleague
          </h1>

          <div className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-2xl sm:text-3xl rounded-lg shadow-lg tracking-widest uppercase rotate-[-1deg]">
            CHANKEEY
          </div>

          <div className="mt-10 flex items-center justify-between w-full max-w-xl border-t border-white/20 pt-4 text-xs font-mono text-white/70">
            <span>KYC — Chandra</span>
            <span>{currentYear} EDITION</span>
          </div>
        </div>
      )
    },

    // 1: INTRODUCTION / IDENTITY SLIDE (10-PHOTO GRID TEMPLATE)
    {
      id: "intro",
      title: "Introduction",
      subtitle: "WHO IS CHANKEEY?",
      notes: "Nama lengkap, nama panggilan, tanggal lahir, zodiak, MBTI, dan 10 foto perjalanan hidup Chandra.",
      render: () => (
        <div className="h-full w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#FAFAFA] text-slate-900 overflow-y-auto">
          {/* Header Info & Identity */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-purple-900/10 pb-2 mb-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-[#451B69]">| Introduction</span>
              <span className="bg-purple-900 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-md tracking-wider">
                CHANKEEY
              </span>
              <span className="font-bold text-xs text-slate-700 hidden md:inline">
                Rafely Chandra Rizkilillah (Chandra)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold">
              <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                14 Nov 1996 (Scorpio ♏)
              </span>
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                MBTI: ESTP
              </span>
              <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full hidden sm:inline">
                Payment Platform Engineer
              </span>
            </div>
          </div>

          {/* Dynamic 10-Photo Grid (5 columns x 2 rows) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-auto py-1">
            <IntroPhotoCard idx={0} label="Portrait / Profile" aspect="aspect-[4/3]" theme="from-purple-200 via-purple-50 to-amber-100" />
            <IntroPhotoCard idx={1} label="Basketball Court" aspect="aspect-[4/3]" theme="from-amber-100 to-orange-50" />
            <IntroPhotoCard idx={2} label="Vinyl Collection" aspect="aspect-[4/3]" theme="from-pink-100 to-rose-50" />
            <IntroPhotoCard idx={3} label="Concert / Music" aspect="aspect-[4/3]" theme="from-indigo-100 to-blue-50" />
            <IntroPhotoCard idx={4} label="Office / Squad" aspect="aspect-[4/3]" theme="from-emerald-100 to-teal-50" />
            <IntroPhotoCard idx={5} label="Travel & Life" aspect="aspect-[4/3]" theme="from-cyan-100 to-sky-50" />
            <IntroPhotoCard idx={6} label="Filkom UB Campus" aspect="aspect-[4/3]" theme="from-purple-100 to-fuchsia-50" />
            <IntroPhotoCard idx={7} label="Hobbies & Passion" aspect="aspect-[4/3]" theme="from-yellow-100 to-amber-50" />
            <IntroPhotoCard idx={8} label="Childhood / Family" aspect="aspect-[4/3]" theme="from-rose-100 to-red-50" />
            <IntroPhotoCard idx={9} label="Daily / Candid" aspect="aspect-[4/3]" theme="from-teal-100 to-emerald-50" />
          </div>
        </div>
      )
    },

    // 2: EDUCATION SLIDE
    {
      id: "education",
      title: "Education",
      subtitle: "SCHOLASTIC PATHWAY",
      notes: "Riwayat pendidikan di Universitas Brawijaya.",
      render: () => (
        <div className="h-full w-full flex flex-col justify-between p-6 md:p-10 bg-[#FAFAFA] text-slate-900">
          <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-3">
            <span className="text-3xl font-black text-[#451B69]">| Education</span>
            <span className="font-mono text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full font-bold">
              SLIDE 03
            </span>
          </div>

          <div className="my-auto max-w-xl mx-auto w-full">
            {/* Universitas Brawijaya */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-5 hover:border-purple-300 transition-all border-l-4 border-l-purple-700">
              <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl">
                🎓
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono text-purple-700 uppercase font-bold">2014 / 2019</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">Universitas Brawijaya</h3>
                <p className="text-sm font-bold text-purple-900 font-sans mt-1">Teknik Informatika (Filkom UB)</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // 3: HOBBY - BASKETBALL SLIDE (VIDEO TEMPLATE)
    {
      id: "basketball",
      title: "Hobby: Basketball",
      subtitle: "HIGHLIGHTS & GAME TAPE",
      notes: "Highlight video basket: turnamen Filkom UB & Amartha 3x3 League.",
      render: () => (
        <div className="h-full w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#FAFAFA] text-slate-900 overflow-y-auto">
          <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#451B69]">| Basketball 🏀</span>
              <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold hidden sm:inline">
                VIDEO REEL
              </span>
            </div>
            <span className="font-mono text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full font-bold">
              SLIDE 04
            </span>
          </div>

          <div className="my-auto max-w-3xl mx-auto w-full">
            {/* Video Player Template */}
            <VideoTemplatePlayer
              src="/assets/basketball/video.mp4"
              title="Filkom UB & Amartha 3x3 Tape"
              subtitle="High-energy plays, fast breaks & clutch shots"
            />
          </div>
        </div>
      )
    },

    // 4: HOBBY - VINYL COLLECTION SLIDE (4-PHOTO TEMPLATE)
    {
      id: "vinyl",
      title: "Hobby: Koleksi Vinyl",
      subtitle: "@echoespinrecords",
      notes: "Koleksi piringan hitam, turntable vintage, hunting piringan hitam di Record Store Day.",
      render: () => (
        <div className="h-full w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#FAFAFA] text-slate-900 overflow-y-auto">
          {/* Header Info & Instagram */}
          <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#451B69]">| Koleksi Vinyl 💿</span>
              <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold hidden sm:inline">
                4-PHOTO SHOWCASE
              </span>
            </div>
            <a
              href="https://instagram.com/echoespinrecords"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3 py-1 rounded-full font-bold transition-all shadow-xs"
            >
              <Instagram size={13} />
              <span>@echoespinrecords</span>
            </a>
          </div>

          {/* 4-Photo Vinyl Grid Template */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5 my-auto w-full max-w-6xl mx-auto py-2">
            <VinylPhotoCard
              idx={0}
              theme="from-purple-950 via-slate-900 to-black text-purple-200"
            />
            <VinylPhotoCard
              idx={1}
              theme="from-amber-950 via-slate-900 to-black text-amber-200"
            />
            <VinylPhotoCard
              idx={2}
              theme="from-cyan-950 via-slate-900 to-black text-cyan-200"
            />
            <VinylPhotoCard
              idx={3}
              theme="from-rose-950 via-slate-900 to-black text-rose-200"
            />
          </div>
        </div>
      )
    },

    // 5: FAV! MOVIES SLIDE (POSTER GALLERY)
    {
      id: "movies",
      title: "Fav! — Movies",
      subtitle: "CINEMATIC MASTERPIECES",
      notes: "Koleksi poster film favorit: Forrest Gump, Truman Show, Catch Me If You Can, Ferris Bueller, Fight Club, Scott Pilgrim.",
      render: () => {
        const movieList = vaultConfig?.movies && vaultConfig.movies.length > 0 ? vaultConfig.movies : [
          {
            id: "movie-1",
            title: "Forrest Gump",
            year: "1994",
            genre: "Drama / Comedy",
            poster: "/assets/movies/forrest-gump.png",
            description: "Classic Tom Hanks timeless storytelling"
          },
          {
            id: "movie-2",
            title: "The Truman Show",
            year: "1998",
            genre: "Sci-Fi / Drama",
            poster: "/assets/movies/truman-show.jpg",
            description: "Jim Carrey existential masterpiece"
          },
          {
            id: "movie-3",
            title: "Catch Me If You Can",
            year: "2002",
            genre: "Biography / Crime",
            poster: "/assets/movies/catch-me-if-you-can.jpg",
            description: "DiCaprio & Hanks dynamic chase"
          },
          {
            id: "movie-4",
            title: "Ferris Bueller's Day Off",
            year: "1986",
            genre: "Comedy / Classic",
            poster: "/assets/movies/ferris-bueller.jpg",
            description: "80s free-spirited comedy icon"
          },
          {
            id: "movie-5",
            title: "Fight Club",
            year: "1999",
            genre: "Psychological Thriller",
            poster: "/assets/movies/fight-club.jpg",
            description: "Fincher & Pitt psychological cult film"
          },
          {
            id: "movie-6",
            title: "Scott Pilgrim vs. The World",
            year: "2010",
            genre: "Action / Retro Comedy",
            poster: "/assets/movies/scott-pilgrim.jpg",
            description: "Retro 8-bit comic energy"
          }
        ];

        return (
          <div className="h-full w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#FAFAFA] text-slate-900 overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#451B69]">| Fav! — Movies 🎬</span>
                <span className="text-xs font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold">
                  POSTER GALLERY
                </span>
              </div>
            </div>

            {/* 6 Posters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 my-auto py-1">
              {movieList.map((movie, idx) => (
                <div key={movie.id || idx} className="h-full">
                  <MediaPosterCard media={movie} idx={idx} badgePrefix="CINEMA" icon="film" />
                </div>
              ))}
            </div>
          </div>
        );
      }
    },

    // 6: FAV! SERIES SLIDE (POSTER GALLERY)
    {
      id: "series",
      title: "Fav! — Series",
      subtitle: "BINGE-WORTHY SHOWS",
      notes: "Series favorit: Black Mirror, Stranger Things, The End of the F***ing World.",
      render: () => {
        const seriesList = vaultConfig?.series && vaultConfig.series.length > 0 ? vaultConfig.series : [
          {
            id: "series-1",
            title: "Black Mirror",
            year: "2011",
            genre: "Sci-Fi / Dystopia",
            poster: "/assets/series/black-mirror.jpg",
            description: "Dystopian tech cautionary tales & mindbenders"
          },
          {
            id: "series-2",
            title: "Stranger Things",
            year: "2016",
            genre: "Sci-Fi / Nostalgia",
            poster: "/assets/series/stranger-things.jpg",
            description: "80s synth-wave sci-fi nostalgia & monster mystery"
          },
          {
            id: "series-3",
            title: "The End of the F***ing World",
            year: "2017",
            genre: "Dark Comedy / Drama",
            poster: "/assets/series/the-end-of-the-fing-world.jpg",
            description: "Dark comedy road trip & coming-of-age"
          }
        ];

        return (
          <div className="h-full w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#FAFAFA] text-slate-900 overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#451B69]">| Fav! — Series 📺</span>
                <span className="text-xs font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold">
                  POSTER GALLERY
                </span>
              </div>
            </div>

            {/* 3 Series Posters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 my-auto max-w-4xl lg:max-w-5xl mx-auto w-full py-1">
              {seriesList.map((series, idx) => (
                <div key={series.id || idx} className="h-full flex justify-center">
                  <MediaPosterCard media={series} idx={idx} badgePrefix="SERIES" icon="tv" />
                </div>
              ))}
            </div>
          </div>
        );
      }
    },

    // 7: FAV! MUSICIANS SLIDE (POSTER GALLERY)
    {
      id: "musicians",
      title: "Fav! — Musicians",
      subtitle: "TIMELESS SOUNDSCAPES",
      notes: "Musisi favorit: The Beatles, The Beach Boys, Pink Floyd, The Doors.",
      render: () => {
        const musicianList = vaultConfig?.musicians && vaultConfig.musicians.length > 0 ? vaultConfig.musicians : [
          {
            id: "musician-1",
            title: "The Beatles",
            year: "1960s",
            genre: "Rock & Roll / Psychedelic",
            poster: "/assets/musicians/the-beatles.jpg",
            tagline: "All You Need Is Love.",
            description: "Fab Four songwriting revolution & iconic studio albums"
          },
          {
            id: "musician-2",
            title: "The Beach Boys",
            year: "1960s",
            genre: "Sunshine Pop / Harmony",
            poster: "/assets/musicians/the-beach-boys.jpg",
            tagline: "Good Vibrations & Pet Sounds.",
            description: "Brian Wilson's harmonic genius on Pet Sounds"
          },
          {
            id: "musician-3",
            title: "Pink Floyd",
            year: "1965",
            genre: "Psychedelic / Art Rock",
            poster: "/assets/musicians/pink-floyd.jpg",
            tagline: "Shine On You Crazy Diamond.",
            description: "Early Syd Barrett whimsy & immersive atmospheric rock"
          },
          {
            id: "musician-4",
            title: "The Doors",
            year: "1965",
            genre: "Psychedelic Rock / Blues",
            poster: "/assets/musicians/the-doors.jpg",
            description: "Jim Morrison's poetic lyrics & Ray Manzarek's hypnotic organ riffs"
          }
        ];

        return (
          <div className="h-full w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#FAFAFA] text-slate-900 overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#451B69]">| Fav! — Musicians 🎸</span>
                <span className="text-xs font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold">
                  POSTER GALLERY
                </span>
              </div>
            </div>

            {/* 4 Musician Posters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 my-auto max-w-5xl lg:max-w-6xl mx-auto w-full py-1">
              {musicianList.map((musician, idx) => (
                <div key={musician.id || idx} className="h-full flex justify-center">
                  <MediaPosterCard media={musician} idx={idx} badgePrefix="ARTIST" icon="music" />
                </div>
              ))}
            </div>
          </div>
        );
      }
    },

    // 8: WORKING EXPERIENCE - EARLY CAREER
    {
      id: "early-career",
      title: "Working Experience: Early Career",
      subtitle: "CITRA MEDIA & TUNAIKU",
      notes: "Awal karier di Citra Media Solusindo dan Tunaiku (Bank Amar).",
      render: () => (
        <div className="h-full w-full flex flex-col justify-between p-6 md:p-10 bg-[#FAFAFA] text-slate-900">
          <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-3">
            <span className="text-3xl font-black text-[#451B69]">| Early Career Journey 💼</span>
            <span className="font-mono text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full font-bold">
              SLIDE 09
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto max-w-4xl mx-auto w-full">
            {/* Citra Media */}
            <div
              onClick={() => setSelectedCareer({
                company: "PT. Citra Media Solusindo",
                role: "Software Engineering Intern",
                period: "2018",
                photos: [
                  { src: "/assets/career/citra-media-1.jpg", caption: "Citra Media Solusindo Office & Team" },
                  { src: "/assets/career/citra-media-2.jpg", caption: "Web & Software Projects" }
                ]
              })}
              className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2018</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos</span>
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-2 group-hover:text-[#451B69] transition-colors">PT. Citra Media Solusindo</h3>
              <p className="text-sm font-bold text-purple-900 font-sans mt-1">Software Engineering Intern</p>
            </div>

            {/* Tunaiku */}
            <div
              onClick={() => setSelectedCareer({
                company: "Tunaiku (PT Bank Amar Indonesia)",
                role: "Backend Developer",
                period: "2019",
                photos: [
                  { src: "/assets/career/tunaiku-1.jpg", caption: "Tunaiku Amar Bank Team" },
                  { src: "/assets/career/tunaiku-2.jpg", caption: "Customer Service Improvement Squad" }
                ]
              })}
              className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2019</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos</span>
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-2 group-hover:text-[#451B69] transition-colors">Tunaiku (PT Bank Amar Indonesia)</h3>
              <p className="text-sm font-bold text-purple-900 font-sans mt-1">Backend Developer</p>
            </div>
          </div>
        </div>
      )
    },

    // 10: WORKING EXPERIENCE - AMARTHA JOURNEY
    {
      id: "amartha",
      title: "Working Experience: Amartha",
      subtitle: "BACK OFFICE • WEALTH • PAYMENT PLATFORM",
      notes: "Perjalanan di Amartha dari tim Back Office, Wealth, hingga Senior Backend Payment Platform.",
      render: () => (
        <div className="h-full w-full flex flex-col justify-between p-6 md:p-10 bg-[#FAFAFA] text-slate-900">
          <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-3">
            <span className="text-3xl font-black text-[#451B69]">| Amartha Engineering Timeline 🚀</span>
            <span className="font-mono text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full font-bold">
              SLIDE 10
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto max-w-5xl mx-auto w-full">
            {/* Back Office */}
            <div
              onClick={() => setSelectedCareer({
                company: "Back Office Team (Amartha)",
                role: "Backend Engineer",
                period: "2019 – 2021",
                photos: [
                  { src: "/assets/career/amartha-bo-1.jpg", caption: "Back Office Squad Gathering" },
                  { src: "/assets/career/amartha-bo-2.jpg", caption: "Core Banking & Money-Flow Migration" }
                ]
              })}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2019 – 2021</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos</span>
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-[#451B69] transition-colors">Back Office Team</h3>
              <p className="text-sm font-bold text-purple-900 font-sans mt-1">Backend Engineer</p>
            </div>

            {/* Wealth */}
            <div
              onClick={() => setSelectedCareer({
                company: "Wealth Team (Amartha)",
                role: "Senior Analyst",
                period: "2021 – 2022",
                photos: [
                  { src: "/assets/career/amartha-wealth-1.jpg", caption: "Wealth Team Engineering" },
                  { src: "/assets/career/amartha-wealth-2.jpg", caption: "E-Wallet & Funding Squad" }
                ]
              })}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2021 – 2022</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos</span>
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-[#451B69] transition-colors">Wealth Team</h3>
              <p className="text-sm font-bold text-purple-900 font-sans mt-1">Senior Analyst</p>
            </div>

            {/* Payment Platform */}
            <div
              onClick={() => setSelectedCareer({
                company: "Payment Platform Team (Amartha)",
                role: "Senior Backend Engineer",
                period: "2023 – PRESENT",
                photos: [
                  { src: "/assets/career/amartha-payment-1.jpg", caption: "Payment Platform Squad" },
                  { src: "/assets/career/amartha-payment-2.jpg", caption: "Single API & QRIS Release Celebration" }
                ]
              })}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2023 – PRESENT</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos</span>
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-[#451B69] transition-colors">Payment Platform Team</h3>
              <p className="text-sm font-bold text-purple-900 font-sans mt-1">Senior Backend Engineer</p>
            </div>
          </div>
        </div>
      )
    },

    // 11: THANK YOU CLOSING SLIDE
    {
      id: "closing",
      title: "Thank You!",
      subtitle: "Q&A SESSION",
      notes: "Slide penutup dan sesi tanya jawab.",
      render: () => (
        <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[#0F766E] via-[#0E5D57] to-[#0A3F3B] text-white relative overflow-hidden">
          <div className="p-4 bg-white/10 rounded-full mb-4 border border-white/20">
            <Sparkles size={32} className="text-teal-200" />
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">
            Thank You!
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
            <span className="bg-white/15 px-3 py-1.5 rounded-full border border-white/20">
              📸 @echoespinrecords
            </span>
            <span className="bg-white/15 px-3 py-1.5 rounded-full border border-white/20">
              📧 rafelychandra@gmail.com
            </span>
            <span className="bg-white/15 px-3 py-1.5 rounded-full border border-white/20">
              ⚡ Payment Platform Team
            </span>
          </div>

          <button
            onClick={() => setCurrentSlide(0)}
            className="mt-8 px-4 py-2 bg-teal-300 hover:bg-teal-200 text-teal-950 font-mono text-xs font-black uppercase rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Restart Presentation</span>
          </button>
        </div>
      )
    }
  ];

  const currentSlideObj = SLIDES[currentSlide] || SLIDES[0];

  return (
    <div className="min-h-screen bg-warm-cream text-retro-black flex flex-col justify-between select-none">
      {/* Top Security Banner (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <div className="bg-retro-black text-warm-cream py-2 px-4 md:px-8 border-b-4 border-retro-black flex items-center justify-between font-mono text-[10px] md:text-xs uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="font-extrabold text-amber-300">
              PRIVATE PATH // KYC PRESENTATION TERMINAL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-retro-gray">
              CHANKEEY-KYC-{currentYear}
            </span>
            <button
              onClick={onExit}
              className="flex items-center gap-1 bg-retro-orange text-warm-cream px-2.5 py-0.5 rounded hover:bg-retro-orange-dark cursor-pointer font-bold transition-all"
            >
              <ArrowLeft size={12} />
              <span>Return to Portfolio</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className={`w-full flex-grow flex flex-col justify-center ${isFullscreen ? "p-0 m-0" : "max-w-6xl mx-auto px-3 md:px-8 py-4"
        }`}>
        {!isAuthenticated ? (
          /* =================================================================
             1. LOCKED CLEARANCE GATE
             ================================================================= */
          <div className="flex flex-col items-center justify-center min-h-[65vh]">
            <motion.div
              animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="bg-retro-cream-dark border-4 border-retro-black p-6 md:p-8 rounded-lg shadow-[8px_8px_0px_0px_rgba(30,28,26,1)] max-w-md w-full relative"
            >
              <div className="absolute -top-4 -right-3 bg-purple-900 text-white font-mono text-[9px] font-black uppercase px-2.5 py-1 border-2 border-retro-black rounded rotate-[4deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                KYC ACCESS ONLY
              </div>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="p-3 bg-retro-black text-amber-300 rounded-full border-2 border-retro-black mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Lock size={32} />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-black text-retro-black uppercase tracking-tight">
                  KYC PRESENTATION GATE
                </h2>
                <p className="font-mono text-xs text-retro-gray uppercase tracking-wider mt-1">
                  Enter authorization PIN to unlock Chandra's KYC Slides
                </p>
              </div>

              {/* Code Display Screen */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAuthorize();
                }}
                className="space-y-4"
              >
                <div className="bg-retro-black border-2 border-retro-black p-3 rounded text-center">
                  <div className="text-[9px] font-mono text-retro-gray uppercase tracking-widest mb-1">
                    AUTHORIZATION CODE
                  </div>
                  <input
                    ref={inputRef}
                    type="password"
                    maxLength={12}
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setErrorStatus("");
                    }}
                    placeholder="••••"
                    className="w-full bg-transparent text-center font-mono text-2xl tracking-[0.5em] text-amber-300 font-black focus:outline-none placeholder:text-retro-charcoal"
                  />
                </div>

                {errorStatus && (
                  <div className="bg-red-100 border-2 border-red-500 text-red-700 p-2 rounded text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 animate-pulse">
                    <ShieldAlert size={14} />
                    <span>{errorStatus}</span>
                  </div>
                )}

                {/* Mechanical Numpad */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleKeypadPress(num)}
                      className="py-2.5 bg-warm-cream hover:bg-retro-yellow/60 border-2 border-retro-black rounded font-mono text-base font-black text-retro-black shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-all"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setInputCode("");
                      setErrorStatus("");
                      playRetroTone(350, "square", 0.05);
                    }}
                    className="py-2.5 bg-retro-cream-dark hover:bg-red-200 border-2 border-retro-black rounded font-mono text-[10px] font-bold text-retro-black uppercase shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress("0")}
                    className="py-2.5 bg-warm-cream hover:bg-retro-yellow/60 border-2 border-retro-black rounded font-mono text-base font-black text-retro-black shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 bg-purple-900 hover:bg-purple-950 text-white border-2 border-retro-black rounded font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(30,28,26,1)] cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Unlock size={14} />
                    <span>Open</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <span className="font-mono text-[9px] text-retro-gray uppercase">
                    Default Terminal PIN: <span className="font-black text-retro-black underline">1411</span>
                  </span>
                </div>
              </form>
            </motion.div>
          </div>
        ) : (
          /* =================================================================
             2. UNLOCKED STATE: NATIVE WEB PPT PRESENTATION
             ================================================================= */
          <div className={`space-y-3 flex flex-col justify-center ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950 p-2 sm:p-4 w-screen h-screen" : ""
            }`}>
            {/* Top Deck Control Header (Hidden in Fullscreen) */}
            {!isFullscreen && (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-retro-cream-dark border-4 border-retro-black p-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(30,28,26,1)]">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-900 text-white font-mono text-xs font-black px-3 py-1 rounded-md">
                    SLIDE {currentSlide + 1} / {SLIDES.length}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 uppercase">
                      {currentSlideObj.title}
                    </h3>
                    <span className="text-[10px] font-mono text-purple-800 font-bold">
                      {currentSlideObj.subtitle}
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="px-3 py-1 bg-purple-900 hover:bg-purple-950 text-white border-2 border-retro-black rounded font-mono text-xs font-bold uppercase cursor-pointer flex items-center gap-1 shadow-sm"
                    title="Toggle Fullscreen (F)"
                  >
                    <Maximize size={12} />
                    <span>Fullscreen</span>
                  </button>

                  <button
                    onClick={handleLockout}
                    className="px-2.5 py-1 bg-red-100 hover:bg-red-200 border-2 border-red-800 text-red-900 rounded font-mono text-xs font-bold uppercase cursor-pointer flex items-center gap-1"
                  >
                    <Lock size={12} />
                    <span>Lock</span>
                  </button>
                </div>
              </div>
            )}

            {/* THE SLIDE STAGE (Aspect 16:9) */}
            <div className={`relative mx-auto w-full bg-white border-4 border-retro-black overflow-hidden flex flex-col transition-all duration-300 ${isFullscreen
              ? "h-full max-h-screen max-w-[177.78vh] aspect-[16/9] rounded-2xl shadow-2xl my-auto"
              : "aspect-[16/9] min-h-[460px] rounded-xl shadow-[8px_8px_0px_0px_rgba(30,28,26,1)]"
              }`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex-grow flex flex-col"
                >
                  {currentSlideObj.render()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="absolute left-3 bottom-4 p-2.5 bg-black/70 hover:bg-purple-900 text-white rounded-full disabled:opacity-0 cursor-pointer transition-all shadow-lg"
                title="Previous Slide (Left Arrow)"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={nextSlide}
                disabled={currentSlide === SLIDES.length - 1}
                className="absolute right-3 bottom-4 p-2.5 bg-black/70 hover:bg-purple-900 text-white rounded-full disabled:opacity-0 cursor-pointer transition-all shadow-lg"
                title="Next Slide (Right Arrow / Space)"
              >
                <ChevronRight size={22} />
              </button>

              {/* Fullscreen Floating Controls HUD */}
              {isFullscreen && (
                <div className="absolute top-3 right-3 flex items-center gap-2 z-30 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="bg-black/80 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    SLIDE {currentSlide + 1} / {SLIDES.length}
                  </div>
                  <button
                    onClick={exitFullscreenMode}
                    className="p-1.5 bg-black/80 hover:bg-red-700 text-white rounded-full border border-white/20 cursor-pointer"
                    title="Exit Fullscreen (Esc / F)"
                  >
                    <Minimize size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Slide Quick Navigation Strip (Normal Mode) */}
            {!isFullscreen && (
              <div className="flex gap-2 overflow-x-auto p-2 bg-retro-cream-dark border-2 border-retro-black rounded-lg select-none">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSlide(idx);
                      playRetroTone(400 + idx * 30, "sine", 0.04);
                    }}
                    className={`px-3 py-1.5 rounded font-mono text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${currentSlide === idx
                      ? "bg-purple-900 text-white shadow-xs scale-105"
                      : "bg-warm-cream text-slate-700 hover:bg-white border border-slate-300"
                      }`}
                  >
                    {idx + 1}. {s.title.split("—")[0].split(":")[0]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Extreme Bottom Bar (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <div className="border-t-2 border-retro-black bg-retro-charcoal text-warm-cream py-2 px-4 text-center font-mono text-[8px] uppercase tracking-widest">
          KYC PRESENTATION DECK • BUILT FOR WEB RUNTIME • CHANKEEY {currentYear}
        </div>
      )}

      {/* Career Photos Modal Popup */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCareer(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAFAFA] text-slate-900 border-4 border-retro-black rounded-3xl max-w-5xl lg:max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b-2 border-slate-200 bg-white">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs bg-purple-100 text-purple-900 font-bold px-2.5 py-0.5 rounded-md">
                      {selectedCareer.period}
                    </span>
                    <span className="font-mono text-xs text-purple-700 font-bold uppercase tracking-wide">
                      {selectedCareer.role}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#451B69] mt-1">
                    {selectedCareer.company}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedCareer(null)}
                  className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={26} />
                </button>
              </div>

              {/* Photos Gallery Grid */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-grow bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedCareer.photos.map((photo, idx) => (
                    <CareerGalleryPhoto key={idx} photo={photo} idx={idx} />
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 sm:px-8 py-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="font-bold text-purple-900 flex items-center gap-1.5 text-sm">
                  <Camera size={16} />
                  <span>{selectedCareer.photos.length} Photo{selectedCareer.photos.length > 1 ? "s" : ""}</span>
                </span>
                <span className="text-slate-400">Press ESC or click outside to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
