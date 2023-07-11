import './App.css';
import { Navbar } from './components/Navbar';
import { ThreeCanvas } from './components/ThreeCanvas';
import { MainContent } from './components/MainContent';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <ThreeCanvas />
        <MainContent />
      </main>
    </>
  );
}

export default App;
