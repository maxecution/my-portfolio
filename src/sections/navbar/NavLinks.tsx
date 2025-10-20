import type { JSX } from 'react';
import type { NavLink } from '@data/navbar/NavBar.data';

interface NavLinksProps {
  links: NavLink[];
  orientation?: 'horizontal' | 'vertical';
  onLinkClick?: () => void;
}

export default function NavLinks({ links, orientation = 'horizontal', onLinkClick }: NavLinksProps): JSX.Element {
  const isVertical = orientation === 'vertical';

  return (
    <ul
      className={`flex ${
        isVertical ? 'flex-col space-y-6' : 'flex-row items-center gap-8 md:gap-10 xl:gap-12 3xl:gap-16'
      }`}
      role={isVertical ? undefined : 'menu'}>
      {links.map((link) => (
        <li key={link.href} className={isVertical ? 'border-b border-gray-500 hover:border-b-2' : ''}>
          <a
            href={link.href}
            onClick={onLinkClick}
            aria-label={`Navigate to ${link.label} section`}
            className={`text-base md:text-lg xl:text-xl 2xl:text-2xl font-medium text-text dark:text-text pb-2 border-b-2 border-transparent ${
              !isVertical ? 'hover:border-text hover:dark:border-text' : ''
            }`}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
