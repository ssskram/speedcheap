"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Sky, Environment } from "@react-three/drei";
import GameWorld from "./GameWorld";
import GameUI from "./GameUI";

export default function GameScene() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-200 to-yellow-100 overflow-hidden">
      {/* 3D Canvas - True Fullscreen */}
      <Canvas
        camera={{ position: [0, 1.5, 2], fov: 85 }}
        shadows
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* Sky and Environment */}
          <Sky
            sunPosition={[100, 20, 100]}
            turbidity={0.1}
            rayleigh={2}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
          <Environment preset="sunset" />

          {/* Game World */}
          <GameWorld />

          {/* Camera Controls - disabled for game mode */}
          {/* <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} /> */}
        </Suspense>
      </Canvas>

      {/* Game UI Overlay - Floating over fullscreen game */}
      <GameUI />
    </div>
  );
}
