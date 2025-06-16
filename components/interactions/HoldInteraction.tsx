'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Interaction, LandscapeFeature } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

interface HoldInteractionProps {
  interaction: Interaction;
  feature: LandscapeFeature;
}

export default function HoldInteraction({ interaction, feature }: HoldInteractionProps) {
  const { updateInteraction, completeInteraction } = useGameStore();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  const updateProgress = () => {
    if (isHolding && startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const requiredTime = 2; // 2 seconds to complete
      const newProgress = Math.min(elapsed / requiredTime, 1);
      
      setProgress(newProgress);
      updateInteraction(newProgress);
      
      if (newProgress >= 1) {
        completeInteraction();
        return;
      }
    }
    
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const startHolding = () => {
    setIsHolding(true);
    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const stopHolding = () => {
    setIsHolding(false);
    startTimeRef.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Hold the button below to listen deeply to the stories within...
        </p>
        
        {/* Progress circle */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress)}`}
              className="text-blue-500 transition-all duration-100"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
        
        {/* Hold button */}
        <button
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          className={`w-32 h-32 rounded-full border-4 text-white font-semibold transition-all duration-200 select-none ${
            isHolding 
              ? 'bg-blue-600 border-blue-400 scale-95' 
              : 'bg-blue-500 border-blue-300 hover:bg-blue-600'
          }`}
        >
          {isHolding ? 'Listening...' : 'Hold to Listen'}
        </button>
        
        {progress > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {progress < 0.3 
              ? "You begin to hear whispers..." 
              : progress < 0.7 
              ? "The stories become clearer..." 
              : "The wisdom flows through you..."}
          </p>
        )}
      </div>
    </div>
  );
}