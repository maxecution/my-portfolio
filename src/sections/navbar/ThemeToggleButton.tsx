import type { JSX } from 'react';
import { useTheme } from '@contexts/ThemeProvider/useTheme';

export default function ThemeToggleButton(): JSX.Element {
  const { toggleTheme } = useTheme();

  const handleClick = (): void => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsViewTransition = 'startViewTransition' in document;

    if (!supportsViewTransition || prefersReducedMotion) {
      toggleTheme();
      return;
    }

    const styleId = `theme-transition-${Date.now()}`;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @supports (view-transition-name: root) {
        ::view-transition-old(root) { animation: none; }
        ::view-transition-new(root) {
          animation: circle-expand 0.5s ease-out;
          transform-origin: top right;
        }
        @keyframes circle-expand {
          from { clip-path: circle(0% at 100% 0%); }
          to { clip-path: circle(150% at 100% 0%); }
        }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => style.remove(), 2500);

    (document as Document).startViewTransition(() => {
      toggleTheme();
    });
  };

  return (
    <button
      title='Theme toggle button'
      onClick={handleClick}
      aria-label='Theme toggle button'
      className='text-muted-foreground hover:text-primary-400 relative w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center hover:cursor-pointer rounded-md'>
      {/* Sun icon */}
      <svg
        className='absolute w-6 h-6 2xl:w-8 2xl:h-8 transition-all duration-300 ease-in-out opacity-100 scale-100 translate-y-0 dark:opacity-0 dark:scale-75 dark:translate-y-6'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'>
        <circle cx='12' cy='12' r='5' />
        <line x1='12' y1='0.5' x2='12' y2='4' />
        <line x1='12' y1='20' x2='12' y2='23.5' />
        <line x1='3.76' y1='3.76' x2='6.34' y2='6.34' />
        <line x1='17.66' y1='17.66' x2='20.24' y2='20.24' />
        <line x1='0.5' y1='12' x2='4' y2='12' />
        <line x1='20' y1='12' x2='23.5' y2='12' />
        <line x1='3.76' y1='20.24' x2='6.34' y2='17.66' />
        <line x1='17.66' y1='6.34' x2='20.24' y2='3.76' />
      </svg>

      {/* Moon icon */}
      <svg
        className='absolute w-6 h-6 2xl:w-8 2xl:h-8 transition-all duration-500 ease-in-out opacity-0 scale-75 translate-y-6 dark:opacity-100 dark:scale-100 dark:translate-y-0'
        fill='currentColor'
        viewBox='0 0 24 24'>
        <path d='M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z' />
      </svg>
    </button>
  );
}
