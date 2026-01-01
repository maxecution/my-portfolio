import Card from '@shared/card/Card';
import { socialLinks } from '@data/contact/Contact.data';
export default function ContactLinks() {
  return (
    <>
      <Card className='h-full'>
        <h3 className='text-2xl mb-4'>Connect With Me</h3>
        <p className='text-muted-foreground mb-6'>
          If the sending stone isn't your style, here are other ways to connect.
        </p>

        <div className='space-y-4'>
          {socialLinks.map((link) => {
            return (
              <a
                key={link.name}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className={`flex items-center gap-4 p-4 bg-background border border-primary/20 rounded-lg hover:border-primary/50 hover:translate-x-2 transition-transform group ${link.color}`}>
                <div className='w-10 h-10 rounded-full bg-primary/10 flex shrink-0 items-center justify-center group-hover:bg-primary/20'>
                  {link.icon}
                </div>
                <div className='min-w-0'>
                  <div className='text-start group-hover:text-primary'>{link.name}</div>
                  <div className='text-sm text-muted-foreground truncate block'>{link.handle}</div>
                </div>
              </a>
            );
          })}
        </div>
      </Card>
    </>
  );
}
