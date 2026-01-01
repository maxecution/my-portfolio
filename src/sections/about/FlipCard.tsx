import cn from '@/utils/cn';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
  onClick: () => void;
  delay?: number;
  sectionVisible: boolean;
  className?: string;
}

export default function FlipCard({
  front,
  back,
  flipped,
  onClick,
  delay = 0,
  sectionVisible,
  className = '',
}: FlipCardProps) {
  return (
    // Wrapper handles entrance animation with delay
    <div
      style={{ transitionDelay: sectionVisible ? `${delay}s` : '0s' }}
      className={cn(
        'transition-opacity duration-700 opacity-0 translate-y-5',
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        className
      )}
      aria-hidden={!sectionVisible}>
      {/* Inner div handles hover scaling separately */}
      <div className='h-64 relative w-full perspective-[1000px] hover:scale-105 transition-transform duration-300'>
        <button
          className={cn(
            'relative w-full h-full transform-3d transition-transform duration-700',
            flipped && 'transform-[rotateY(180deg)]'
          )}
          onClick={onClick}
          tabIndex={sectionVisible ? 0 : -1}>
          {/* Front */}
          <div className='absolute inset-0 backface-hidden cursor-pointer' aria-hidden={flipped}>
            {front}
          </div>

          {/* Back */}
          <div
            className='absolute inset-0 transform-[rotateY(180deg)] backface-hidden cursor-pointer'
            aria-hidden={!flipped}>
            {back}
          </div>
        </button>
      </div>
    </div>
  );
}
