import { useState, useEffect } from 'react';
import type { Toast } from './ToastContext';
import { crossX } from '@ui/icons/Icons';

const styles = {
  success: 'bg-green-50 border-green-400 text-green-900',
  info: 'bg-blue-50 border-blue-400 text-blue-900',
  warning: 'bg-amber-50 border-amber-400 text-amber-900',
  error: 'bg-red-50 border-red-400 text-red-900',
};

const icons = {
  success: (
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
      aria-hidden='true'
      focusable='false'
      className='shrink-0'>
      <path d='M21.801 10A10 10 0 1 1 17 3.335' />
      <path d='m9 11 3 3L22 4' />
    </svg>
  ),
  info: (
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
      aria-hidden='true'
      focusable='false'
      className='shrink-0'>
      <circle cx='12' cy='12' r='10' />
      <path d='M12 16v-4' />
      <path d='M12 8h.01' />
    </svg>
  ),
  warning: (
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
      aria-hidden='true'
      focusable='false'
      className='shrink-0'>
      <path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' />
      <path d='M12 9v4' />
      <path d='M12 17h.01' />
    </svg>
  ),
  error: (
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
      aria-hidden='true'
      focusable='false'
      className='shrink-0'>
      <path d='m15 9-6 6' />
      <path d='M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z' />
      <path d='m9 9 6 6' />
    </svg>
  ),
};

export default function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 10;
    const decrement = (interval / toast.duration) * 100;

    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(id);
  }, [toast.duration]);

  return (
    <div className={`relative rounded-lg border-2 px-4 py-3 shadow-md ${styles[toast.level]}`}>
      <button
        onClick={() => onClose(toast.id)}
        className='absolute right-2 top-2 text-current opacity-70 hover:opacity-100'
        aria-label='Dismiss notification'>
        {crossX}
      </button>
      <p className='pr-6 text-sm leading-relaxed flex flex-row gap-2'>
        {icons[toast.level]}
        {toast.message}
      </p>
      <div
        className='absolute bottom-0 left-0 h-1 bg-current rounded-b'
        style={{ width: `${progress}%` }}
        data-testid='toast-progress-bar'
      />
    </div>
  );
}
