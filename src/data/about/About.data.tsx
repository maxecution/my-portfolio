interface AboutData {
  sectionHeader: string;
  introCard: {
    paragraph1: string;
    paragraph2: string;
  };
}

interface Attribute {
  id: string;
  name: string;
  stat: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export const aboutData: AboutData = {
  sectionHeader: `Every great adventurer has unique attributes. Here's my stat block, the skills and abilities I've honed on my journey so far.`,
  introCard: {
    paragraph1: `I've journeyed through a few different classes in my career, customer service, field engineering, and creative media, collecting the skills that now support my work as a Frontend Developer.`,
    paragraph2: `Driven by curiosity and a constant desire to learn, my goal is simple: create accessible, intuitive experiences that make life a little easier for the people who rely on them. Outside the codebase, you'll find me reading fantasy, exploring new technologies, or preparing for my next D&D adventure.`,
  },
};
export const attributes: Attribute[] = [
  {
    id: 'strength',
    name: 'Strength',
    stat: 'React',
    value: 18,
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='size-[inherit]'
        aria-hidden='true'
        focusable='false'>
        <path d='M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1' />
        <path d='M15 14a5 5 0 0 0-7.584 2' />
        <path d='M9.964 6.825C8.019 7.977 9.5 13 8 15' />
      </svg>
    ),
    description: 'Hands-on React experience across large codebases and accessible UI work.',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'dexterity',
    name: 'Dexterity',
    stat: 'CSS/Tailwind',
    value: 15,
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='size-[inherit]'
        aria-hidden='true'
        focusable='false'>
        <circle cx='12' cy='12' r='10' />
        <circle cx='12' cy='12' r='6' />
        <circle cx='12' cy='12' r='2' />
      </svg>
    ),
    description: 'Crafting clean, responsive interfaces with a focus on clarity and accessibility.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'constitution',
    name: 'Constitution',
    stat: 'Adaptability',
    value: 19,
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='size-[inherit]'
        aria-hidden='true'
        focusable='false'>
        <path d='M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5' />
      </svg>
    ),
    description: 'Quick to learn new tools and technologies, no matter the terrain or challenge.',
    color: 'from-green-500 to-emerald-600',
  },

  {
    id: 'intelligence',
    name: 'Intelligence',
    stat: 'Jest / Playwright',
    value: 14,
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='size-[inherit]'
        aria-hidden='true'
        focusable='false'>
        <path d='M12 7v14' />
        <path d='M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z' />
      </svg>
    ),
    description: 'Battle-ready testing skills that keep features stable and bugs at bay.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'wisdom',
    name: 'Wisdom',
    stat: 'TypeScript',
    value: 16,
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='size-[inherit]'
        aria-hidden='true'
        focusable='false'>
        <path d='M12 18V5' />
        <path d='M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4' />
        <path d='M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5' />
        <path d='M17.997 5.125a4 4 0 0 1 2.526 5.77' />
        <path d='M18 18a4 4 0 0 0 2-7.464' />
        <path d='M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517' />
        <path d='M6 18a4 4 0 0 1-2-7.464' />
        <path d='M6.003 5.125a4 4 0 0 0-2.526 5.77' />
      </svg>
    ),
    description: 'Type-driven foresight that strengthens code and prevents sneaky errors.',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'charisma',
    name: 'Charisma',
    stat: 'Collaboration',
    value: 18,
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='size-[inherit]'
        aria-hidden='true'
        focusable='false'>
        <path d='m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72' />
        <path d='m14 7 3 3' />
        <path d='M5 6v4' />
        <path d='M19 14v4' />
        <path d='M10 2v2' />
        <path d='M7 8H3' />
        <path d='M21 16h-4' />
        <path d='M11 3H9' />
      </svg>
    ),
    description: 'Building trust across the party with clear, supportive communication.',
    color: 'from-rose-500 to-red-600',
  },
];
