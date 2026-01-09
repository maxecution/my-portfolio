import useScrollState from '@hooks/useScrollState';
import NavLinks from './NavLinks';
import BurgerMenu from './BurgerMenu';
import ThemeToggleButton from './ThemeToggleButton';
import { navLinks } from '@data/navbar/NavBar.data';
import { authorData, cvURL } from '@data/page/Page.data';

export default function NavBar() {
  const hasScrolled = useScrollState();
  const cvButtonHasScrolled = useScrollState(800);

  return (
    <header
      aria-label='Page Header'
      className={`w-full sticky top-0 z-50 h-16 md:h-18 xl:h-20 2xl:h-24 transition-all duration-300 px-6 ${
        hasScrolled ? 'bg-card/75 backdrop-blur-md shadow-lg shadow-primary/20' : 'bg-transparent'
      }`}>
      <div className='relative flex items-center h-full'>
        {/* Left side: logo/banner */}
        <a
          href='#'
          aria-label='Navigate to Home section'
          title='Navigate to Home section'
          className='flex items-center font-bold font-display text-xl text-primary hover:scale-105'>
          <div className='w-12 h-12 md:w-14 md:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 flex items-center justify-center border-3 rounded-md'>
            <div className='text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold'>{authorData.initials}</div>
          </div>
          <div className='pl-2 hidden lg:block'>
            <div>{authorData.firstName}</div>
            <div>{authorData.lastName}</div>
          </div>
        </a>

        {/* CV Button - visible when scrolled */}
        <div
          className={`${
            cvButtonHasScrolled ? 'opacity-100 visible' : 'opacity-0 invisible'
          } absolute left-1/2 -translate-x-1/2 text-background bg-primary border-2 border-primary rounded-full p-2 hover:cursor-pointer transition-opacity duration-300`}
          aria-hidden={cvButtonHasScrolled}>
          <a
            href={cvURL}
            download
            rel='noopener noreferrer'
            className='text-sm md:text-base font-bold'
            data-testid='cv-download-link'>
            Download CV
          </a>
        </div>

        {/* Right side: nav + toggle + burger */}
        <nav
          className='ml-auto flex items-center gap-2 sm:gap-8 md:gap-10 xl:gap-12 3xl:gap-16'
          role='navigation'
          aria-label='Main navigation'>
          {/* Desktop Nav */}
          <div className='hidden lg:flex items-center'>
            <NavLinks links={navLinks} orientation='horizontal' />
          </div>

          <ThemeToggleButton />

          {/* Mobile Nav */}
          <div className='lg:hidden'>
            <BurgerMenu navLinks={navLinks} hasScrolled={hasScrolled} />
          </div>
        </nav>
      </div>
    </header>
  );
}
