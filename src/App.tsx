import './App.css';
import { Navbar } from './components/Navbar';
import { ThreeCanvas } from './components/ThreeCanvas';
import { MainContent } from './components/MainContent';
import { useEffect, useState } from 'react';


const App: React.FC = () => {

  const [darkMode, setDarkMode] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <ThreeCanvas darkMode={darkMode} />
        <MainContent />
      </main>
    </>
  );
}

export default App;
