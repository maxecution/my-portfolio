import { ToastContext } from './ToastContext';
import { render } from '@testing-library/react';

export const mockToast = jest.fn();
export function renderWithToasterProvider(ui: React.ReactElement) {
  return render(<ToastContext.Provider value={{ toast: mockToast }}>{ui}</ToastContext.Provider>);
}
