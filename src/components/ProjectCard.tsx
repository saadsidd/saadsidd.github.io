import './styles/ProjectCard.css';
import { BsGithub, BsPlayFill } from 'react-icons/bs';

interface Project {
  imageSource: string;
  sourceLink: string;
  liveLink?: string;
  
  title: string;
  description: string;
  techStack: string;
}

export const ProjectCard: React.FC = () => {
  return (
    <article className='project-container'>

      <div className='project-container-left'>
        <img className='project-image' alt='Example of Bookd Up homepage' src='./images/macbook-render.png' />
        <button><BsGithub />&nbsp;&nbsp;Source</button>
        <button><BsPlayFill />&nbsp;Live</button>
      </div>

      <div className='project-container-right'>
        <h1 className='project-title'>BOOK'D UP</h1>
        <p className='project-description'>A web application that allows users to create and join bookclubs, as well as curate their personal bookshelves.</p>
        <p>Tech stack: React, Node, Express, SASS, PostgreSQL</p>
      </div>

    </article>
  );
}