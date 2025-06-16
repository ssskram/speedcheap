'use client';

import React from 'react';
import { LandscapeFeature } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

interface FeatureRendererProps {
  feature: LandscapeFeature;
  x: number;
  y: number;
}

export default function FeatureRenderer({ feature, x, y }: FeatureRendererProps) {
  const { startInteraction } = useGameStore();

  const handleFeatureClick = () => {
    if (feature.isActive && !feature.isCompleted) {
      startInteraction(feature.id);
    }
  };

  // Get feature styling based on state
  const getFeatureClasses = () => {
    let classes = 'feature-icon absolute transform -translate-x-1/2 -translate-y-1/2';
    
    if (feature.isCompleted) {
      classes += ' completed';
    } else if (feature.isActive) {
      classes += ' active pulse-glow';
    }
    
    return classes;
  };

  // Get interaction hint
  const getInteractionHint = () => {
    switch (feature.interactionType) {
      case 'click':
        return 'Click to acknowledge';
      case 'hold':
        return 'Hold to listen';
      case 'sequence':
        return 'Follow the pattern';
      case 'trace':
        return 'Trace the path';
      default:
        return 'Interact';
    }
  };

  return (
    <div
      className={getFeatureClasses()}
      style={{
        left: x,
        top: y,
        fontSize: `${feature.visual.size}px`,
        color: feature.visual.color,
        zIndex: feature.isActive ? 10 : 5,
      }}
      onClick={handleFeatureClick}
      title={feature.isActive ? getInteractionHint() : feature.lore}
    >
      {feature.visual.icon}
      
      {/* Interaction range indicator (visible when active) */}
      {feature.isActive && (
        <div
          className="absolute rounded-full border-2 border-white/50 animate-pulse pointer-events-none"
          style={{
            width: '80px',
            height: '80px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      
      {/* Points indicator */}
      {feature.isActive && !feature.isCompleted && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
          +{feature.points}
        </div>
      )}
    </div>
  );
}