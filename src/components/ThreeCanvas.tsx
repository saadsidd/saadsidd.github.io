import './styles/ThreeCanvas.css';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Room } from "./Room";

export const ThreeCanvas: React.FC = () => {
  return (
    <div id='three-canvas-container'>
      THREE CONTAINER
      {/* <Canvas orthographic camera={{zoom: 45, position: [100, 100, 100]}}>
        <color attach="background" args={['#f5efe6']}/>

        <Room position={[0, -2, 0]} />
        <Environment preset='forest' />
        <OrbitControls enabled={true} enableZoom={false} />

      </Canvas> */}
    </div>
  );
}