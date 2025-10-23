interface ArrowProps {
  direction: 'up' | 'down' | 'left' | 'right';
  className?: string;
  size?: number;
  'aria-label'?: string;
}

export default function Arrow({ direction, className = '', size = 24, 'aria-label': ariaLabel }: ArrowProps) {
  // Rotation angles for each direction
  const rotationMap = {
    up: '0',
    right: '90',
    down: '180',
    left: '270',
  };

  // Default aria-label based on direction
  const defaultAriaLabel = `Arrow pointing ${direction}`;

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`stroke-current ${className}`}
      style={{ transform: `rotate(${rotationMap[direction]}deg)` }}
      aria-label={ariaLabel || defaultAriaLabel}
      role='img'>
      <path d='m5 12 7-7 7 7' />
      <path d='M12 19V5' />
    </svg>
  );
}
