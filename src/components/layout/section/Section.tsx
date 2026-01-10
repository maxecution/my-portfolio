import { type ReactNode } from 'react';
import SectionHeader from './SectionHeader';

interface BaseSectionProps {
  id: string;
  fullHeight?: boolean;
  background?: ReactNode;
  children: ReactNode;
}

// Enforce that either title or ariaLabel (or both) is provided when using the Section component
type SectionProps = BaseSectionProps &
  ({ title: string; ariaLabel?: never } | { title?: never; ariaLabel: string } | { title: string; ariaLabel: string });

export default function Section({ id, title, fullHeight = false, ariaLabel, background, children }: SectionProps) {
  const headingId = title ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-label={!title ? ariaLabel : undefined}
      className={`relative w-full text-center ${
        fullHeight
          ? 'h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] xl:h-[calc(100vh-5rem)] 2xl:h-[calc(100vh-6rem)]'
          : 'py-20'
      }`}>
      {/* Full-bleed background layer */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none' aria-hidden='true'>
        {background}
      </div>

      {/* Padded content layer */}
      <div className='relative px-6 md:px-20 h-full'>
        <div className='mx-auto w-full h-full'>
          {title && <SectionHeader id={headingId}>{title}</SectionHeader>}
          <div className={`w-full ${fullHeight ? 'h-full' : 'h-auto'}`}>{children}</div>
        </div>

        {/* Divider */}
        <div className='flex justify-center py-8' role='separator' aria-hidden='true'>
          <div className='w-2/3 h-px bg-linear-to-r from-transparent via-primary-400 to-transparent' />
        </div>
      </div>
    </section>
  );
}
