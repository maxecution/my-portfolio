import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { JSX } from 'react';
import type { NavLink } from '@data/navbar/NavBar.data';
import NavLinks from './NavLinks';

interface BurgerMenuProps {
  navLinks: NavLink[];
  hasScrolled: boolean;
}

export default function BurgerMenu({ navLinks, hasScrolled }: BurgerMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      const menuPanel = document.querySelector('[data-burger-menu]');
      const menuButton = document.querySelector('[data-burger-button]');

      if (menuPanel && !menuPanel.contains(target) && menuButton && !menuButton.contains(target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        data-burger-button
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls='mobile-menu'
        aria-expanded={isOpen}
        className='relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-md hover:cursor-pointer'>
        {/* Hamburger Lines */}
        <span
          className={`block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen &&
        createPortal(
          <div
            id='mobile-menu'
            data-burger-menu
            className={`fixed top-16 right-0 w-45 z-60 transition-all duration-300 ease-in-out ${
              hasScrolled
                ? 'bg-background-200/75 dark:bg-background-200/75 backdrop-blur-xs'
                : 'bg-background dark:bg-background'
            }`}>
            <nav className='flex flex-col p-6'>
              <NavLinks links={navLinks} orientation='vertical' onLinkClick={closeMenu} />
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}
