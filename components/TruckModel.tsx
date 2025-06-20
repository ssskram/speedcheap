"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Mesh } from "three";
import { useGameStore } from "../stores/gameStore";

export default function TruckModel() {
  const truckRef = useRef<Mesh>(null);
  const speed = useGameStore((state) => state.speed);

  // Try to load the texture, fallback to placeholder if not found
  let texture;
  try {
    texture = useTexture("/purple_truck_rear.png");
  } catch (error) {
    texture = null;
  }

  // Truck shaking based on speed
  useFrame(() => {
    if (truckRef.current) {
      const shakeIntensity = speed * 0.03;
      truckRef.current.position.x = (Math.random() - 0.5) * shakeIntensity;
      truckRef.current.position.y =
        0.4 + (Math.random() - 0.5) * shakeIntensity;
      truckRef.current.rotation.z =
        (Math.random() - 0.5) * shakeIntensity * 0.5;
    }
  });

  return (
    <group>
      {/* Main Truck Sprite */}
      <mesh ref={truckRef} position={[0, 0.1, 1]}>
        <planeGeometry args={[1.8, 1.1]} />
        {texture ? (
          <meshBasicMaterial map={texture} transparent />
        ) : (
          <meshBasicMaterial color="#8B5CF6" />
        )}
      </mesh>

      {/* Truck Shadow */}
      <mesh position={[0, 0.01, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 1.3]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>

      {/* Exhaust Smoke Particles */}
      {speed > 0 && (
        <>
          {Array.from({ length: Math.min(5, Math.floor(speed)) }).map(
            (_, i) => (
              <mesh
                key={i}
                position={[
                  -0.7 + Math.random() * 0.1,
                  0.9 + i * 0.1,
                  1 - i * 0.06,
                ]}
              >
                <sphereGeometry args={[0.03 + Math.random() * 0.03]} />
                <meshBasicMaterial
                  color="#666666"
                  opacity={0.6 - i * 0.1}
                  transparent
                />
              </mesh>
            )
          )}
        </>
      )}

      {/* Speed Indicator Particles - Only at high speeds */}
      {speed > 3 && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={`speed-${i}`}
              position={[
                (Math.random() - 0.5) * 3,
                Math.random() * 0.6,
                -1 - Math.random() * 1,
              ]}
            >
              <sphereGeometry args={[0.025]} />
              <meshBasicMaterial
                color={speed > 4 ? "#FF6B6B" : "#FFA500"}
                opacity={0.8}
                transparent
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
