import { type ReactNode } from 'react';
import SectionHeader from './SectionHeader';

interface BaseSectionProps {
  id: string;
  fullHeight?: boolean;
  children: ReactNode;
}

// Enforce that either title or ariaLabel (or both) is provided when using the Section component
type SectionProps = BaseSectionProps &
  ({ title: string; ariaLabel?: never } | { title?: never; ariaLabel: string } | { title: string; ariaLabel: string });

export default function Section({ id, title, fullHeight = false, ariaLabel, children }: SectionProps) {
  const headingId = title ? `${id}-heading` : undefined;

  return (
    <>
      <section
        id={`${id}`}
        aria-labelledby={headingId}
        aria-label={!title ? ariaLabel : undefined}
        className={`w-full ${fullHeight ? 'min-h-screen flex items-start' : 'py-20'} px-6 md:px-20`}>
        <div className='mx-auto w-full pl-5'>
          {title && <SectionHeader id={headingId}>{title}</SectionHeader>}
          {children}
        </div>
      </section>
      {/* Divider line at the bottom of section */}
      <div className='flex justify-center py-8' role='separator' aria-hidden='true'>
        <div className='w-2/3 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent dark:from-transparent dark:via-primary-500 dark:to-transparent' />
      </div>
    </>
  );
}
