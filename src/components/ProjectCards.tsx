import './styles/ProjectCard.css';
import { myProjects } from './helpers/Projects';
import { TechStack } from './TechStack';
import { BsGithub, BsPlayFill } from 'react-icons/bs';

console.log(myProjects);

export const ProjectCards: React.FC = () => {

  return (
    <div>
      {myProjects.map((project, index) => {
        return (
          <article className='project-container' key={index}>

            <div className='project-container-left'>
              <img className='project-image' alt={`Example screenshot of ${project.name}`} src={project.imageSource} />
              <button onClick={() => window.open(project.github, '_blank')}><BsGithub />&nbsp;&nbsp;Source</button>
              {project.liveLink && <button onClick={() => window.open(project.liveLink, '_blank')}><BsPlayFill />&nbsp;Live</button>}
            </div>

            <div className='project-container-right'>
              <h1 className='project-title'>{project.name}</h1>
              <p className='project-description'>{project.description}</p>
              <hr />
              <div>
                {project.techStack.map((tech, index) => <TechStack key={index} icon={tech.icon} name={tech.name} />)}
              </div>
            </div>

          </article>
        );
      })}
    </div>
  );
  
}