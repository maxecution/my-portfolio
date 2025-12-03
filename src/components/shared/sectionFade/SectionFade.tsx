import { useEffect, useRef, useState } from 'react';
import cn from '@/utils/cn';

interface SectionFadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function SectionFade({ children, delay = 0, className = '' }: SectionFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${visible ? delay : 0}s` }}
      className={cn(
        'transition-all duration-700 ease-out opacity-0 translate-y-5',
        visible && 'opacity-100 translate-y-0',
        className
      )}>
      {children}
    </div>
  );
}
