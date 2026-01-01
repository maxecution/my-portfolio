import { ThemeProvider } from '@contexts/ThemeProvider/ThemeProvider';
import Section from '@layout/section/Section';
import NavBar from '@sections/navbar/NavBar';
import Hero from '@sections/hero/Hero';
import About from '@sections/about/About';
import Projects from '@sections/projects/Projects';
import Contact from '@sections/contact/Contact';

function App() {
  return (
    <ThemeProvider>
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
      Footer
    </ThemeProvider>
  );
}

export default App;
