import Pill from '@shared/pill/Pill';

type ProjectDifficulty = {
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary' | 'Unknown';
};

export default function DifficultyBadge({ difficulty }: ProjectDifficulty) {
  const getBadgeProps = () => {
    switch (difficulty) {
      case 'Easy':
        return { text: 'Easy', textColor: 'text-green-700 dark:text-green-400' };
      case 'Medium':
        return { text: 'Medium', textColor: 'text-yellow-700 dark:text-yellow-400' };
      case 'Hard':
        return { text: 'Hard', textColor: 'text-red-700 dark:text-red-400' };
      case 'Legendary':
        return { text: 'Legendary', textColor: 'text-purple-700 dark:text-purple-400' };
      default:
        return { text: 'Unknown', textColor: 'text-gray-700 dark:text-gray-400' };
    }
  };

  const { text, textColor } = getBadgeProps();

  return (
    <Pill bg='bg-badge' text={textColor} border='border-primary/30' className='text-xs px-3 py-1 gap-1'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        focusable='false'>
        <path d='M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z'></path>
        <path d='M20 2v4'></path>
        <path d='M22 4h-4'></path>
        <circle cx='4' cy='20' r='2'></circle>
      </svg>
      {text}
    </Pill>
  );
}
