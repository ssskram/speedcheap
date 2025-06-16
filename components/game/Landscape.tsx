'use client';

import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { VIEWPORT } from '../../utils/constants';
import { convertMilesToPixels } from '../../utils/gameCalculations';
import FeatureRenderer from './FeatureRenderer';

export default function Landscape() {
  const { 
    route, 
    position, 
    viewport,
    getVisibleFeatures 
  } = useGameStore();

  const visibleFeatures = getVisibleFeatures();
  
  // Calculate landscape scroll position
  const scrollX = -(viewport.centerX - VIEWPORT.GAME_WIDTH / 2);
  
  // Generate terrain background based on route type
  const getTerrainGradient = (terrain: string) => {
    switch (terrain) {
      case 'desert':
        return 'linear-gradient(to bottom, #87CEEB 0%, #F4A460 20%, #CD853F 40%, #D2B48C 100%)';
      case 'grassland':
        return 'linear-gradient(to bottom, #87CEEB 0%, #90EE90 20%, #228B22 40%, #32CD32 100%)';
      case 'forest':
        return 'linear-gradient(to bottom, #87CEEB 0%, #228B22 20%, #006400 40%, #2F4F2F 100%)';
      default:
        return 'linear-gradient(to bottom, #87CEEB 0%, #F5E6D3 30%, #D2B48C 100%)';
    }
  };

  return (
    <div className="landscape-layer">
      {/* Terrain background */}
      <div 
        className="absolute inset-0"
        style={{
          background: getTerrainGradient(route.terrain),
          transform: `translateX(${scrollX * 0.3}px)`, // Parallax effect
        }}
      />
      
      {/* Ground line */}
      <div 
        className="absolute bottom-20 left-0 right-0 h-px bg-black/20"
        style={{
          transform: `translateX(${scrollX}px)`,
        }}
      />
      
      {/* Landscape features */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateX(${scrollX}px)`,
        }}
      >
        {visibleFeatures.map((feature) => {
          const featureX = convertMilesToPixels(
            feature.position, 
            route.distance, 
            VIEWPORT.LANDSCAPE_WIDTH
          );
          
          return (
            <FeatureRenderer 
              key={feature.id}
              feature={feature}
              x={featureX}
              y={VIEWPORT.GAME_HEIGHT - 150} // Position above ground
            />
          );
        })}
      </div>
      
      {/* Distance markers */}
      <div 
        className="absolute bottom-16 left-0"
        style={{
          transform: `translateX(${scrollX}px)`,
          width: VIEWPORT.LANDSCAPE_WIDTH,
        }}
      >
        {Array.from({ length: Math.ceil(route.distance) }, (_, i) => {
          const mileX = convertMilesToPixels(
            i + 1, 
            route.distance, 
            VIEWPORT.LANDSCAPE_WIDTH
          );
          
          return (
            <div
              key={i}
              className="absolute text-white/60 text-xs"
              style={{
                left: `${mileX}px`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="w-px h-4 bg-white/40 mx-auto mb-1" />
              {i + 1}mi
            </div>
          );
        })}
      </div>
      
      {/* Atmospheric effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dust particles for desert */}
        {route.terrain === 'desert' && (
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${50 + Math.random() * 30}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Grass sway for grassland */}
        {route.terrain === 'grassland' && (
          <div className="absolute bottom-20 left-0 right-0 h-8 opacity-30">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute w-px h-8 bg-green-400 origin-bottom"
                style={{
                  left: `${(i / 20) * 100}%`,
                  transform: `rotate(${Math.sin(Date.now() * 0.001 + i) * 5}deg)`,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Tree shadows for forest */}
        {route.terrain === 'forest' && (
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="absolute w-20 h-40 bg-black/30 rounded-full"
                style={{
                  left: `${20 + (i * 15)}%`,
                  bottom: '80px',
                  transform: 'skewX(-10deg)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}