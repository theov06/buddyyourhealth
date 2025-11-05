import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Heart() {
  
  const { scene } = useGLTF('/models/model.glb'); 
  const ref = useRef<THREE.Group>(null!);



  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <primitive 
      ref={ref} 
      object={scene} 
      scale={2} 
      position={[0, 0, 0]} 
    />
  );
}

export default function Agent() { 
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ 
        position: 'absolute', 
        top: '50%', 
        right: '5%', 
        width: '500px', 
        height: '500px', 
        transform: 'translateY(-50%)', 
        zIndex: 0 
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[0, 1.5, 0]} intensity={2} color={0xFFFFFF} />
        
        <Heart />
      </Suspense>
    </Canvas>
  );
}