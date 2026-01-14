# My Portfolio

**My evolving portfolio repository**

This repository contains the source code for a personal portfolio website built using modern frontend technologies. Its purpose is to showcase professional experience, projects, and contact information, with ongoing improvements and iterative enhancements.

Live site: [https://mzs.is-a.dev/](https://mzs.is-a.dev/)

---

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Want your own copy?](#want-your-own-copy)
- [License](#license)

---

## About

_My Portfolio_ is a single-page application designed to present personal projects, technical skills, background information, and contact details in a clear and accessible manner. The codebase is structured with scalability and maintainability in mind, allowing the site to evolve as new content or features are added.

Key design goals include:

- Clear and concise presentation of work and skills
- Fully responsive layout across devices
- Smooth navigation between sections
- A section-based architecture (Hero, About, Projects, Contact)

A significant portion of the site’s content is **data-driven**. Structured data files under `src/data` define the majority of page content, allowing sections to be easily updated or expanded without modifying component logic. For example, new project cards can be added by updating the relevant data file rather than editing UI components directly.

---

## Tech Stack

<!-- Shield images sourced from https://github.com/inttter/md-badges -->

[<img src="https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB" alt="React badge logo" />](https://react.dev/)
[<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript badge logo" />](https://www.typescriptlang.org/)
[<img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" alt="Vite badge logo" />](https://vitejs.dev/)
[<img src="https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white" alt="Tailwind CSS badge logo" />](https://tailwindcss.com/)
[<img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=fff" alt="Jest badge logo" />](https://jestjs.io/docs/getting-started)
[<img src="https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white" alt="Vercel badge logo" />](https://vercel.com/)
[<img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff" alt="pnpm badge logo" />](https://pnpm.io/)
[<img src="https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff" alt="Git badge logo" />](https://git-scm.com/)
[<img src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white" alt="GitHub Actions badge logo" />](https://github.com/features/actions)
[<img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white" alt="Figma badge logo" />](https://www.figma.com/)
[<img src="https://img.shields.io/badge/Resend-000000?logo=resend" alt="Resend badge logo" />](https://resend.com/)
[<img src="https://img.shields.io/badge/Upstash-Redis-DC382D?logo=upstash" alt="Upstash badge logo" />](https://upstash.com/)

---

## Features

- Navigation bar with smooth section scrolling and theme toggle
- Hero section for introduction and first impression
- About section with personal background and interactive skill cards
- Projects carousel driven by structured data
- Contact section with form submission and quick links
- Fully responsive design across desktop and mobile devices

---

## Project Structure

```text
.
├── api/                         # Serverless / backend logic
│   └── contact.ts               # Contact form handler (email / submission logic)
│
├── public/                      # Static assets served as-is
│   ├── favicon.png
│   └── projectScreenshots/      # Screenshots used in project cards
│
├── src/                         # Application source code
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root React component
│   │
│   ├── assets/                  # Static assets imported into components
│   │   ├── icons/
│   │   └── logos/               # Branding and logo variants
│   │
│   ├── components/              # Reusable, composable UI components
│   │   ├── layout/              # Layout primitives
│   │   ├── shared/              # Generic shared components
│   │   └── ui/                  # Low-level UI elements
│   │
│   ├── sections/                # Page-level sections
│   │   ├── hero/
│   │   ├── about/
│   │   ├── projects/
│   │   ├── contact/
│   │   ├── navbar/
│   │   └── footer/
│   │
│   ├── data/                    # Structured, data-driven content
│   │   ├── hero/
│   │   ├── about/
│   │   ├── projects/
│   │   ├── contact/
│   │   ├── navbar/
│   │   └── page/
│   │
│   ├── contexts/                # Global React context providers
│   │   ├── ThemeProvider/
│   │   └── toasterProvider/
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Framework-agnostic helpers
│   ├── styles/                  # Global styles
│   ├── setupTests.ts            # Jest setup
│   └── vite-env.d.ts
│
├── config/                      # Configuration utilities
├── index.html                   # HTML entry template
├── eslint.config.js
├── jest.config.js
├── vite.config.ts
├── tsconfig*.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## Want your own copy?

These instructions will help you set up the project locally for development and testing.

If you intend to deploy your own version of this project, you will need to replace all personal content under `src/data` and configure the required third-party services.

### Required Services and Environment Variables

**Vercel (deployment and CI):**

Add the following environment variables to the GitHub repository (found on Vercel):

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_TOKEN`

**Upstash (Redis):**

- Configure via the Vercel dashboard
- Environment variables will be populated automatically

**Resend (email delivery):**

Add to Vercel project:

- `RESEND_API_KEY`

**Rate Limiting:**

Add to Vercel project:

- `RATE_LIMIT_SALT`

---

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm (preferred package manager)

---

### Installation

Clone the repository:

```bash
git clone https://github.com/maxecution/my-portfolio.git
cd my-portfolio
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

Run the test suite with coverage:

```bash
pnpm run test:coverage
```

---

## License

Source code is licensed under the MIT License.
Branding, images, and personal content are not.

See the [LICENSE](./LICENSE.md) file for full details.

---
