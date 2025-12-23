interface ProjectIntro {
  sectionHeader: string;
}

export interface ProjectCardDetails {
  title: string;
  description: string;
  techStack: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary' | 'Unknown';
}

export const projectIntro: ProjectIntro = {
  sectionHeader: `A showcase of my adventures in code, each project a quest completed, highlighting the projects that have shaped my journey as a developer. Explore the realms I've created and the problems I've solved.`,
};

export const projectsData: ProjectCardDetails[] = [
  {
    title: 'Portfolio Website',
    description: 'A personal portfolio website to showcase my projects and skills.',
    techStack: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Jest',
      'GitHub',
      'Vercel',
      'more',
      'technologies',
      'to',
      'demonstrate',
      'the',
      'scrolling',
      'effect',
      'and',
      'layout',
      'handling',
      'capabilities',
    ],
    image: '/images/portfolio.png',
    githubUrl: 'https://github.com/maxecution/my-portfolio/',
    liveUrl: 'https://maxecution.github.io/portfolio-website/',
    difficulty: 'Easy',
  },
  // {
  //   title: 'Portfolio Website 2',
  //   description: 'A personal portfolio website to showcase my projects and skills.',
  //   techStack: ['React', 'TypeScript', 'Tailwind CSS'],
  //   image: '/images/portfolio.png',
  //   githubUrl: 'https://github.com/maxecution/my-portfolio/',
  //   liveUrl: 'https://maxecution.github.io/portfolio-website/',
  //   difficulty: 'Medium',
  // },
  // {
  //   title: 'Portfolio Website 3',
  //   description: 'A personal portfolio website to showcase my projects and skills.',
  //   techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Jest'],
  //   image: '/images/portfolio.png',
  //   githubUrl: 'https://github.com/maxecution/my-portfolio/',
  //   liveUrl: 'https://maxecution.github.io/portfolio-website/',
  //   difficulty: 'Hard',
  // },
  // {
  //   title: 'Portfolio Website 4',
  //   description: 'A personal portfolio website to showcase my projects and skills.',
  //   techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Jest', 'Vercel'],
  //   image: '/images/portfolio.png',
  //   githubUrl: 'https://github.com/maxecution/my-portfolio/',
  //   liveUrl: 'https://maxecution.github.io/portfolio-website/',
  //   difficulty: 'Legendary',
  // },
  // {
  //   title: 'Portfolio Website 5',
  //   description: 'A personal portfolio website to showcase my projects and skills.',
  //   techStack: ['React', 'TypeScript'],
  //   image: '/images/portfolio.png',
  //   githubUrl: 'https://github.com/maxecution/my-portfolio/',
  //   liveUrl: 'https://maxecution.github.io/portfolio-website/',
  //   difficulty: 'Unknown',
  // },
];
