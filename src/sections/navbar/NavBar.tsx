import useScrollState from '@hooks/useScrollState';
import NavLinks from './NavLinks';
import BurgerMenu from './BurgerMenu';
import ThemeToggleButton from './ThemeToggleButton';
import { navLinks } from '@data/navbar/NavBar.data';
import { authorData } from '@data/page/Page.data';

export default function NavBar() {
  const hasScrolled = useScrollState();

  return (
    <header
      aria-label='Page Header'
      className={`w-full sticky top-0 z-50 h-16 md:h-18 xl:h-20 2xl:h-24 transition-all duration-300 px-6 ${
        hasScrolled ? 'bg-card/75 backdrop-blur-md shadow-lg shadow-primary/20' : 'bg-transparent'
      }`}>
      <div className='flex items-center justify-between h-full'>
        {/* Left side: logo/banner */}
        <a
          href='#'
          aria-label='Navigate to Home section'
          title='Navigate to Home section'
          className='flex items-center font-bold font-display text-xl text-primary hover:scale-105'>
          <div className='w-12 h-12 md:w-14 md:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 flex items-center justify-center border-3 rounded-md'>
            <div className='text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold'>{authorData.initials}</div>
          </div>
          <div className='pl-2 hidden md:block'>
            <div>{authorData.firstName}</div>
            <div>{authorData.lastName}</div>
          </div>
        </a>
        {/* Right side: nav + toggle + burger */}
        <nav
          className='flex items-center gap-2 sm:gap-8 md:gap-10 xl:gap-12 3xl:gap-16'
          role='navigation'
          aria-label='Main navigation'>
          {/* Desktop Nav */}
          <div className='hidden md:flex items-center'>
            <NavLinks links={navLinks} orientation='horizontal' />
          </div>

          <ThemeToggleButton />

          {/* Mobile Nav */}
          <div className='md:hidden'>
            <BurgerMenu navLinks={navLinks} hasScrolled={hasScrolled} />
          </div>
        </nav>
      </div>
    </header>
  );
}
