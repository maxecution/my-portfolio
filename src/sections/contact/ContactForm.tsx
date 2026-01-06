import { useState } from 'react';
import { privacyNotice } from '@data/page/Page.data';
import Card from '@shared/card/Card';
import FormField from './FormField';
import Modal from '@shared/modal/Modal';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const isIdle = status === 'idle';
  const isSubmitDisabled = !isIdle || !isFormValid(formData);

  function isFormValid(data: FormData): boolean {
    return (
      data.name.trim().length > 0 &&
      data.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
      data.message.trim().length > 0
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid(formData) || !isIdle) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error || 'Failed to send');
      }
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 1500);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
          id='subject'
          label='Subject'
          type='text'
          placeholder='State your purpose...'
          value={formData.subject || ''}
          required={false}
          onChange={handleChange}
        />
        <FormField
          id='message'
          label='Your message'
          type='textarea'
          placeholder='What brings you to this crossroads?'
          value={formData.message}
          onChange={handleChange}
        />
        <button
          type='submit'
          disabled={isSubmitDisabled}
          className={`relative overflow-hidden w-full flex items-center justify-center gap-2 px-6 py-3 ${
            status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-secondary' : 'bg-primary'
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
            ) : status === 'error' ? (
              'Failed - try again!'
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
              {status === 'submitting'
                ? 'Sending message'
                : status === 'error'
                ? 'Failed to send message'
                : status === 'success'
                ? 'Message sent'
                : ''}
            </span>
          </span>
        </button>
        <div className='text-xs text-muted-foreground'>
          By submitting this form, you agree to our{' '}
          <Modal className='underline' title={privacyNotice.title} content={privacyNotice.content}>
            Privacy Policy
          </Modal>
        </div>
      </form>
    </Card>
  );
}
