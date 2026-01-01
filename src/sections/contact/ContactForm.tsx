import Card from '@shared/card/Card';
export default function ContactForm() {
  return (
    <Card className='h-full'>
      <form className='space-y-6'>
        <div>
          <div>
            <label htmlFor='name' className='block text-sm mb-2 text-start text-foreground'>
              Your Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              required
              className='w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder-muted-foreground'
              placeholder='Enter your name'
            />
          </div>
        </div>
        <div>
          <label htmlFor='email' className='block text-sm mb-2 text-start text-foreground'>
            Your Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            required
            className='w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder-muted-foreground'
            placeholder='your.email@example.com'
          />
        </div>
        <div>
          <label htmlFor='message' className='block text-sm mb-2 text-start text-foreground'>
            Your Message
          </label>
          <textarea
            id='message'
            name='message'
            required
            rows={5}
            className='w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-foreground placeholder-muted-foreground'
            placeholder='Tell me about your quest...'
          />
        </div>
        <button
          type='submit'
          disabled={false}
          className='relative overflow-hidden w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group'>
          <span
            aria-hidden='true'
            className='bg-button absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 z-0'
          />
          <span className='relative z-10 flex items-center gap-2'>
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
              className='group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'>
              <path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z' />
              <path d='m21.854 2.147-10.94 10.939' />
            </svg>
            <span>Cast Sending</span>
          </span>
        </button>
      </form>
    </Card>
  );
}
