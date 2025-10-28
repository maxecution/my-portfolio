import { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenPhrases?: number;
}

export default function TypewriterEffect({
  phrases = [],
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenPhrases = 2000,
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentWordIndex] || '';

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, delayBetweenPhrases);
      return () => clearTimeout(pauseTimeout);
    }

    if (!isDeleting && currentText === currentPhrase) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setCurrentText((prev) => {
          if (isDeleting) {
            return currentPhrase.substring(0, prev.length - 1);
          } else {
            return currentPhrase.substring(0, prev.length + 1);
          }
        });
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentWordIndex, phrases, typingSpeed, deletingSpeed, delayBetweenPhrases]);

  return (
    <div className={`items-center justify-center flex`}>
      <span className='sr-only'>Typewriter effect: {phrases.join(', ')}</span>
      {/* added no break space to maintain parent span height when going between phrases */}
      <span aria-hidden='true'>{currentText || '\u00A0'}</span>
      <span aria-hidden='true' className='animate-cursor-blink inline-block w-0.5 h-4 bg-text ml-0.5 align-middle' />
    </div>
  );
}
