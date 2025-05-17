# 📘 FlashForge

**FlashForge** is a modern, minimalist spaced repetition flashcard app designed to make long-term retention effortless. Built with React, Zustand, and Radix UI, it delivers a highly responsive, theme-aware, and data-driven study experience with integrated performance insights.

> 🏆 Built for the 2025 [Code Circuit Hackathon](https://codecircuit.ai)  
> 🌐 Live site: [https://flashforge-1.vercel.app](https://flashforge-1.vercel.app)

---

## 🚀 Features

### 🧠 Smart Study Engine
- SM-2 spaced repetition algorithm for adaptive review intervals
- Real-time progress tracking across decks

### 📊 Insightful Review Stats
- Recharts-powered dashboard for session summaries, difficulty distribution, and streak tracking

### 🗂️ Deck & Flashcard Management
- Create, edit, tag, and delete decks with rich dialogs
- Markdown-like support for flashcard content
- Dialogs powered by Radix UI components

### 🎯 Session-Oriented Review Mode
- Flip animation for flashcards (Framer Motion)
- “Easy / Good / Hard / Again” rating system for feedback
- Daily study target with visual progress bar

### 🧭 Seamless Navigation
- Sidebar layout with responsive shell
- Smooth transitions between views: Review, Stats, Settings

### 🎨 Theming & UI
- Dark/light mode with `next-themes`
- TailwindCSS for rapid UI development
- Radix-based component system for clean accessibility and interaction

---

## 🛠️ Tech Stack

| Layer        | Stack                               |
|--------------|--------------------------------------|
| Framework    | [Next.js 15](https://nextjs.org)     |
| Language     | TypeScript                          |
| Styling      | TailwindCSS + `tailwindcss-animate` |
| UI System    | Radix UI + Framer Motion             |
| State Mgmt   | Zustand                             |
| Charts       | Recharts                            |
| Forms        | React Hook Form + Zod               |
| Icons        | Lucide                              |
| Date Logic   | date-fns                             |
| Misc         | cmdk, uuid, clsx, etc.              |

---

## 📁 Project Structure

```
app/
├── layout.tsx             # Root layout shell
├── page.tsx               # Landing page logic
├── globals.css            # Global Tailwind styles
└── components/
    └── ui/
        ├── app-header.tsx
        ├── app-shell.tsx
        ├── app-sidebar.tsx
        ├── create-card-dialog.tsx
        ├── create-deck-dialog.tsx
        ├── dashboard-view.tsx
        ├── deck-view.tsx
        ├── edit-deck-dialog.tsx
        ├── flashcard.tsx
        ├── mode-toggle.tsx
        ├── review-view.tsx
        ├── settings-view.tsx
        ├── stats-chart.tsx
        └── theme-provider.tsx

hooks/
└── useSpacedRepetition.ts # Encapsulates SM-2 logic
```

---

## 📦 Getting Started

### 🔧 Prerequisites
- Node.js v18+
- pnpm or npm

### 🛠️ Installation

```bash
git clone https://github.com/yourusername/flashforge.git
cd flashforge
pnpm install # or npm install
pnpm dev     # or npm run dev
```

### 🧪 Run Linter

```bash
pnpm lint
```

---

## 🔄 Build & Deployment

```bash
pnpm build
pnpm start
```

Hosted on **Vercel**:  
👉 [https://flashforge-1.vercel.app](https://flashforge-1.vercel.app)

---

## 🧠 Future Enhancements

- 🔒 Optional auth layer for syncing decks
- 📱 PWA support for offline studying
- 🔁 Deck sharing and public library features
- 🎓 Difficulty prediction and smart suggestions (AI-ready architecture)

---

## 🏁 Hackathon Submission

- 🧩 Prompt: *Spaced repetition flashcard engine with review stats*
- 🔗 Live App: [https://flashforge-1.vercel.app](https://flashforge-1.vercel.app)
- 🗃 GitHub Repo: [https://github.com/yourusername/flashforge](https://github.com/yourusername/flashforge)

---

---

## 🙌 Acknowledgements

- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Recharts](https://recharts.org/) for data visualization
- [Framer Motion](https://www.framer.com/motion/) for interaction animations

---

> “If knowledge is power, memory is the engine. FlashForge keeps it running.”
