import { authorData } from '@data/page/Page.data';
import { crossedSwords, gamePad } from '@assets/icons/Icons';
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
            © {currentYear} {authorData.firstName + ' ' + authorData.lastName} | All rights reserved
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
