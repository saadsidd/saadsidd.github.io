import './styles/Navbar.css';
import { BsMoonStars, BsMoonStarsFill } from 'react-icons/bs';

export const Navbar: React.FC = () => {
  return (
    <header id="nav">
      <div className='nav-link'>About</div>
      <div className='nav-link'>Projects</div>
      <div className='nav-link'>Contact</div>
      <div id='darkmode-icons-container'>
        <BsMoonStars className='darkmode-icon' />
        <BsMoonStarsFill className='darkmode-icon on' />
      </div>
    </header>
  );
}