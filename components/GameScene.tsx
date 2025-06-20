"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Sky, Environment } from "@react-three/drei";
import GameWorld from "./GameWorld";
import GameUI from "./GameUI";

export default function GameScene() {
  const [webGLError, setWebGLError] = useState(false);

  useEffect(() => {
    // Handle WebGL context loss - common on mobile devices
    const handleWebGLContextLost = (event: Event) => {
      console.warn("WebGL context lost", event);
      setWebGLError(true);
      event.preventDefault();
    };

    const handleWebGLContextRestored = (event: Event) => {
      console.log("WebGL context restored", event);
      setWebGLError(false);
    };

    // Add event listeners for WebGL context management
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleWebGLContextLost);
      canvas.addEventListener('webglcontextrestored', handleWebGLContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleWebGLContextLost);
        canvas.removeEventListener('webglcontextrestored', handleWebGLContextRestored);
      }
    };
  }, []);

  if (webGLError) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-blue-200 to-yellow-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Graphics Error</h2>
          <p className="mb-4">The 3D graphics encountered an issue. Please refresh the page to continue.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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
        onCreated={({ gl }) => {
          // Optimize for mobile performance
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
        onError={(error) => {
          console.error("Three.js Canvas error:", error);
          setWebGLError(true);
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
