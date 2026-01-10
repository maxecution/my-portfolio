import { ThemeProvider } from '@contexts/ThemeProvider/ThemeProvider';
import { ToasterProvider } from '@contexts/toasterProvider/ToasterProvider';
import { Analytics } from '@vercel/analytics/react';
import Section from '@layout/section/Section';
import NavBar from '@sections/navbar/NavBar';
import { RunicBackground } from '@ui/runicBackground/RunicBackground';
import Hero from '@sections/hero/Hero';
import About from '@sections/about/About';
import Projects from '@sections/projects/Projects';
import Contact from '@sections/contact/Contact';
import Footer from '@sections/footer/Footer';

function App() {
  return (
    <ThemeProvider>
      <ToasterProvider>
        <NavBar />
        <main className='min-h-screen'>
          <Section id='hero' ariaLabel='Hero' fullHeight background={<RunicBackground />}>
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
        <Analytics />
      </ToasterProvider>
    </ThemeProvider>
  );
}

export default App;
