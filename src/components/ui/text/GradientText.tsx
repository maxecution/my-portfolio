import type { ReactNode } from 'react';

type GradientVariant = 'primary' | 'secondary' | 'accent' | 'spectrum';
interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: GradientVariant;
  customGradient?: string;
}

const gradients: Record<GradientVariant, string> = {
  primary: 'from-primary-600 via-primary-200 to-primary-600',
  secondary: 'from-secondary-600 via-secondary-200 to-secondary-600',
  accent: 'from-accent-600 via-accent-200 to-accent-600',
  spectrum: 'from-primary-500 via-accent-500 to-secondary-500',
};

export function GradientText({ children, className = '', variant = 'primary', customGradient }: GradientTextProps) {
  const gradientClass = customGradient || gradients[variant];

  return (
    <span
      className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent animate-gradient ${className}`}
      style={{
        backgroundSize: '400% auto',
      }}>
      {children}
    </span>
  );
}
