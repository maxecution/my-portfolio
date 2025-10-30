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
        <div className='w-full h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent relative mb-6'>
          <span
            aria-hidden='true'
            className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background text-primary px-3'>
            ⚔
          </span>
        </div>
      </div>
    </div>
  );
}
