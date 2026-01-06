interface SectionHeaderProps {
  id?: string;
  children: string;
}

export default function SectionHeader({ id, children }: SectionHeaderProps) {
  return (
    <div>
      <div style={{ display: 'inline-block' }}>
        <h2 id={id} className='text-4xl sm:text-5xl mb-4 text-primary'>
          {children}
        </h2>
        {/* Divider that spans the title width */}
        <div className='w-full h-px bg-linear-to-r from-transparent via-primary-400 to-transparent relative mb-6'>
          <span
            aria-hidden='true'
            className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background text-primary px-3'>
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
              aria-hidden='true'
              focusable='false'>
              <polyline points='14.5 17.5 3 6 3 3 6 3 17.5 14.5' />
              <line x1='13' x2='19' y1='19' y2='13' />
              <line x1='16' x2='20' y1='16' y2='20' />
              <line x1='19' x2='21' y1='21' y2='19' />
              <polyline points='14.5 6.5 18 3 21 3 21 6 17.5 9.5' />
              <line x1='5' x2='9' y1='14' y2='18' />
              <line x1='7' x2='4' y1='17' y2='20' />
              <line x1='3' x2='5' y1='19' y2='21' />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
