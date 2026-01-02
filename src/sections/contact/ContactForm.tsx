import { useState } from 'react';
import Card from '@shared/card/Card';
import FormField from './FormField';

type SubmitStatus = 'idle' | 'submitting' | 'success';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<SubmitStatus>('idle');
  const isSubmittingOrSuccess = status === 'submitting' || status === 'success';
  const isSubmitDisabled = isSubmittingOrSuccess || !isFormValid(formData);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid(formData) || status === 'submitting') {
      return;
    }

    setStatus('submitting');
    // TODO: form submission logic here
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    console.log('Form submitted!' + JSON.stringify(formData));

    setStatus('success');

    setTimeout(() => setStatus('idle'), 1500);

    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function isFormValid(data: FormData): boolean {
    return (
      data.name.trim().length > 0 &&
      data.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
      data.message.trim().length > 0
    );
  }

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
          disabled={isSubmitDisabled}
          className={`relative overflow-hidden w-full flex items-center justify-center gap-2 px-6 py-3 ${
            status === 'success' ? 'bg-green-500' : 'bg-primary'
          } text-background rounded-lg transition-color cursor-pointer disabled:cursor-not-allowed group`}>
          <div
            data-testid='submit-progress-fill'
            aria-hidden='true'
            className={`absolute inset-y-0 left-0 bg-primary-400 ${
              status === 'submitting' ? 'w-full duration-2000' : 'w-0'
            }`}
          />
          <span className='relative z-10 flex items-center gap-2'>
            {status === 'submitting' ? (
              'Sending...'
            ) : status === 'success' ? (
              'Sent!'
            ) : (
              <>
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
                  className={`${
                    !isSubmitDisabled ? 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' : ''
                  }`}
                  aria-hidden='true'
                  focusable='false'>
                  <path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z' />
                  <path d='m21.854 2.147-10.94 10.939' />
                </svg>
                <span>Cast Sending</span>
              </>
            )}
            <span className='sr-only' aria-live='polite'>
              {status === 'submitting' ? 'Sending message' : status === 'success' ? 'Message sent' : ''}
            </span>
          </span>
        </button>
      </form>
    </Card>
  );
}
