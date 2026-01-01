import React from 'react';
import cn from '@utils/cn';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div className={cn('bg-card border-2 border-primary/30 rounded-lg p-8 relative', className)} {...rest}>
      {/* Top-left */}
      <div
        className='absolute -top-0.5 -left-0.5 w-6 h-6 
                  border-t-2 border-l-2 border-primary 
                  rounded-tl-sm bg-card z-10'
      />
      {/* Top-right */}
      <div
        className='absolute -top-0.5 -right-0.5 w-6 h-6 
                  border-t-2 border-r-2 border-primary 
                  rounded-tr-sm bg-card z-10'
      />
      {/* Bottom-left */}
      <div
        className='absolute -bottom-0.5 -left-0.5 w-6 h-6 
                  border-b-2 border-l-2 border-primary 
                  rounded-bl-sm bg-card z-10'
      />
      {/* Bottom-right */}
      <div
        className='absolute -bottom-0.5 -right-0.5 w-6 h-6 
                  border-b-2 border-r-2 border-primary 
                  rounded-br-sm bg-card z-10'
      />
      <div className='relative z-0'>{children}</div>
    </div>
  );
}
