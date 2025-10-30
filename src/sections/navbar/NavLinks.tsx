import type { NavLink } from '@data/navbar/NavBar.data';

interface NavLinksProps {
  links: NavLink[];
  orientation?: 'horizontal' | 'vertical';
  onLinkClick?: () => void;
}

export default function NavLinks({ links, orientation = 'horizontal', onLinkClick }: NavLinksProps) {
  const isVertical = orientation === 'vertical';

  return (
    <ul
      className={`flex ${
        isVertical ? 'flex-col space-y-4' : 'flex-row items-center gap-8 md:gap-10 xl:gap-12 3xl:gap-16'
      }`}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            onClick={onLinkClick}
            aria-label={`Navigate to ${link.label} section`}
            className={`text-muted-foreground hover:text-primary-400 block w-full h-full md:text-lg xl:text-xl 2xl:text-2xl px-2 ${
              isVertical ? 'border-b border-foreground hover:border-primary-400' : ''
            }`}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
