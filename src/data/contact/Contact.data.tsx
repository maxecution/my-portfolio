import type React from 'react';

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

export interface QuickInfoCard {
  icon: React.ReactNode;
  title: string;
  info: React.ReactNode;
}

// this needs to be updated manually in api/contact.ts as well
const githubHandle = 'maxecution';
const githubUrl = 'https://github.com/' + githubHandle;
const linkedinHandle = 'in/max-zimmer-smith/';
const linkedinUrl = 'https://www.linkedin.com/' + linkedinHandle;
const ownerEmail: string = 'mzs.enquiry@gmail.com';

export const contactIntro: ContactIntro = {
  sectionHeader: `The sending stone is active. Reach out and let the adventure begin. Share your challenge, your vision, or simply tales from the road, I'm always open to new alliances. Let's forge something extraordinary together.`,
};
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    handle: '@' + githubHandle,
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
        strokeLinejoin='round'
        aria-hidden='true'
        focusable='false'>
        <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'></path>
        <path d='M9 18c-4.51 2-5-2-7-2'></path>
      </svg>
    ),
    url: githubUrl,
    color: 'hover:text-purple-400',
  },
  {
    name: 'LinkedIn',
    handle: linkedinHandle,
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
        strokeLinejoin='round'
        aria-hidden='true'
        focusable='false'>
        <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
        <rect width='4' height='12' x='2' y='9' />
        <circle cx='4' cy='4' r='2' />
      </svg>
    ),
    url: linkedinUrl,
    color: 'hover:text-blue-400',
  },
  {
    name: 'Email',
    handle: ownerEmail,
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
        strokeLinejoin='round'
        aria-hidden='true'
        focusable='false'>
        <path d='m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' />
        <rect x='2' y='4' width='20' height='16' rx='2' />
      </svg>
    ),
    url: 'mailto:' + ownerEmail,
    color: 'hover:text-red-400',
  },
];

export const quickInfoCards: QuickInfoCard[] = [
  {
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='h-5 w-5 text-primary'
        aria-hidden='true'
        focusable='false'>
        <path d='M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0' />
        <circle cx='12' cy='8' r='2' />
        <path d='M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712' />
      </svg>
    ),
    title: 'Location',
    info: 'Based in Scotland, UK. Open to working remotely with guilds across the realms.',
  },
  {
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='w-5 h-5 text-primary'
        aria-hidden='true'
        focusable='false'>
        <circle cx='12' cy='13' r='8' />
        <path d='M5 3 2 6' />
        <path d='m22 6-3-3' />
        <path d='M6.38 18.7 4 21' />
        <path d='M17.64 18.67 20 21' />
        <path d='m9 13 2 2 4-4' />
      </svg>
    ),
    title: 'Response Time',
    info: 'Expect a response within a day. Your call to adventure will never go unanswered!',
  },
];
