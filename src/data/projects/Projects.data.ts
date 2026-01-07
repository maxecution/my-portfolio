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

export const projectsData: ProjectCardDetails[] = [
  {
    title: 'Personal Portfolio',
    description: 'A placeholder for testing until final version of page is deployed.',
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
    difficulty: 'Hard',
  },
  {
    title: 'Dark Road West Helper Tool',
    description: 'A collection of QoL tools created for a Westmarches D&D Community.',
    techStack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Vercel', 'GitHub', 'GitHub Actions'],
    githubUrl: 'https://github.com/maxecution/DRW-helper',
    liveUrl: 'https://drw-helper.vercel.app/',
    difficulty: 'Easy',
  },
  {
    title: 'Placeholder Project 3',
    description: 'A placeholder for testing until final version of page is deployed.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Jest'],
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Hard',
  },
  {
    title: 'Placeholder Project 4',
    description: 'A placeholder for testing until final version of page is deployed.',
    techStack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Jest', 'Vercel'],
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Legendary',
  },
  {
    title: 'Placeholder Project 5',
    description: 'A placeholder for testing until final version of page is deployed.',
    techStack: ['React', 'TypeScript'],
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Unknown',
  },
];
