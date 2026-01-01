import { useEffect, useRef, useState } from 'react';
import cn from '@/utils/cn';
import useIsMobile from '@hooks/useIsMobile';

type FadeDirection = 'bottom-up' | 'top-down' | 'left-right' | 'right-left' | 'none';

interface SectionFadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: FadeDirection;
  fadeOut?: boolean;
}

const directionClasses: Record<FadeDirection, { initial: string; visible: string }> = {
  'bottom-up': { initial: 'translate-y-5', visible: 'translate-y-0' },
  'top-down': { initial: '-translate-y-5', visible: 'translate-y-0' },
  'left-right': { initial: '-translate-x-5', visible: 'translate-x-0' },
  'right-left': { initial: 'translate-x-5', visible: 'translate-x-0' },
  none: { initial: '', visible: '' },
};

export default function SectionFade({
  children,
  delay = 0,
  className = '',
  direction = 'bottom-up',
  fadeOut = true,
}: SectionFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current!;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else if (fadeOut && !isMobile) {
          setVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fadeOut, isMobile]);

  const classes = directionClasses[direction];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${visible ? delay : 0}s` }}
      className={cn(
        'transition-all duration-700 ease-out opacity-0 min-w-0',
        classes.initial,
        visible && 'opacity-100',
        visible && classes.visible,
        className
      )}>
      {children}
    </div>
  );
}
