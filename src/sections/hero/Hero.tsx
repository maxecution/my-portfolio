import { heroData } from '@data/hero/Hero.data';
import { authorData, cvURL } from '@data/page/Page.data';
import { GradientText } from '@ui/text/GradientText';
import TypewriterEffect from './TypewriterEffect';
import useScrollState from '@hooks/useScrollState';
import Arrow from '@ui/arrow/Arrow';

// Helper function to determine the width based on the longest phrase
function getTypewriterWidth(phrases: string[]): string {
  const longestPhrase = phrases.reduce((longest, current) => (current.length > longest.length ? current : longest), '');

  // Calculate approximate width based on character count
  // Using a base of 0.6em per character as a rough estimate for most fonts
  const estimatedWidth = longestPhrase.length * 0.7;
  return `${estimatedWidth}em`;
}

export default function Hero() {
  const hasScrolled = useScrollState(160);
  const typewriterWidth = getTypewriterWidth(heroData.typewriterPhrases);
  return (
    <div className='flex flex-col items-center justify-center h-full relative px-4'>
      {/* Main content */}
      <div className='flex flex-col text-center items-center justify-center gap-6 md:gap-8 lg:gap-10'>
        <h1 className='text-5xl md:text-7xl tracking-tight font-medium'>
          Well met, I'm <GradientText>{authorData.firstName}</GradientText>
        </h1>
        {/* Typewriter effect container */}
        <span
          className='p-2 bg-primary/10 backdrop-blur-sm border-2 border-primary/50 rounded-full text-sm text-center font-display text-muted-foreground'
          style={{ width: typewriterWidth }}>
          <TypewriterEffect phrases={heroData.typewriterPhrases} />
        </span>
        {/* Description */}
        <p className='text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto'>{heroData.text}</p>
        <div className='flex flex-col md:flex-row gap-5'>
          <a
            href='#contact-form'
            className='border-2 border-primary rounded-lg px-8 py-4 text-primary font-bold transition-transform hover:scale-105 shadow-primary/50 hover:shadow-lg'
            data-testid='contact-link'>
            Get in Touch
          </a>
          <a
            href={cvURL}
            download
            rel='noopener noreferrer'
            className='bg-primary rounded-lg px-8 py-4 text-background font-bold transition-transform hover:scale-105 shadow-primary/50 hover:shadow-lg'
            data-testid='cv-download-link'>
            Download CV
          </a>
        </div>
      </div>

      {/* Arrow positioned at bottom */}
      <div
        className={`absolute bottom-5 left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-in-out ${
          hasScrolled ? 'opacity-0 invisible' : 'opacity-100 visible animate-bounce'
        }`}
        aria-hidden={hasScrolled}>
        <a href='#about' className='text-primary' data-testid='scroll-arrow'>
          <Arrow className='text-primary' size={30} direction='down' aria-label='Scroll down to About section' />
        </a>
      </div>
    </div>
  );
}
