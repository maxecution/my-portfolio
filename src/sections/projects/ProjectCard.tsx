import { useState, useRef, useEffect } from 'react';
import type { ProjectCardDetails } from '@data/projects/Projects.data';
import DifficultyBadge from './DifficultyBadge';
import ProjectCardTechStack from './ProjectCardTechStack';
import getScreenshot from '@utils/getScreenshot';

export default function ProjectCard({
  title,
  description,
  techStack,
  githubUrl,
  liveUrl,
  difficulty,
}: ProjectCardDetails) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);
  return (
    <div className='shrink-0 relative' ref={cardRef}>
      <div className='bg-card border-2 border-primary/30 rounded-lg h-120 flex flex-col min-h-0 group relative hover:scale-105 transition-transform'>
        <div className='absolute top-4 right-4 z-10'>
          <DifficultyBadge difficulty={difficulty} />
        </div>
        <div className='relative h-full bg-linear-to-br from-primary/20 via-secondary/20 to-primary/20 overflow-hidden'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <img
              src={getScreenshot(title)}
              onError={(e) => {
                e.currentTarget.src = '/projectScreenshots/placeholder-screenshot.png';
              }}
              alt={title + ' image'}
              className='object-cover object-top h-full w-full rounded-lg'
            />
          </div>
          <div className='absolute inset-0 bg-linear-to-t from-card to-transparent'></div>
        </div>
        <div className='p-6 flex-1 flex flex-col'>
          <h3 className='text-xl mb-3 group-hover:text-primary'>{title}</h3>
          <p className='text-sm text-muted-foreground mb-4'>{description}</p>
          <ProjectCardTechStack
            techStack={techStack}
            isModalOpen={isModalOpen}
            onModalOpen={() => setIsModalOpen(true)}
            onModalClose={() => setIsModalOpen(false)}
          />
          <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-primary/20 mt-auto'>
            <a
              href={githubUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-primary/30 rounded-lg hover:bg-primary/10 group/link'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='group-hover/link:scale-110 transition-transform'
                aria-hidden='true'
                focusable='false'>
                <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'></path>
                <path d='M9 18c-4.51 2-5-2-7-2'></path>
              </svg>
              <span>Code</span>
            </a>
            <a
              href={liveUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-button text-foreground rounded-lg hover:bg-button/90 group/link'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='group-hover/link:scale-110 transition-transform'
                aria-hidden='true'>
                <path d='M15 3h6v6'></path>
                <path d='M10 14 21 3'></path>
                <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
              </svg>
              <span>Live</span>
            </a>
          </div>
        </div>
        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
          <div className='absolute inset-0 bg-linear-to-t from-primary/5 to-transparent'></div>
        </div>
      </div>
    </div>
  );
}
