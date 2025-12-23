import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DifficultyBadge from './DifficultyBadge';

describe('DifficultyBadge', () => {
  const difficultyMap = {
    Easy: 'text-green-700 dark:text-green-400',
    Medium: 'text-yellow-700 dark:text-yellow-400',
    Hard: 'text-red-700 dark:text-red-400',
    Legendary: 'text-purple-700 dark:text-purple-400',
    Unknown: 'text-gray-700 dark:text-gray-400',
  } as const;

  type Difficulty = keyof typeof difficultyMap;

  const values: Difficulty[] = Object.keys(difficultyMap) as Difficulty[];

  test.each(values)('renders %s correctly with the proper color', (val) => {
    render(<DifficultyBadge difficulty={val} />);

    const badge = screen.getByText(val);

    expect(badge).toBeVisible();

    expect(badge).toHaveClass(difficultyMap[val] + ' bg-badge border-primary/30 text-xs px-3 py-1 gap-1');
  });
});
