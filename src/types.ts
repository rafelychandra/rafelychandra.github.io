/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  name: string;
  role: string;
  subtitle: string;
  establishmentYear: string;
  location: string;
  retroNarrative: string[];
  avatarPlaceholderSeed: string;
  picture?: string;
  socials: {
    platform: string;
    url: string;
  }[];
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  tags: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  period: string;
  achievements: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  items: {
    name: string;
    proficiency: number; // 1 to 5 stars or percentage
    description?: string;
  }[];
}

export interface VinylMelody {
  title: string;
  genre: string;
  bpm: number;
  chords?: number[][]; // Optional custom frequencies list for chord synths
}

export interface ConfidentialDossier {
  title: string;
  classification: string;
  date: string;
  summary: string;
  details: string[];
  tags: string[];
}

export interface MediaPosterItem {
  id: string;
  title: string;
  year?: string;
  genre: string;
  poster: string;
  tagline?: string;
  description?: string;
}

export type MovieItem = MediaPosterItem;

export interface VaultConfig {
  defaultPasscode?: string;
  terminalName?: string;
  dossiers?: ConfidentialDossier[];
  movies?: MediaPosterItem[];
  series?: MediaPosterItem[];
  musicians?: MediaPosterItem[];
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  src: string;
  cover?: string;
  duration?: string;
}

export interface PortfolioData {
  profile: Profile;
  experiences: Experience[];
  educations: Education[];
  skills: SkillCategory[];
  vault?: VaultConfig;
  aestheticSettings: {
    siteTitle: string;
    newspaperName: string;
    todaysDateOverride?: string;
    quoteOfTheDay: string;
    vinylMelody?: VinylMelody;
    vinylPlaylist?: VinylMelody[];
    audioTracks?: AudioTrack[];
  };
}
