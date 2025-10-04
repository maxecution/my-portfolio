import "./styles/global.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";

// Component for testing theme functionality
function DarkThemeTester() {
  const { toggleTheme, actualTheme, theme, setTheme } = useTheme();

  return (
    <>
      <h1 className='text-3xl font-bold underline text-black dark:text-white'>Hello world!</h1>
      <p className='text-black dark:text-white'>Current theme: {actualTheme}</p>
      <button
        className='bg-blue-500 dark:bg-blue-100 text-white dark:text-black p-2 rounded'
        onClick={toggleTheme}>
        Toggle Theme
      </button>
      <div className='flex gap-2'>
        <button
          onClick={() => setTheme("light")}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            theme === "light"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}>
          ☀️ Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}>
          🌙 Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            theme === "system"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}>
          🖥️ System
        </button>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4 gap-4'>
        <DarkThemeTester />
      </div>
    </ThemeProvider>
  );
}

export default App;
