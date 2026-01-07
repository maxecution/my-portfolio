import { render } from '@testing-library/react';
import { useToast } from './useToast';

function TestComponent() {
  useToast();
  return null;
}

describe('useToast', () => {
  test('throws if used outside ToasterProvider', () => {
    expect(() => render(<TestComponent />)).toThrow('useToast must be used within ToasterProvider');
  });
});
