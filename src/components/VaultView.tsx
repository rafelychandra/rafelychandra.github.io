/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, createContext, useContext } from "react";
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
  Camera,
  ZoomIn
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

export interface LightboxData {
  src: string;
  title?: string;
}

const LightboxContext = createContext<{
  openLightbox: (src: string, title?: string) => void;
}>({
  openLightbox: () => {}
});

export const useLightbox = () => useContext(LightboxContext);

interface MediaPosterCardProps {
  media: MediaPosterItem;
  idx: number;
  badgePrefix?: string;
  icon?: "film" | "tv" | "music";
}

function MediaPosterCard({ media, idx, badgePrefix = "ITEM", icon = "film" }: MediaPosterCardProps) {
  const { openLightbox } = useLightbox();
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
    <div
      onClick={() => !imgFailed && openLightbox(currentSrc, media.title)}
      className={`group relative aspect-[2/3] max-h-[58vh] w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-slate-300 hover:border-purple-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-slate-900 text-white ${
        !imgFailed ? "cursor-zoom-in" : ""
      }`}
      title={!imgFailed ? "Click to view full size" : undefined}
    >
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
  const { openLightbox } = useLightbox();
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
      onClick={() => !hasError && openLightbox(currentSrc, label)}
      className={`group relative rounded-xl overflow-hidden shadow-xs border border-slate-300 hover:border-purple-600 hover:shadow-md transition-all duration-300 flex flex-col justify-between bg-slate-900 text-white ${
        aspect || "aspect-[4/3]"
      } ${span || ""} ${!hasError ? "cursor-zoom-in" : ""}`}
      title={!hasError ? "Click to view full size" : undefined}
    >
      {!hasError ? (
        <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={currentSrc}
            alt={label}
            onError={handleError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 pointer-events-none">
            <span className="font-mono text-[8px] text-white font-bold leading-tight">{label}</span>
          </div>
        </div>
      ) : (
        <div className={`w-full h-full p-2 flex flex-col justify-between bg-gradient-to-br ${defaultTheme} text-slate-800 relative`}>
          <div className="flex items-center justify-between opacity-60 font-mono text-[6.5px] uppercase">
            <span>#{idx + 1}</span>
            <Camera size={10} className="text-purple-700" />
          </div>

          <div className="my-auto py-1 text-center">
            <span className="font-mono text-[8.5px] font-bold text-slate-900 uppercase block leading-tight">
              {label}
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
  const { openLightbox } = useLightbox();
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
    <div
      onClick={() => !hasError && openLightbox(currentSrc, `Koleksi Vinyl #${idx + 1}`)}
      className={`group relative aspect-[4/3] sm:aspect-[5/6] rounded-2xl overflow-hidden shadow-md border-2 border-slate-300 hover:border-amber-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-slate-950 text-white ${
        !hasError ? "cursor-zoom-in" : ""
      }`}
      title={!hasError ? "Click to view full size" : undefined}
    >
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

interface CareerGalleryPhotoProps {
  photo: CareerPhoto;
  idx: number;
  key?: React.Key;
}

function CareerGalleryPhoto({ photo, idx }: CareerGalleryPhotoProps) {
  const { openLightbox } = useLightbox();
  const [extIdx, setExtIdx] = useState(0);
  const exts = [".jpg", ".png", ".jpeg", ".webp", ".JPG", ".PNG", ".JPEG"];
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
    <div
      onClick={() => !imgFailed && openLightbox(currentSrc, photo.caption || `Career Photo #${idx + 1}`)}
      className={`relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 hover:border-purple-500 flex flex-col justify-end group shadow-lg transition-all ${
        !imgFailed ? "cursor-zoom-in" : ""
      }`}
      title={!imgFailed ? "Click to view full size" : undefined}
    >
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

interface BasketballPhotoCardProps {
  idx: number;
  key?: React.Key;
}

function BasketballPhotoCard({ idx }: BasketballPhotoCardProps) {
  const { openLightbox } = useLightbox();
  const [extIdx, setExtIdx] = useState(0);
  const exts = [".jpg", ".png", ".jpeg", ".webp"];
  const [hasError, setHasError] = useState(false);

  const currentSrc = `/assets/basketball/basketball-${idx + 1}${exts[extIdx]}`;

  const handleError = () => {
    if (extIdx < exts.length - 1) {
      setExtIdx((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      onClick={() => !hasError && openLightbox(currentSrc, `Basketball Moment #${idx + 1}`)}
      className={`group relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border-2 border-slate-300 hover:border-amber-500 hover:shadow-lg transition-all duration-300 bg-slate-950 text-white ${
        !hasError ? "cursor-zoom-in" : ""
      }`}
      title={!hasError ? "Click to view full size" : undefined}
    >
      {!hasError ? (
        <img
          src={currentSrc}
          alt={`Basketball moment ${idx + 1}`}
          onError={handleError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full p-2 flex flex-col justify-center items-center bg-gradient-to-br from-amber-950 via-slate-900 to-black text-amber-200 text-xs font-mono">
          <span className="text-xl mb-1">🏀</span>
          <span>PHOTO {idx + 1}</span>
        </div>
      )}
    </div>
  );
}

interface AmarthaHighlightCardProps {
  idx: number;
  key?: React.Key;
}

function AmarthaHighlightCard({ idx }: AmarthaHighlightCardProps) {
  const { openLightbox } = useLightbox();
  const [extIdx, setExtIdx] = useState(0);
  const exts = [".jpg", ".png", ".jpeg", ".webp"];
  const [hasError, setHasError] = useState(false);

  const currentSrc = `/assets/career/amartha/highlights/amartha-moment-${idx + 1}${exts[extIdx]}`;

  const handleError = () => {
    if (extIdx < exts.length - 1) {
      setExtIdx((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      onClick={() => !hasError && openLightbox(currentSrc, `Amartha Moment #${idx + 1}`)}
      className={`group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border-2 border-slate-300 hover:border-purple-600 hover:shadow-lg transition-all duration-300 bg-slate-950 text-white ${
        !hasError ? "cursor-zoom-in" : ""
      }`}
      title={!hasError ? "Click to view full size" : undefined}
    >
      {!hasError ? (
        <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
          <img
            src={currentSrc}
            alt={`Amartha moment ${idx + 1}`}
            onError={handleError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 pointer-events-none">
            <span className="font-mono text-[9px] text-amber-300 font-bold uppercase tracking-wider">
              MOMENT #{idx + 1}
            </span>
            <span className="text-white/90 font-mono text-[9px] bg-black/60 px-2 py-0.5 rounded flex items-center gap-1">
              <ZoomIn size={11} /> View
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-3 flex flex-col justify-center items-center bg-gradient-to-br from-purple-950 via-slate-900 to-black text-purple-200 text-xs font-mono">
          <span className="text-xl mb-1">📸</span>
          <span>AMARTHA #{idx + 1}</span>
        </div>
      )}

      {/* Index Number Badge */}
      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded z-10">
        #{idx + 1}
      </div>
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
  poster,
  title = "Basketball Highlights & Tape",
  subtitle = "Filkom UB • Amartha 3x3 • Sparring Highlights"
}: VideoTemplatePlayerProps) {
  const isYoutube = src.includes("youtube.com") || src.includes("youtu.be");
  
  const getEmbedUrl = (url: string) => {
    if (url.includes("embed/")) return url;
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

  return (
    <div className="relative w-full aspect-[16/9] max-h-[55vh] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 flex flex-col justify-between">
      {isYoutube ? (
        <iframe
          src={getEmbedUrl(src)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full rounded-2xl border-0"
        />
      ) : (
        <video
          src={src}
          poster={poster}
          playsInline
          controls
          className="w-full h-full object-cover rounded-2xl"
        />
      )}
    </div>
  );
}

function BasketballSlideContent() {
  const [viewMode, setViewMode] = useState<"photos" | "video">("video");
  const [videoUrl, setVideoUrl] = useState<string>("/assets/basketball/video.mp4");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>("");

  return (
    <div className="h-full w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#FAFAFA] text-slate-900 overflow-y-auto">
      <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-2 mb-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl font-black text-[#451B69]">| Basketball 🏀</span>
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-200 p-0.5 rounded-lg font-mono text-[10px] font-bold">
            <button
              onClick={() => setViewMode("photos")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "photos" ? "bg-purple-900 text-white shadow-xs font-black" : "text-slate-700 hover:text-black"
              }`}
            >
              📸 Photos (8)
            </button>
            <button
              onClick={() => setViewMode("video")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "video" ? "bg-amber-500 text-slate-950 shadow-xs font-black" : "text-slate-700 hover:text-black"
              }`}
            >
              🎥 Video Reel
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "video" && (
            <button
              onClick={() => setShowInput(!showInput)}
              className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              {showInput ? "Tutup Link" : "🔗 Ubah Link Video"}
            </button>
          )}
          <span className="font-mono text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full font-bold">
            SLIDE 04
          </span>
        </div>
      </div>

      {showInput && viewMode === "video" && (
        <div className="mb-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 max-w-3xl mx-auto w-full">
          <input
            type="text"
            placeholder="Paste link YouTube (contoh: https://www.youtube.com/watch?v=...) atau link MP4..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono outline-none focus:border-purple-600 text-slate-900"
          />
          <button
            onClick={() => {
              if (inputVal.trim()) {
                setVideoUrl(inputVal.trim());
                setShowInput(false);
              }
            }}
            className="bg-purple-900 text-white font-mono text-xs font-bold px-3.5 py-1.5 rounded-lg hover:bg-purple-800 transition-colors cursor-pointer"
          >
            Terapkan
          </button>
        </div>
      )}

      {viewMode === "photos" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto max-w-5xl mx-auto w-full py-1">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
            <BasketballPhotoCard key={idx} idx={idx} />
          ))}
        </div>
      ) : (
        <div className="my-auto max-w-3xl mx-auto w-full py-1 flex flex-col items-center">
          <VideoTemplatePlayer
            src={videoUrl}
            title="Filkom UB & Amartha 3x3 Tape"
            subtitle="High-energy plays, fast breaks & clutch shots"
          />
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
  const [lightboxImage, setLightboxImage] = useState<LightboxData | null>(null);
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
        if (lightboxImage) {
          e.preventDefault();
          setLightboxImage(null);
          return;
        }
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

      if (selectedCareer || lightboxImage) return; // Don't navigate slides if gallery/lightbox popup is open

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
  }, [isAuthenticated, isFullscreen, selectedCareer, lightboxImage]);

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

    // 1: INTRODUCTION / IDENTITY SLIDE
    {
      id: "intro",
      title: "Introduction",
      subtitle: "WHO IS CHANKEEY?",
      notes: "Nama lengkap, nama panggilan, tanggal lahir, zodiak, MBTI, dan profil Chandra.",
      render: () => (
        <div className="h-full w-full flex flex-col justify-between p-6 md:p-10 bg-[#FAFAFA] text-slate-900 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-3 mb-2">
            <span className="text-3xl font-black text-[#451B69]">| Introduction</span>
            <span className="font-mono text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full font-bold">
              SLIDE 02
            </span>
          </div>

          {/* Main Profile Showcase */}
          <div className="my-auto max-w-5xl lg:max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 py-3">
            {/* Profile Photo (image8.png) */}
            <div
              onClick={() => setLightboxImage({ src: "/assets/intro/image8.png", title: "Rafely Chandra Rizkilillah (Chandra)" })}
              className="shrink-0 w-64 sm:w-80 md:w-96 lg:w-[420px] max-h-[58vh] aspect-square rounded-3xl overflow-hidden border-4 border-retro-black shadow-2xl bg-slate-950 relative group cursor-zoom-in"
              title="Click to view full size"
            >
              <img
                src="/assets/intro/image8.png"
                alt="Rafely Chandra Rizkilillah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
                <span className="font-mono text-xs text-amber-300 font-bold uppercase tracking-wider">
                  CHANKEEY • 1996
                </span>
                <span className="text-white/90 font-mono text-[10px] bg-black/60 px-2 py-0.5 rounded flex items-center gap-1">
                  <ZoomIn size={12} /> Full Size
                </span>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 flex flex-col justify-center gap-4 w-full max-w-xl">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-purple-700">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="bg-[#451B69] text-white font-mono font-black text-xs px-3 py-1 rounded-md tracking-wider">
                    CHANKEEY
                  </span>
                  <span className="font-mono text-xs text-purple-700 font-bold">
                    (Chandra)
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Rafely Chandra Rizkilillah
                </h2>
                <p className="text-sm sm:text-base font-bold text-purple-900 mt-1.5">
                  Senior Backend Engineer • Payment Platform
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xl shrink-0">
                    🎂
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">DATE OF BIRTH</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-800">14 Nov 1996 (Scorpio ♏)</span>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl shrink-0">
                    🧠
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">MBTI PERSONALITY</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-800">ESTP (Entrepreneur)</span>
                  </div>
                </div>
              </div>
            </div>
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

    // 3: HOBBY - BASKETBALL SLIDE (PHOTOS & VIDEO REEL)
    {
      id: "basketball",
      title: "Hobby: Basketball",
      subtitle: "HIGHLIGHTS & GAME TAPE",
      notes: "Highlight foto & video basket: turnamen Filkom UB & Amartha 3x3 League.",
      render: () => <BasketballSlideContent />
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
                  { src: "/assets/career/citra-media/citra-media-1.png" },
                  { src: "/assets/career/citra-media/citra-media-2.png" }
                ]
              })}
              className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2018</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos (2)</span>
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
                  { src: "/assets/career/tunaiku/tunaiku-1.jpg" },
                  { src: "/assets/career/tunaiku/tunaiku-2.jpg" },
                  { src: "/assets/career/tunaiku/tunaiku-3.jpg" },
                  { src: "/assets/career/tunaiku/tunaiku-4.jpg" }
                ]
              })}
              className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2019</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos (4)</span>
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
                  { src: "/assets/career/amartha/backoffice/amartha-bo-1.jpg" },
                  { src: "/assets/career/amartha/backoffice/amartha-bo-2.jpg" },
                  { src: "/assets/career/amartha/backoffice/amartha-bo-3.jpg" },
                  { src: "/assets/career/amartha/backoffice/amartha-bo-4.jpg" },
                  { src: "/assets/career/amartha/backoffice/amartha-bo-5.png" },
                  { src: "/assets/career/amartha/backoffice/amartha-bo-6.jpg" },
                  { src: "/assets/career/amartha/backoffice/amartha-bo-7.jpg" }
                ]
              })}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2019 – 2021</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos (7)</span>
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
                  { src: "/assets/career/amartha/wealth/amartha-wealth-1.jpg" },
                  { src: "/assets/career/amartha/wealth/amartha-wealth-2.jpg" },
                  { src: "/assets/career/amartha/wealth/amartha-wealth-3.jpg" },
                  { src: "/assets/career/amartha/wealth/amartha-wealth-4.png" },
                  { src: "/assets/career/amartha/wealth/amartha-wealth-5.jpg" },
                  { src: "/assets/career/amartha/wealth/amartha-wealth-6.jpg" }
                ]
              })}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2021 – 2022</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos (6)</span>
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
                  { src: "/assets/career/amartha/payment/amartha-payment-1.jpg" },
                  { src: "/assets/career/amartha/payment/amartha-payment-2.jpg" },
                  { src: "/assets/career/amartha/payment/amartha-payment-3.png" },
                  { src: "/assets/career/amartha/payment/amartha-payment-4.jpg" },
                  { src: "/assets/career/amartha/payment/amartha-payment-5.jpg" },
                  { src: "/assets/career/amartha/payment/amartha-payment-6.jpg" }
                ]
              })}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2023 – PRESENT</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos (6)</span>
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-[#451B69] transition-colors">Payment Platform Team</h3>
              <p className="text-sm font-bold text-purple-900 font-sans mt-1">Senior Backend Engineer</p>
            </div>
          </div>
        </div>
      )
    },

    // 10: WORKING EXPERIENCE - AMARTHA MOMENTS
    {
      id: "amartha-highlights",
      title: "Working Experience: Amartha",
      subtitle: "AMARTHA MOMENTS",
      notes: "Koleksi foto momen kebersamaan dan event selama berkarya di Amartha.",
      render: () => (
        <div className="h-full w-full flex flex-col justify-between p-6 md:p-10 bg-[#FAFAFA] text-slate-900">
          <div className="flex items-center justify-between border-b-2 border-purple-900/10 pb-3">
            <span className="text-3xl font-black text-[#451B69]">| Working Experience: Amartha 📸</span>
            <span className="font-mono text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full font-bold">
              SLIDE 11
            </span>
          </div>

          <div className="my-auto max-w-2xl mx-auto w-full">
            <div
              onClick={() => setSelectedCareer({
                company: "Amartha Moments",
                role: "Life, Squad Events & Memories",
                period: "2019 – PRESENT",
                photos: [
                  { src: "/assets/career/amartha/highlights/amartha-moment-1.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-2.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-3.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-4.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-5.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-6.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-7.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-8.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-9.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-10.JPG" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-11.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-12.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-13.jpg" },
                  { src: "/assets/career/amartha/highlights/amartha-moment-14.png" }
                ]
              })}
              className="group bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all border-l-4 border-l-purple-700 flex flex-col justify-center cursor-pointer relative"
              title="Click to view photos"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 uppercase">2019 – PRESENT</span>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 group-hover:bg-purple-900 group-hover:text-white px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1">
                  <Camera size={11} />
                  <span>Photos (14)</span>
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 group-hover:text-[#451B69] transition-colors">
                Amartha Moments
              </h3>
              <p className="text-sm font-bold text-purple-900 font-sans mt-1">
                Life, Squad Events & Memories
              </p>
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
    <LightboxContext.Provider value={{ openLightbox: (src, title) => setLightboxImage({ src, title }) }}>
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

      {/* Global Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md z-10 cursor-pointer shadow-lg"
              title="Close (Esc)"
            >
              <X size={28} />
            </button>

            {/* Lightbox Image Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center cursor-default"
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title || "Full size preview"}
                className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl border-2 border-white/20"
              />
              {lightboxImage.title && (
                <div className="mt-3 px-5 py-1.5 bg-black/75 backdrop-blur-md rounded-full border border-white/20 text-white font-mono text-xs font-bold tracking-wide">
                  {lightboxImage.title}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </LightboxContext.Provider>
  );
}
