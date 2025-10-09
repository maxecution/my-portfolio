import "./styles/global.css";
import { ThemeProvider } from "@contexts/ThemeProvider/ThemeProvider";
import { useTheme } from "@contexts/ThemeProvider/useTheme";
import Section from "@layout/section/Section";

// Component for testing theme functionality

function ExampleNavBar() {
  const { toggleTheme } = useTheme();

  return (
    <nav className='w-full p-4 bg-gray-200 dark:bg-gray-800 flex justify-between items-center'>
      <div className='text-xl font-bold'>My Portfolio</div>
      <button
        className='bg-blue-500 dark:bg-blue-100 text-white dark:text-black p-2 rounded'
        onClick={toggleTheme}>
        Toggle Theme
      </button>
    </nav>
  );
}
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
        <ExampleNavBar />
        <main className='min-h-screen'>
          <Section id='hero' fullHeight ariaLabel='Hero'>
            <LoremIpsum />
          </Section>
          <Section id='about' title='About Me'>
            <LoremIpsum />
          </Section>
          <Section id='projects' title='Projects'>
            <LoremIpsum />
          </Section>
          <Section id='contact' title='Contact'>
            <LoremIpsum />
          </Section>
        </main>
        Footer
      </div>
    </ThemeProvider>
  );
}

export default App;
