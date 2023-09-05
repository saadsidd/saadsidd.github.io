import './styles/Navbar.css';
import { PiSunFill } from 'react-icons/pi';
import { BiSolidMoon } from 'react-icons/bi';

type NavbarProps = {
  darkMode: string;
  setDarkMode: React.Dispatch<React.SetStateAction<string>>;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {

  return (
    <header className={`nav ${darkMode}`}>
      <h1 className={`nav-link ${darkMode}`}>ABOUT</h1>
      <h1 className={`nav-link ${darkMode}`}>PROJECTS</h1>
      <h1 className={`nav-link ${darkMode}`}>CONTACT</h1>

      <div id='darkmode-icons-container' onClick={() => setDarkMode((darkMode === '') ? 'dark' : '')}>
        {darkMode && <PiSunFill className={`darkmode-icon ${darkMode}`} />}
        {!darkMode && <BiSolidMoon className={`darkmode-icon ${darkMode}`} />}
      </div>
    </header>
  );
}