import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import cn from '@utils/cn';

interface ModalProps {
  title?: string;
  content: React.ReactNode;
  children: React.ReactNode;

  className?: string;
}

export default function Modal({ title, content, className = '', children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    wasOpen.current = true;
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  // Lock body scroll and trap focus while modal is open
  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current) {
        triggerRef.current?.focus();
      }
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusableSelectors = 'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelectors);
    focusableElements?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }

      if (e.key === 'Tab' && focusableElements && focusableElements.length > 0) {
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button ref={triggerRef} onClick={openModal} className={cn('inline-block cursor-pointer', className)}>
        {children}
      </button>

      {isOpen &&
        createPortal(
          <div className='fixed inset-0 z-9999 flex items-center justify-center'>
            <div className='absolute inset-0 bg-background/70 backdrop-blur-sm' />
            <div
              ref={modalRef}
              className='relative z-10 w-full max-h-2/3 max-w-2/3 md:max-w-2xl bg-card border-2 border-primary/30 rounded-xl shadow-lg flex flex-col'
              role='dialog'
              aria-modal='true'
              aria-labelledby='modal-title'>
              <div className='flex items-center justify-between p-6 border-b border-primary/20 shrink-0'>
                <h2 id='modal-title' className='text-lg font-semibold'>
                  {title}
                </h2>
                <button
                  onClick={closeModal}
                  className='p-2 rounded-lg hover:bg-primary/10 transition-colors'
                  aria-label='Close modal'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    aria-hidden='true'
                    focusable='false'>
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </button>
              </div>

              <div className='p-6 overflow-y-auto flex-1' role='document'>
                {content}
              </div>

              <div className='p-6 border-t border-primary/20 flex justify-center shrink-0'>
                <button
                  onClick={closeModal}
                  className='px-6 py-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors'>
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
