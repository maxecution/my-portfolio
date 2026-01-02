import { useState } from 'react';
import Card from '@shared/card/Card';
import FormField from './FormField';
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // TODO: form submission logic here
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    console.log('Form submitted!' + JSON.stringify(formData));

    setIsSubmitting(false);
    setHasSubmitted(true);

    setTimeout(() => setHasSubmitted(false), 1500);

    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className='h-full'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <FormField
          id='name'
          label='Your Name'
          type='text'
          placeholder='Enter your name'
          value={formData.name}
          onChange={handleChange}
        />
        <FormField
          id='email'
          label='Your Email'
          type='email'
          placeholder='your.email@example.com'
          value={formData.email}
          onChange={handleChange}
        />
        <FormField
          id='message'
          label='Your message'
          type='textarea'
          placeholder='Tell me about your quest'
          value={formData.message}
          onChange={handleChange}
        />
        <button
          type='submit'
          disabled={isSubmitting}
          className={`relative overflow-hidden w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed group`}>
          <span
            aria-hidden='true'
            className={`${
              hasSubmitted ? 'bg-green-500' : ''
            } absolute inset-0 origin-left transform transition-transform z-0`}
          />
          {isSubmitting ? (
            <span className='relative z-10'>Sending...</span>
          ) : hasSubmitted ? (
            <span className='relative z-10'>Sent!</span>
          ) : (
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
          )}
        </button>
      </form>
    </Card>
  );
}
