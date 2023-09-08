import './styles/ThreeCanvas.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Room } from "./Room";

type ThreeCanvasProps = {
  darkMode: string;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ darkMode }) => {
  return (
    <div id='three-canvas-container'>
      {/* THREE CONTAINER */}
      <Canvas orthographic camera={{zoom: 100, position: [100, 65, 100]}}>

        <Room darkMode={darkMode} position={[0, -2, 0]} />
        <ambientLight intensity={3} />
        <OrbitControls
          enabled={true}
          enableZoom={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={0}
          maxAzimuthAngle={Math.PI / 2}
        />

      </Canvas>
    </div>
  );
}