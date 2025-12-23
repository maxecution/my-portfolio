import { useState, useRef, useEffect } from 'react';
import Pill from '@shared/pill/Pill';

interface ProjectCardTechStackProps {
  techStack: string[];
  isModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
}

export default function ProjectCardTechStack({
  techStack,
  isModalOpen,
  onModalOpen,
  onModalClose,
}: ProjectCardTechStackProps) {
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setHasOverflow(container.scrollHeight > container.clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [techStack]);

  return (
    <>
      <div className='relative h-16 mb-4'>
        <div ref={containerRef} className='flex flex-wrap gap-2 max-h-16 overflow-hidden'>
          {techStack.map((tech, index) => (
            <Pill key={index} bg='bg-primary/10' text='text-primary' border='border-primary/30' className='text-xs'>
              {tech}
            </Pill>
          ))}
        </div>
        {hasOverflow && (
          <button
            className='absolute bottom-0 right-0 flex items-center gap-1 px-2 py-1 bg-background/95 backdrop-blur-sm rounded-full border border-primary/30 cursor-pointer hover:bg-primary/10 transition-colors'
            onClick={onModalOpen}
            aria-label='Show all technologies'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-muted-foreground'>
              <circle cx='12' cy='12' r='1'></circle>
              <circle cx='19' cy='12' r='1'></circle>
              <circle cx='5' cy='12' r='1'></circle>
            </svg>
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='absolute inset-0 z-50 bg-card border-2 border-primary/30 rounded-lg flex flex-col'>
          <div className='p-6 flex flex-col h-full' onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className='flex items-center justify-between mb-4 flex-shrink-0'>
              <h3 className='text-lg font-semibold'>Tech Stack</h3>
              <button
                onClick={onModalClose}
                className='p-1 rounded-lg hover:bg-primary/10 transition-colors'
                aria-label='Close modal'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <path d='M18 6 6 18'></path>
                  <path d='m6 6 12 12'></path>
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className='overflow-y-auto flex-1'>
              <div className='flex flex-wrap gap-2'>
                {techStack.map((tech, index) => (
                  <Pill
                    key={index}
                    bg='bg-primary/10'
                    text='text-primary'
                    border='border-primary/30'
                    className='text-sm'>
                    {tech}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
