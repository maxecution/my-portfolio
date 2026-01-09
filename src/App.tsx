import { ThemeProvider } from '@contexts/ThemeProvider/ThemeProvider';
import { ToasterProvider } from '@contexts/toasterProvider/ToasterProvider';
import Section from '@layout/section/Section';
import NavBar from '@sections/navbar/NavBar';
import Hero from '@sections/hero/Hero';
import About from '@sections/about/About';
import Projects from '@sections/projects/Projects';
import Contact from '@sections/contact/Contact';
import Footer from '@sections/footer/Footer';
import Arrow from '@ui/arrow/Arrow';
import useScrollState from '@hooks/useScrollState';

function App() {
  const hasScrolled = useScrollState(650);
  return (
    <ThemeProvider>
      <ToasterProvider>
        <NavBar />
        <main className='min-h-screen'>
          <Section id='hero' ariaLabel='Hero' fullHeight>
            <Hero />
          </Section>
          <Section id='about' title='About Me'>
            <About />
          </Section>
          <Section id='projects' title='Projects'>
            <Projects />
          </Section>
          <Section id='contact' title='Contact'>
            <Contact />
          </Section>
        </main>
        <Footer />
        {hasScrolled && (
          <div aria-hidden={hasScrolled}>
            <a
              href='#'
              className='fixed bottom-3 right-3 md:bottom-10 md:right-10 border-2 border-primary/50 bg-background rounded-full p-1 transition-transform hover:-translate-y-1 motion-reduce:transform-none'>
              <Arrow className='text-primary/80' direction='up' />
            </a>
          </div>
        )}
      </ToasterProvider>
    </ThemeProvider>
  );
}

export default App;
