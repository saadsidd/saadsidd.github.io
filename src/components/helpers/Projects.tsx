import { BiLogoReact, BiLogoTypescript, BiLogoJavascript, BiLogoCss3, BiLogoHtml5, BiLogoNodejs, BiLogoPostgresql, BiLogoBlender } from "react-icons/bi";
import { TbBrandThreejs } from "react-icons/tb";
import { SiExpress, SiBootstrap, SiTwilio, SiAxios } from "react-icons/si";
import { BsFiletypeScss } from "react-icons/bs";

interface ITechStack {
  icon: JSX.Element;
  name: string;
};

interface IProject {
  name: string;
  description: string;
  techStack: ITechStack[];
  imageSource: string;
  github: string;
  liveLink?: string;
};


const techStacks: { [key: string]: ITechStack } = {
  react: {icon: <BiLogoReact />, name: 'React'},
  javascript: {icon: <BiLogoJavascript />, name: 'JavaScript'},
  typescript: {icon: <BiLogoTypescript />, name: 'TypeScript'},
  html: {icon: <BiLogoHtml5 />, name: 'HTML5'},
  css: {icon: <BiLogoCss3 />, name: 'CSS3'},
  scss: {icon: <BsFiletypeScss />, name: 'SCSS'},
  bootstrap: {icon: <SiBootstrap />, name: 'Bootstrap'},
  node: {icon: <BiLogoNodejs />, name: 'Node.js'},
  express: {icon: <SiExpress />, name: 'Express'},
  axios: {icon: <SiAxios />, name: 'Axios'},
  postgresql: {icon: <BiLogoPostgresql />, name: 'PostgreSQL'},
  twilio: {icon: <SiTwilio />, name: 'Twilio'},
  threejs: {icon: <TbBrandThreejs />, name: 'Three.js'},
  blender: {icon: <BiLogoBlender />, name: 'Blender'},
};

export const myProjects: IProject[] = [
  {
    name: 'Portfolio Website',
    description: 'This very website!',
    techStack: [techStacks.react, techStacks.typescript, techStacks.css, techStacks.threejs, techStacks.blender],
    imageSource: './images/macbook-render.png',
    github: 'https://github.com/saadsidd/saadsidd.github.io'
  },
  {
    name: 'Book\'d Up',
    description: 'A web application that allows users to create and join bookclubs, as well as curate their personal bookshelves.',
    techStack: [techStacks.react, techStacks.typescript, techStacks.css, techStacks.threejs, techStacks.blender],
    imageSource: './images/macbook-render.png',
    github: 'https://github.com/saadsidd/bookd-up'
  },
  {
    name: 'DDS Food',
    description: 'A food ordering web application for a Japanese restaurant.',
    techStack: [techStacks.javascript],
    imageSource: './images/macbook-render.png',
    github: 'https://github.com/saadsidd/dds-food'
  },
  {
    name: 'Gameboy Advance SP',
    description: 'A 3D model of a Gameboy Advance SP.',
    techStack: [techStacks.javascript, techStacks.html, techStacks.css, techStacks.threejs, techStacks.blender],
    imageSource: './images/macbook-render.png',
    github: 'https://github.com/saadsidd/gba-sp',
    liveLink: 'https://www.saadsiddiq.com/gba-sp/'
  },
  {
    name: 'Canvas Playground',
    description: 'A collection of canvas mini-projects made with TypeScript.',
    techStack: [techStacks.typescript, techStacks.html, techStacks.css],
    imageSource: './images/macbook-render.png',
    github: 'https://github.com/saadsidd/canvas',
    liveLink: 'https://www.saadsiddiq.com/canvas/'
  }
];