import { type QuickInfoCard } from '@/data/contact/Contact.data';
export default function ContactQuickInfoCard({ icon, title, info }: QuickInfoCard) {
  return (
    <div className='bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-6'>
      <div>
        <div className='flex items-center gap-2 mb-2'>
          {icon}
          <h4 className='text-center'>{title}</h4>
        </div>
        <p className='text-sm text-muted-foreground text-start'>{info}</p>
      </div>
    </div>
  );
}
