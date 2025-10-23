import { heroData } from '@/data/hero/Hero.data';
import { GradientText } from '@shared/text/GradientText';
import TypewriterEffect from './TypewriterEffect';
import useScrollState from '@hooks/useScrollState';
import Arrow from '@shared/arrow/Arrow';

// Helper function to determine the width based on the longest phrase
function getTypewriterWidth(phrases: string[]): string {
  const longestPhrase = phrases.reduce((longest, current) => (current.length > longest.length ? current : longest), '');

  // Calculate approximate width based on character count
  // Using a base of 0.6em per character as a rough estimate for most fonts
  const estimatedWidth = longestPhrase.length * 0.6;
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
          Hi, I'm <GradientText>{heroData.name}</GradientText>
        </h1>
        {/* Typewriter effect container */}
        <span className='px-2 py-2 bg-primary-200 rounded-full text-sm text-center' style={{ width: typewriterWidth }}>
          <TypewriterEffect phrases={heroData.typewriterPhrases} />
        </span>
        {/* Description */}
        <p className='text-xl md:text-2xl max-w-2xl mx-auto text-text-600 font-normal'>{heroData.text}</p>
      </div>

      {/* Arrow positioned at bottom */}
      <div
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-in-out ${
          hasScrolled ? 'opacity-0 invisible' : 'opacity-100 visible animate-bounce'
        }`}
        aria-hidden={hasScrolled}>
        <a href='#about' className='text-primary'>
          <Arrow className='text-primary' size={30} direction='down' aria-label='Scroll down to About section' />
        </a>
      </div>
    </div>
  );
}
