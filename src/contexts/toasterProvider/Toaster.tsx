import ToastItem from './ToastItem';
import type { Toast } from './ToastContext';

interface Props {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function Toaster({ toasts, onClose }: Props) {
  return (
    <div
      className='fixed top-4 left-1/2 z-9999 w-full max-w-md -translate-x-1/2 space-y-3 px-4'
      role='region'
      aria-live='polite'>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
