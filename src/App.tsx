import "./styles/global.css";
import { ThemeProvider } from "@contexts/ThemeProvider/ThemeProvider";
import Section from "@layout/section/Section";
import NavBar from "@sections/navbar/NavBar";

// Component for testing sections
function LoremIpsum() {
  return (
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ullamcorper mauris vel urna
      pellentesque rutrum. Sed leo dolor, vestibulum a finibus eu, auctor sit amet nunc. Integer
      tempor molestie enim, at pellentesque ante efficitur a. Nunc eu fringilla metus, a vulputate
      quam. Mauris pellentesque nunc vel malesuada placerat. In sed nibh vulputate, accumsan tellus
      in, porttitor elit. Aenean volutpat magna at magna porttitor tristique. Mauris dignissim
      sapien vel nulla sodales, eu convallis odio convallis. Aenean hendrerit fringilla vestibulum.
      Ut non imperdiet diam. Fusce eu egestas libero. Sed hendrerit, mauris vel pretium posuere,
      ante erat varius orci, eget cursus ipsum arcu eu nunc.
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className='bg-white text-black dark:bg-black dark:text-white'>
        <NavBar />
        <main className='min-h-screen'>
          <Section id='hero' ariaLabel='Hero' fullHeight>
            <LoremIpsum />
          </Section>
          <Section id='about' title='About Me' fullHeight>
            <LoremIpsum />
          </Section>
          <Section id='projects' title='Projects' fullHeight>
            <LoremIpsum />
          </Section>
          <Section id='contact' title='Contact' fullHeight>
            <LoremIpsum />
          </Section>
        </main>
        Footer
      </div>
    </ThemeProvider>
  );
}

export default App;
