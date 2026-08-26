# 🗞️ Rafely Chandra Rizkilillah — Personal Portfolio

A personal portfolio website with a vintage 1960s mid-century modern newspaper / broadsheet and retro-futuristic aesthetic, built with React 19, TypeScript, Tailwind CSS v4, and Vite.

Hosted on [GitHub Pages](https://rafelychandra.github.io).

---

## ✨ Features

- **📰 Mid-Century Editorial & Broadsheet Layout**: Styled like a classic 1960s printing press newspaper (*The Fintech Courier*) complete with custom mastheads, drop caps, and classified coupon ad sections.
- **🎛️ Interactive Vibe & Filter Controls**: Toggle 1960s sepia ink tone and adjust live paper texture noise grain density.
- **📻 Web Audio Synthesizer & Turntable**:
  - Browser-native Web Audio synthesizer emulating vintage chord progressions and realistic vinyl surface crackle.
  - Interactive pitch/speed slider and turntable controls.
  - Drag-and-drop local audio/MP3 support and custom track creator.
- **🎧 Spotify Receiver Station**:
  - Embedded player with switchable vintage channels (50s, 60s, 70s).
- **📋 100% Data-Driven**:
  - Easily update profile information, career history, education, skills, and audio tracks through `src/data.json`.
- **⚡ Fast & Client-Side**: No backend required, perfectly optimized for static hosting on GitHub Pages or Cloudflare Pages.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rafelychandra/rafelychandra.github.io.git
   cd rafelychandra.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:1411`.

---

## 📦 Scripts

- `npm run dev`: Starts the local Vite development server with HMR.
- `npm run build`: Compiles TypeScript and bundles the static site into `dist/`.
- `npm run preview`: Previews the built production site locally.
- `npm run lint`: Checks TypeScript types without emitting files.

---

## ✏️ Customization

All personal details, timeline events, skills, and playlist items are managed in a single structured file:

- **`src/data.json`**
  - `profile`: Name, role, subtitle, contact details, social links, biography paragraphs.
  - `experiences`: Work history ledger with companies, roles, period, achievements, and tech stack tags.
  - `educations`: Degrees, institutions, milestones, and certifications.
  - `skills`: Grouped classified coupon advertising items.
  - `aestheticSettings`: Site headline, masthead title, default vinyl chords, and playlists.

---

## 📄 License

Created by **Rafely Chandra Rizkilillah**. Released under the [Apache-2.0 License](LICENSE).
