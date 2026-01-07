import { authorData } from '@data/page/Page.data';
import { crossedSwords, gamePad } from '@ui/icons/Icons';
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='relative py-8 px-4 sm:px-6 lg:px-8'>
      <div className='absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent' />

      <div className='mx-auto'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='flex items-center gap-4 text-primary/40'>
            <span className='text-2xl'>{crossedSwords}</span>
            <span className='text-xl'>{gamePad}</span>
            <span className='text-2xl'>{crossedSwords}</span>
          </div>

          <p className='text-center text-muted-foreground inline-flex gap-1'>
            © {currentYear} Created by {authorData.firstName}, with{' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-secondary animate-pulse'>
              <path d='M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5' />
            </svg>{' '}
            and{' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-primary'>
              <path d='M10 2v2' />
              <path d='M14 2v2' />
              <path d='M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1' />
              <path d='M6 2v2' />
            </svg>
          </p>

          <p className='text-xs text-muted-foreground text-center italic'>
            "Every great app begins with a single line of code"
          </p>

          <div className='flex gap-6 text-primary/20 text-sm'>
            {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ'].map((rune, index) => (
              <span key={rune} className='animate-rune' style={{ animationDelay: `${index * 0.3}s` }}>
                {rune}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
