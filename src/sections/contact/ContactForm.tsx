import { useState, useMemo } from 'react';
import { privacyPolicy } from '@data/page/Page.data';
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

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const [status, setStatus] = useState<SubmitStatus>('idle');
  const isIdle = status === 'idle';

  function getErrors(data: FormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.name.trim()) errors.name = 'You must give a name.';
    if (!data.email.trim()) errors.email = 'Needed to send word back.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'The runes look wrong.';
    if (!data.message.trim()) errors.message = 'Share your message.';

    return errors;
  }

  const errors = useMemo(() => getErrors(formData), [formData]);
  const isFormValid = Object.keys(errors).length === 0;
  const isSubmitDisabled = !isIdle || !isFormValid;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || !isIdle) {
      setTouched({
        name: true,
        email: true,
        subject: touched.subject,
        message: true,
      });

      const firstInvalid = (['name', 'email', 'message'] as const).find((k) => errors[k]);
      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }

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
      setTouched({ name: false, email: false, subject: false, message: false });
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const buttonLabel =
    status === 'submitting'
      ? 'Sending...'
      : status === 'success'
      ? 'Sent!'
      : status === 'error'
      ? 'Failed - try again!'
      : isIdle && isSubmitDisabled
      ? 'Prepare Sending'
      : 'Cast Sending';

  const baseBtnClass =
    'relative overflow-hidden w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-color cursor-pointer disabled:cursor-not-allowed group text-background';
  const activeColorClass = status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-secondary' : 'bg-primary';
  const disabledIdleClass = 'bg-gray-300 text-gray-600'; // safe Tailwind fallback
  const btnClass = `${baseBtnClass} ${isIdle && isSubmitDisabled ? disabledIdleClass : activeColorClass}`;

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
          onBlur={handleBlur}
          error={touched.name ? errors.name : undefined}
        />
        <FormField
          id='email'
          label='Your Email'
          type='email'
          placeholder='your.email@example.com'
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
        />
        <FormField
          id='subject'
          label='Subject'
          type='text'
          placeholder='State your purpose...'
          value={formData.subject || ''}
          required={false}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormField
          id='message'
          label='Your message'
          type='textarea'
          placeholder='What brings you to this crossroads?'
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.message ? errors.message : undefined}
        />
        <button type='submit' disabled={isSubmitDisabled} className={btnClass}>
          <div
            data-testid='submit-progress-fill'
            aria-hidden='true'
            className={`absolute inset-y-0 left-0 bg-primary-400 ${
              status === 'submitting' ? 'w-full duration-2000' : 'w-0'
            }`}
          />
          <span className='relative z-10 flex items-center gap-2'>
            {buttonLabel === 'Cast Sending' && (
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
                  className='group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'
                  aria-hidden='true'
                  focusable='false'>
                  <path d='M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z' />
                  <path d='m21.854 2.147-10.94 10.939' />
                </svg>
              </>
            )}
            <span>{buttonLabel}</span>
            <span className='sr-only' aria-live='polite'>
              {status === 'submitting'
                ? 'Sending message'
                : status === 'error'
                ? 'Failed to send message'
                : status === 'success'
                ? 'Message sent'
                : isIdle && isSubmitDisabled
                ? 'Form incomplete'
                : ''}
            </span>
          </span>
        </button>
        <div className='text-xs text-muted-foreground'>
          By submitting this form, you agree to our{' '}
          <Modal className='underline' title={privacyPolicy.title} content={privacyPolicy.content}>
            Privacy Policy
          </Modal>
        </div>
      </form>
    </Card>
  );
}
