import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useProgress,
  Preload,
} from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import React from "react";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center text-white">
        <span className="text-xl font-semibold">
          Chargement... {progress.toFixed(0)}%
        </span>
        <div className="w-40 h-2 bg-gray-700 rounded overflow-hidden mt-2">
          <div
            className="h-full bg-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

function Model({ modelPath }) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);

  // Memoize the model scene for better performance
  const scene = useMemo(() => gltf.scene, [gltf.scene]);

  // Slow rotation animation
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.3; // Adjust speed here
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}

export default function ModelViewer({
  modelPath = "/matelaTendresse.glb",
  height = "200px",
}) {
  return (
    <div className="relative w-full overflow-hidden md:h-[200px] h-[130px] flex items-center justify-center">
      <div className="w-full h-full">
        <Canvas
          className="w-full h-full"
          camera={{ position: [4, 1.5, 0], fov: 20 }}
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            outputEncoding: THREE.sRGBEncoding,
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
        >
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={1} />
            <directionalLight
              intensity={2.5}
              position={[10, 10, 5]}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <Model modelPath={modelPath} />
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={0}
              enablePan={false}
              autoRotate={false}
              dampingFactor={0.1}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
