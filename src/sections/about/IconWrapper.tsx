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
    <div style={{ width: size, height: size }} className={className}>
      {children}
    </div>
  );
}
