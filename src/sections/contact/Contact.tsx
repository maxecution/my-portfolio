import SectionFade from '@shared/sectionFade/SectionFade';
import ContactForm from './ContactForm';
import ContactLinks from './ContactLinks';
import { contactIntro } from '@data/contact/Contact.data';
export default function Contact() {
  return (
    <>
      <SectionFade delay={0.1}>
        <p className='text-muted-foreground max-w-2xl mx-auto mb-12'>{contactIntro.sectionHeader}</p>
      </SectionFade>
      <div className='grid md:grid-cols-2 gap-6 lg:max-w-3/4 xl:max-w-2/3 mx-auto w-full'>
        <SectionFade delay={0.3} direction='left-right'>
          <ContactForm />
        </SectionFade>
        <SectionFade delay={0.3} direction='right-left'>
          <ContactLinks />
        </SectionFade>
      </div>
    </>
  );
}
