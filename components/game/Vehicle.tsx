'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '../../stores/gameStore';
import { VIEWPORT } from '../../utils/constants';

export default function Vehicle() {
  const { speed, getCurrentSpeedTier } = useGameStore();
  
  const speedTier = getCurrentSpeedTier();
  
  // Get dust effect based on speed
  const getDustEffect = () => {
    if (speed < 10) return null;
    
    const dustCount = Math.min(Math.floor(speed / 10), 5);
    return Array.from({ length: dustCount }, (_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-yellow-200/60 rounded-full animate-ping"
        style={{
          left: `${-10 - i * 8}px`,
          top: `${40 + i * 3}px`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: '0.5s',
        }}
      />
    ));
  };
  
  // Get speed-based effects
  const getSpeedEffects = () => {
    const effects = [];
    
    // Motion lines for high speed
    if (speed > 35) {
      effects.push(
        <div key="motion-lines" className="absolute -left-20 top-0 bottom-0 flex items-center">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="w-8 h-px bg-white/40 mr-2 animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      );
    }
    
    // Screen shake effect for very high speed
    const shakeIntensity = speed > 60 ? 2 : 0;
    if (shakeIntensity > 0) {
      effects.push(
        <style key="shake" dangerouslySetInnerHTML={{
          __html: `
            @keyframes vehicle-shake {
              0%, 100% { transform: translate(0px, 0px); }
              25% { transform: translate(${shakeIntensity}px, ${shakeIntensity}px); }
              50% { transform: translate(-${shakeIntensity}px, ${shakeIntensity}px); }
              75% { transform: translate(${shakeIntensity}px, -${shakeIntensity}px); }
            }
            .vehicle-shake { animation: vehicle-shake 0.1s infinite; }
          `
        }} />
      );
    }
    
    return effects;
  };

  return (
    <div
      className={`absolute ${speed > 60 ? 'vehicle-shake' : ''}`}
      style={{
        left: VIEWPORT.VEHICLE_X_POSITION,
        top: VIEWPORT.GAME_HEIGHT - 120,
        transform: 'translateX(-50%)',
        zIndex: 20,
      }}
    >
      {/* Vehicle image */}
      <div className="relative">
        <Image
          src="/purple_truck_rear.png"
          alt="Purple truck"
          width={60}
          height={40}
          className="pixelated"
          style={{
            imageRendering: 'pixelated',
          }}
        />
        
        {/* Speed indicator under vehicle */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-1 rounded">
          {speedTier.charAt(0).toUpperCase() + speedTier.slice(1)}
        </div>
      </div>
      
      {/* Dust effects */}
      {getDustEffect()}
      
      {/* Speed effects */}
      {getSpeedEffects()}
      
      {/* Vehicle shadow */}
      <div
        className="absolute bg-black/20 rounded-full"
        style={{
          width: '80px',
          height: '20px',
          left: '50%',
          bottom: '-10px',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
}