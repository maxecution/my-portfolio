interface ContactIntro {
  sectionHeader: string;
}

interface SocialLink {
  name: string;
  handle: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

export const contactIntro: ContactIntro = {
  sectionHeader: `The sending stone is active. Reach out and let the adventure begin. Share your challenge, your vision, or simply tales from the road, I'm always open to new alliances. Let's forge something extraordinary together.`,
};
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    handle: '@maxecution',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'>
        <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'></path>
        <path d='M9 18c-4.51 2-5-2-7-2'></path>
      </svg>
    ),
    url: 'https://github.com',
    color: 'hover:text-purple-400',
  },
  {
    name: 'LinkedIn',
    handle: 'in/max-zimmer-smith/',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'>
        <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
        <rect width='4' height='12' x='2' y='9' />
        <circle cx='4' cy='4' r='2' />
      </svg>
    ),
    url: 'https://linkedin.com',
    color: 'hover:text-blue-400',
  },
  {
    name: 'Email',
    handle: 'max.zimmersmith@gmail.com',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'>
        <path d='m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' />
        <rect x='2' y='4' width='20' height='16' rx='2' />
      </svg>
    ),
    url: 'mailto:max@example.com',
    color: 'hover:text-red-400',
  },
];
