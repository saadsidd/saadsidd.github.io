import './styles/MainContent.css';
import { ProjectCard } from './ProjectCard';

export const MainContent: React.FC = () => {
  return (
    <div id='main-content-container'>
      <ProjectCard />
    </div>
  );
}