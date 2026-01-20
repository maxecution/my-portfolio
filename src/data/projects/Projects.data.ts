interface ProjectIntro {
  sectionHeader: string;
}

export interface ProjectCardDetails {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary' | 'Unknown';
}

export const projectIntro: ProjectIntro = {
  sectionHeader: `A showcase of my adventures in code, each project a quest completed, highlighting the projects that have shaped my journey as a developer. Explore the realms I've created and the problems I've solved.`,
};

// Project Screenshots should follow the naming convention: project-title-screenshot.png, e.g. presonal-portfolio-screenshot.png, and saved in the public/projectScreenshots/ directory.
export const projectsData: ProjectCardDetails[] = [
  {
    title: 'Dark Road West Helper',
    description: 'A QoL tools collection for a Westmarches D&D server.',
    techStack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Vercel', 'GitHub', 'GitHub Actions'],
    githubUrl: 'https://github.com/maxecution/DRW-helper',
    liveUrl: 'https://drw-helper.vercel.app/',
    difficulty: 'Easy',
  },
  {
    title: 'My Personal Portfolio',
    description: 'An evolving website to showcase my private projects.',
    techStack: [
      'React',
      'Vite',
      'TypeScript',
      'Tailwind CSS',
      'Jest',
      'Vercel',
      'GitHub',
      'GitHub Actions',
      'Figma',
      'Resend',
      'upstash/Redis',
    ],
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxzimmersmith.vercel.app/',
    difficulty: 'Medium',
  },
  {
    title: 'Discord Game News Bot',
    description: 'A web scraper to post game news to Discord via webhook.',
    techStack: ['Node.js', 'JavaScript', 'Cheerio', 'GitHub Actions', 'Cron schedules', 'Discord Webhooks'],
    githubUrl: 'https://github.com/maxecution/discord-game-news-bot',
    liveUrl: 'https://github.com/maxecution/discord-game-news-bot/actions',
    difficulty: 'Easy',
  },
];
