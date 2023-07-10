import './styles/Navbar.css';
import { BsMoonStars, BsMoonStarsFill } from 'react-icons/bs';

export const Navbar: React.FC = () => {
  return (
    <header id='nav'>
      <h1 className='nav-link'>About</h1>
      <h1 className='nav-link'>Projects</h1>
      <h1 className='nav-link'>Contact</h1>
      <div id='darkmode-icons-container'>
        <BsMoonStars className='darkmode-icon' />
        <BsMoonStarsFill className='darkmode-icon on' />
      </div>
    </header>
  );
}