/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Radio, ExternalLink, Compass, Disc, Library } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SpotifyPlaylist {
  id: string;
  title: string;
  vibe: string;
  originalUrl: string;
  embedUrl: string;
  color: string;
}

export default function SpotifyPlaylists() {
  const playlists: SpotifyPlaylist[] = [
    {
      id: "0rfmmUf1yjpRJOi8lDruE7",
      title: "50's Playlist",
      vibe: "Nostalgic mid-century tunes, early rock & roll, and golden age jazz.",
      originalUrl: "https://open.spotify.com/playlist/0rfmmUf1yjpRJOi8lDruE7?si=23522213def14a0b",
      embedUrl: "https://open.spotify.com/embed/playlist/0rfmmUf1yjpRJOi8lDruE7",
      color: "border-retro-blue text-retro-blue",
    },
    {
      id: "751nq8KRZpLOqhd5KVmkYZ",
      title: "60's Playlist",
      vibe: "Groovy psychedelic rock, soul, pop classics, and peace vibes.",
      originalUrl: "https://open.spotify.com/playlist/751nq8KRZpLOqhd5KVmkYZ?si=37c5d70f27ce45c4",
      embedUrl: "https://open.spotify.com/embed/playlist/751nq8KRZpLOqhd5KVmkYZ",
      color: "border-retro-orange text-retro-orange",
    },
    {
      id: "1Ggqnstuclnrf8zejnDaf1",
      title: "70's Playlist",
      vibe: "Classic folk storytelling, early metal, funk, and vintage synth loops.",
      originalUrl: "https://open.spotify.com/playlist/1Ggqnstuclnrf8zejnDaf1?si=46e9bbaf9df947da",
      embedUrl: "https://open.spotify.com/embed/playlist/1Ggqnstuclnrf8zejnDaf1",
      color: "border-retro-yellow text-retro-yellow",
    },
  ];

  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const activePlaylist = playlists[activePlaylistIndex];

  return (
    <div className="bg-retro-cream-dark border-4 border-retro-black p-4 md:p-6 rounded-lg shadow-[6px_6px_0px_0px_rgba(30,28,26,1)] flex flex-col h-full relative overflow-hidden transition-all duration-300">
      {/* Editorial metadata tag */}
      <span className="absolute top-1.5 right-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-retro-gray select-none">
        SATELLITE SHORTWAVE SIGNAL
      </span>

      {/* Header */}
      <div className="flex border-b-2 border-retro-black pb-3 mb-4 items-center text-xs font-mono font-bold uppercase select-none w-full">
        <div className="flex items-center gap-1.5 text-retro-black font-extrabold">
          <Radio size={14} className="text-retro-orange shrink-0 animate-pulse" />
          <span>SPOTIFY RECEIVER STATION</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        {/* CASSETTE CARDS SELECTOR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {playlists.map((playlist, idx) => {
            const isActive = activePlaylistIndex === idx;
            const channelNames = ["ALPHA", "BETA", "GAMMA"];
            return (
              <button
                key={playlist.id}
                onClick={() => setActivePlaylistIndex(idx)}
                className={`text-left p-3 border-2 rounded transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                  isActive
                    ? "bg-warm-cream border-retro-orange shadow-[3px_3px_0px_0px_rgba(230,92,40,1)] translate-x-[1px] translate-y-[1px]"
                    : "bg-retro-cream/40 border-retro-black hover:border-retro-orange hover:bg-warm-cream/50 shadow-[3px_3px_0px_0px_rgba(30,28,26,1)]"
                }`}
              >
                {/* Cassette notch embellishment */}
                <div className="absolute top-0 right-2 w-4 h-1 bg-retro-black/20 rounded-b"></div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Disc
                      size={12}
                      className={`${
                        isActive ? "text-retro-orange animate-spin" : "text-retro-gray"
                      }`}
                      style={{ animationDuration: "5s" }}
                    />
                    <span className="font-mono text-[8px] text-retro-orange uppercase font-black">
                      CHANNEL {channelNames[idx] || "SIGMA"}
                    </span>
                  </div>

                  <h4 className="font-serif font-black text-retro-black text-sm uppercase leading-tight mt-1 truncate">
                    {playlist.title}
                  </h4>
                  <p className="font-sans text-[10px] text-retro-charcoal mt-1 line-clamp-2">
                    {playlist.vibe}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-retro-gray/30 pt-2 mt-2 w-full">
                  <span className="font-mono text-[8px] text-retro-gray uppercase tracking-widest font-black">
                    {isActive ? "⚡ LIVE" : "● TUNE"}
                  </span>
                  <a
                    href={playlist.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Stop switching playlist when clicking external link
                    className="text-retro-gray hover:text-retro-orange transition-colors flex items-center gap-1"
                    title="Open on Spotify"
                  >
                    <span className="text-[8px] font-mono tracking-tighter uppercase">OPEN</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE EMBED PLAYER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlaylist.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col justify-end"
          >
            <div className="border-4 border-retro-black shadow-[4px_4px_0px_0px_rgba(30,28,26,1)] rounded overflow-hidden bg-retro-black hover:shadow-[5px_5px_0px_0px_rgba(30,28,26,1)] transition-all flex flex-col">
              <iframe
                src={activePlaylist.embedUrl}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={activePlaylist.title}
                className="bg-retro-black block w-full"
                style={{ height: "352px" }}
              ></iframe>
            </div>
            
            <div className="flex items-center gap-1.5 justify-center font-mono text-[9px] text-retro-gray mt-2.5">
              <Compass size={11} className="text-retro-orange animate-pulse" />
              <span>TRANSMITTING DUAL CORRELATION FEED</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
