import type { ReactNode } from 'react';

type GradientVariant = 'primary' | 'secondary' | 'accent' | 'spectrum';
interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: GradientVariant;
  customGradient?: string;
}

const gradients: Record<GradientVariant, string> = {
  primary: 'from-primary-200 via-primary-600 to-primary-200',
  secondary: 'from-secondary-200 via-secondary-600 to-secondary-200',
  accent: 'from-accent-200 via-accent-600 to-accent-200',
  spectrum: 'from-primary-500 via-accent-500 to-secondary-500',
};

export function GradientText({ children, className = '', variant = 'primary', customGradient }: GradientTextProps) {
  const gradientClass = customGradient || gradients[variant];

  return (
    <span
      className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent animate-gradient ${className}`}
      style={{
        backgroundSize: '200% auto',
      }}>
      {children}
    </span>
  );
}
