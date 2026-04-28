import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingObjects() {
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const group3 = useRef<THREE.Group>(null);

  useFrame(() => {
    if (group1.current) group1.current.rotation.x += 0.003;
    if (group2.current) group2.current.rotation.y += 0.004;
    if (group3.current) group3.current.rotation.z += 0.005;
  });

  return (
    <>
      {/* Central rotating cube */}
      <group ref={group1}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial
            color="#3B82F6"
            emissive="#0EA5E9"
            emissiveIntensity={0.7}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Floating spheres around center */}
      <group ref={group2}>
        <mesh position={[2.5, 1.5, 1]} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#7C3AED"
            emissiveIntensity={0.8}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        <mesh position={[-2.5, -1.5, 1]} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#00D9FF"
            emissiveIntensity={0.7}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        <mesh position={[1, 2.5, -1.5]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#34D399"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[-1.5, -2, -1]} castShadow>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#FBBF24"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Octahedron */}
      <group ref={group3} position={[0, 1, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#EC4899"
            emissive="#DB2777"
            emissiveIntensity={0.65}
            metalness={0.92}
            roughness={0.08}
          />
        </mesh>
      </group>
    </>
  );
}

export default function Hero3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#3B82F6" castShadow />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#8B5CF6" castShadow />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#0EA5E9" castShadow />

      <FloatingObjects />
    </Canvas>
  );
}
