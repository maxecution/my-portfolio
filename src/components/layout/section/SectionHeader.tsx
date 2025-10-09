interface SectionHeaderProps {
  id?: string;
  children: string;
}

export default function SectionHeader({ id, children }: SectionHeaderProps) {
  return (
    <h2 id={id} className='text-2xl font-bold mb-10 text-left'>
      {children}
    </h2>
  );
}
