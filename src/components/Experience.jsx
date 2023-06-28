import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Room } from "./Room";

export const Experience = () => {
  return (
    <>
      <Canvas orthographic camera={{zoom: 50, position: [100, 100, 100]}} style={{width: '300px', height: '300px'}}>
        <color attach="background" args={['#f5efe6']}/>

        <Room position={[0, -2, 0]} />
        <ambientLight intensity={2}/>
        <pointLight intensity={2} />
        <OrbitControls />

        
      </Canvas>
    </>
  );
}