import { useRef } from 'react';
import useIsMobile from '@hooks/useIsMobile';
import { runes } from '@data/hero/Hero.data';

export function RunicBackground() {
  const isSmall = useIsMobile(768);
  const isMedium = useIsMobile(1024);
  const isLarge = useIsMobile(1440);

  // Determine rune count
  const count = isSmall ? 10 : isMedium ? 15 : isLarge ? 20 : 30;

  const runesRef = useRef<
    Array<{
      rune: string;
      top: number;
      left: number;
      duration: number;
      delay: number;
      size: number;
    }>
  >([]);

  if (runesRef.current.length === 0 || runesRef.current.length !== count) {
    runesRef.current = Array.from({ length: count }).map((_, index) => ({
      rune: runes[index % runes.length],
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * -20,
      size: 2.5 + Math.random() * 3,
    }));
  }

  return (
    <div className='absolute inset-0 pointer-events-none select-none -z-1' aria-hidden='true'>
      {runesRef.current.map((r, index) => (
        <span
          key={index}
          className='float-rune text-primary/30'
          style={{
            top: `${r.top}%`,
            left: `${r.left}%`,
            fontSize: `${r.size}rem`,
            animationDuration: `${r.duration}s`,
            animationDelay: `${r.delay}s`,
          }}>
          {r.rune}
        </span>
      ))}
    </div>
  );
}
