# My Portfolio

**My evolving portfolio repository**

This repository contains the source code for a personal portfolio website built using modern frontend technologies. Its purpose is to showcase professional experience, projects, and contact information, with ongoing improvements and iterative enhancements.

Live site: [https://mzs.is-a.dev/](https://mzs.is-a.dev/)

---

## Table of Contents

- [About](#about)
- [Engineering Goals](#engineering-goals)
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

## Engineering Goals

This project was guided by three explicit, self-imposed engineering goals. Each goal influenced architectural decisions, tooling choices, and validation practices throughout development.

### 1. Minimal Dependency Surface Area

**Goal:**
Minimise third-party dependencies to reduce supply-chain risk, improve long-term maintainability, and deliberately solve common UI and interaction problems in-house rather than relying on abstractions.

**Outcome:**
The application uses a deliberately small and tightly scoped dependency set. All major UI primitives, layout systems, animations, accessibility behaviours, and interaction logic are implemented directly within the codebase rather than via component libraries or heavy utility frameworks.

**Runtime dependencies:**

```json
{
  "@tailwindcss/vite": "^4.1.18",
  "@upstash/redis": "^1.36.0",
  "@vercel/analytics": "^1.6.1",
  "clsx": "^2.1.1",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "resend": "^6.6.0",
  "tailwind-merge": "^3.4.0",
  "tailwindcss": "^4.1.18"
}
```

Notably absent are UI component libraries, animation frameworks, form libraries, carousel packages, or accessibility wrappers. This constraint resulted in custom implementations for navigation behaviour, modals, carousels, theming, animations, and form handling, all of which are fully tested and documented.

### 2. WCAG 2.2 AA Accessibility Compliance

**Goal:**
Ensure the site meets **WCAG 2.2 AA** accessibility standards across structure, interaction, colour contrast, keyboard navigation, and assistive technology compatibility.

**Outcome:**
Accessibility was treated as a first-class requirement during implementation rather than a post-hoc audit step. Semantic HTML, correct ARIA usage, focus management, keyboard operability, reduced-motion handling, and colour contrast were all validated iteratively.

Compliance was verified using multiple independent tools to reduce false positives and tool-specific blind spots, including:

- <a href="https://developer.chrome.com/docs/lighthouse/">Lighthouse</a>
- <a href="https://accessibleweb.com/">Accessible Web RAMP</a>
- <a href="https://accessibleweb.com/color-contrast-checker/">WCAG Color Contrast Checker</a>
- <a href="https://www.evinced.com/products/flow-analyzer-for-web">Evinced Flow Analyzer</a>

<img alt="Lighthouse Scan" src="https://maxecution.github.io/portfolio-assets/public/portfolio-readme/lighthouse-scan.png" height="250" />
<img alt="Evinced Scan" src="https://maxecution.github.io/portfolio-assets/public/portfolio-readme/evinced-scan.png" height="250" />

<img alt="Accessibility Web RAMP Scan 1" src="https://maxecution.github.io/portfolio-assets/public/portfolio-readme/ramp-scan-1.png" width="350" />
<img alt="Accessibility Web RAMP Scan 2" src="https://maxecution.github.io/portfolio-assets/public/portfolio-readme/ramp-scan-2.png" width="350" />

### 3. 100% Test Coverage (Statements, Branches, Functions, Lines)

**Goal:**
Achieve and maintain **100% test coverage** across the entire project to enforce confidence in refactors, document intended behaviour, and eliminate untested logic paths.

**Outcome:**
The project maintains 100% coverage across all metrics, including UI components, hooks, utilities, context providers, and serverless API logic.

**Current coverage summary:**

```text
-----------------------------------|---------|----------|---------|---------|-------------------
File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------------|---------|----------|---------|---------|-------------------
All files                          |     100 |      100 |     100 |     100 |
api                                |     100 |      100 |     100 |     100 |
  contact.ts                       |     100 |      100 |     100 |     100 |
src/assets/icons                   |     100 |      100 |     100 |     100 |
  Icons.tsx                        |     100 |      100 |     100 |     100 |
src/components/layout/section      |     100 |      100 |     100 |     100 |
  Section.tsx                      |     100 |      100 |     100 |     100 |
  SectionHeader.tsx                |     100 |      100 |     100 |     100 |
src/components/shared/card         |     100 |      100 |     100 |     100 |
  Card.tsx                         |     100 |      100 |     100 |     100 |
src/components/shared/modal        |     100 |      100 |     100 |     100 |
  Modal.tsx                        |     100 |      100 |     100 |     100 |
src/components/shared/pill         |     100 |      100 |     100 |     100 |
  Pill.tsx                         |     100 |      100 |     100 |     100 |
src/components/shared/sectionFade  |     100 |      100 |     100 |     100 |
  SectionFade.tsx                  |     100 |      100 |     100 |     100 |
src/components/ui/arrow            |     100 |      100 |     100 |     100 |
  Arrow.tsx                        |     100 |      100 |     100 |     100 |
src/components/ui/runicBackground  |     100 |      100 |     100 |     100 |
  RunicBackground.tsx              |     100 |      100 |     100 |     100 |
src/components/ui/text             |     100 |      100 |     100 |     100 |
  GradientText.tsx                 |     100 |      100 |     100 |     100 |
src/contexts/ThemeProvider         |     100 |      100 |     100 |     100 |
  ThemeContext.ts                  |     100 |      100 |     100 |     100 |
  ThemeProvider.tsx                |     100 |      100 |     100 |     100 |
  themeProviderTestUtils.ts        |     100 |      100 |     100 |     100 |
  useTheme.ts                      |     100 |      100 |     100 |     100 |
src/contexts/toasterProvider       |     100 |      100 |     100 |     100 |
  ToastContext.ts                  |     100 |      100 |     100 |     100 |
  ToastItem.tsx                    |     100 |      100 |     100 |     100 |
  Toaster.tsx                      |     100 |      100 |     100 |     100 |
  ToasterProvider.tsx              |     100 |      100 |     100 |     100 |
  renderWithToasterProvider.tsx    |     100 |      100 |     100 |     100 |
  useToast.ts                      |     100 |      100 |     100 |     100 |
src/hooks                          |     100 |      100 |     100 |     100 |
  useAutoplay.ts                   |     100 |      100 |     100 |     100 |
  useIsMobile.ts                   |     100 |      100 |     100 |     100 |
  useScrollState.ts                |     100 |      100 |     100 |     100 |
src/sections/about                 |     100 |      100 |     100 |     100 |
  About.tsx                        |     100 |      100 |     100 |     100 |
  FlipCard.tsx                     |     100 |      100 |     100 |     100 |
  IconWrapper.tsx                  |     100 |      100 |     100 |     100 |
src/sections/contact               |     100 |      100 |     100 |     100 |
  Contact.tsx                      |     100 |      100 |     100 |     100 |
  ContactForm.tsx                  |     100 |      100 |     100 |     100 |
  ContactLinks.tsx                 |     100 |      100 |     100 |     100 |
  ContactQuickInfoCard.tsx         |     100 |      100 |     100 |     100 |
  FormField.tsx                    |     100 |      100 |     100 |     100 |
src/sections/footer                |     100 |      100 |     100 |     100 |
  Footer.tsx                       |     100 |      100 |     100 |     100 |
src/sections/hero                  |     100 |      100 |     100 |     100 |
  Hero.tsx                         |     100 |      100 |     100 |     100 |
  TypewriterEffect.tsx             |     100 |      100 |     100 |     100 |
src/sections/navbar                |     100 |      100 |     100 |     100 |
  BurgerMenu.tsx                   |     100 |      100 |     100 |     100 |
  NavBar.tsx                       |     100 |      100 |     100 |     100 |
  NavLinks.tsx                     |     100 |      100 |     100 |     100 |
  ThemeToggleButton.tsx            |     100 |      100 |     100 |     100 |
src/sections/projects              |     100 |      100 |     100 |     100 |
  Carousel.tsx                     |     100 |      100 |     100 |     100 |
  Carousel.utils.ts                |     100 |      100 |     100 |     100 |
  DifficultyBadge.tsx              |     100 |      100 |     100 |     100 |
  ProjectCard.tsx                  |     100 |      100 |     100 |     100 |
  ProjectCardTechStack.tsx         |     100 |      100 |     100 |     100 |
  Projects.tsx                     |     100 |      100 |     100 |     100 |
src/utils                          |     100 |      100 |     100 |     100 |
  cn.ts                            |     100 |      100 |     100 |     100 |
  formUtils.ts                     |     100 |      100 |     100 |     100 |
  getScreenshot.ts                 |     100 |      100 |     100 |     100 |
-----------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 37 passed, 37 total
Tests:       252 passed, 252 total
```

Coverage is enforced via Jest and validated in CI to prevent regressions.

### Why These Constraints Matter

Taken together, these goals ensure the project is:

- **Auditable** — minimal external code and exhaustive test coverage
- **Accessible** — compliant with modern accessibility standards
- **Maintainable** — predictable behaviour, explicit logic, and low dependency churn
- **Demonstrative** — intentionally showcases problem-solving rather than library composition

These constraints were chosen to reflect production-grade engineering priorities rather than rapid prototyping shortcuts.

---

## Tech Stack

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

<small>Shield images sourced from <a href='https://github.com/inttter/md-badges'>md-badges</a></small>

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
