/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { PortfolioData } from "./types";
import rawPortfolioData from "./data.json";

// Component imports
import Navbar from "./components/Navbar";
import AudioPlayer from "./components/AudioPlayer";
import SpotifyPlaylists from "./components/SpotifyPlaylists";
import HeroSection from "./components/HeroSection";
import ExperienceTimeline from "./components/ExperienceTimeline";
import EducationCard from "./components/EducationCard";
import SkillsGrid from "./components/SkillsGrid";
import Footer from "./components/Footer";

// Cast JSON to strictly typed PortfolioData interface
const data = rawPortfolioData as unknown as PortfolioData;

export default function App() {
  const [vintageMode, setVintageMode] = useState<boolean>(true);
  const [grainIntensity, setGrainIntensity] = useState<number>(4);

  // Dynamic inline grain generation using high-quality fractal SVG
  const grainOverlayStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    opacity: grainIntensity * 0.015,
  };

  // Immersive 1960s Sepia Printing Press visual effect
  const filterStyle = vintageMode
    ? {
        filter: "sepia(0.35) contrast(1.05) brightness(0.98) hue-rotate(-5deg)",
      }
    : {};

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col transition-all duration-300 bg-warm-cream text-retro-black"
      style={filterStyle}
    >
      {/* 1. Grain overlay paper layer */}
      <div
        className="absolute inset-0 pointer-events-none z-50 select-none bg-repeat"
        style={grainOverlayStyle}
      ></div>

      {/* 2. Top-level Editorial navigation */}
      <Navbar
        profile={data.profile}
        siteTitle={data.aestheticSettings.siteTitle}
        vintageMode={vintageMode}
        setVintageMode={setVintageMode}
        grainIntensity={grainIntensity}
        setGrainIntensity={setGrainIntensity}
      />

      {/* Main Body */}
      <main className="flex-grow">
        {/* 3. Hero Editorial section (Front Page of Newspaper) */}
        <HeroSection
          profile={data.profile}
          newspaperName={data.aestheticSettings.newspaperName}
          todaysDateOverride={data.aestheticSettings.todaysDateOverride}
          quoteOfTheDay={data.aestheticSettings.quoteOfTheDay}
        />

        {/* Live Broadcast / Audio Turntable & Spotify Section */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-12 space-y-8">
          <AudioPlayer
            melodyConfig={data.aestheticSettings.vinylMelody}
            playlist={data.aestheticSettings.vinylPlaylist}
            vintageMode={vintageMode}
          />
          <SpotifyPlaylists />
        </section>

        {/* 4. Experience History ledger */}
        <div className="border-t-4 border-retro-black my-4"></div>
        <ExperienceTimeline experiences={data.experiences} />

        {/* 5. Education grid details */}
        <div className="border-t-4 border-retro-black my-4"></div>
        <EducationCard educations={data.educations} />

        {/* 6. Classified skill ads clipping coupon */}
        <div className="border-t-4 border-retro-black my-4"></div>
        <SkillsGrid skills={data.skills} />
      </main>

      {/* 7. Footer credits */}
      <Footer
        name={data.profile.name}
        year={data.profile.establishmentYear}
        location={data.profile.location}
        email={data.profile.contact.email}
      />
    </div>
  );
}
