import cn from '@utils/cn';
export default function IconWrapper({
  children,
  size,
  className = '',
}: {
  children: React.ReactNode;
  size: number;
  className?: string;
}) {
  return (
    <div style={{ width: size, height: size }} className={cn('', className)}>
      {children}
    </div>
  );
}
