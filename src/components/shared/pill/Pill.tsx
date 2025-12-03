import React from 'react';
import cn from '@utils/cn';
export default function Pill({
  children,
  bg,
  text,
  border,
  className,
}: {
  children: React.ReactNode;
  bg?: string;
  text?: string;
  border?: string;
  className?: string;
}) {
  const style: React.CSSProperties = {};

  // Hex or raw colors
  if (bg && !bg.startsWith('bg-')) style.backgroundColor = bg;
  if (text && !text.startsWith('text-')) style.color = text;
  if (border && !border.startsWith('border-')) style.borderColor = border;

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full border',
        // Only include Tailwind color classes
        bg?.startsWith('bg-') && bg,
        text?.startsWith('text-') && text,
        border?.startsWith('border-') && border,
        className
      )}
      style={style}>
      {children}
    </span>
  );
}
