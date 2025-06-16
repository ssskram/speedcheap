'use client';

import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useGameInput } from '../../hooks/useGameInput';
import { useGameUpdateLoop } from '../../hooks/useGameLoop';
import { usePauseInput } from '../../hooks/useGameInput';
import { VIEWPORT } from '../../utils/constants';
import GameHUD from './GameHUD';
import Landscape from './Landscape';
import Vehicle from './Vehicle';
import InteractionSystem from '../interactions/InteractionSystem';
import PauseOverlay from './PauseOverlay';

interface GameCanvasProps {
  className?: string;
}

export default function GameCanvas({ className = '' }: GameCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Game state
  const {
    status,
    updateGame,
    pauseGame,
    resumeGame,
    activeInteraction,
  } = useGameStore();

  // Input handling
  const { isAccelerating, bindInputHandlers, unbindInputHandlers } = useGameInput();

  // Game loop
  useGameUpdateLoop(
    updateGame,
    isAccelerating,
    status === 'playing'
  );

  // Pause input handling
  usePauseInput(pauseGame, resumeGame, status === 'paused');

  // Bind input handlers to canvas
  useEffect(() => {
    if (canvasRef.current) {
      bindInputHandlers(canvasRef.current);
    }

    return () => {
      unbindInputHandlers();
    };
  }, [bindInputHandlers, unbindInputHandlers]);

  // Handle game state changes
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      // Game ended, clean up
      unbindInputHandlers();
    }
  }, [status, unbindInputHandlers]);

  if (status === 'menu') {
    return null;
  }

  return (
    <div className={`game-canvas relative ${className}`}>
      {/* Main game canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full min-h-[600px] relative"
        style={{
          width: VIEWPORT.GAME_WIDTH,
          height: VIEWPORT.GAME_HEIGHT,
        }}
        tabIndex={0}
      >
        {/* Landscape layer */}
        <Landscape />
        
        {/* Vehicle layer */}
        <Vehicle />
        
        {/* Game HUD */}
        <GameHUD />
        
        {/* Interaction system */}
        {activeInteraction && (
          <InteractionSystem interaction={activeInteraction} />
        )}
        
        {/* Pause overlay */}
        {status === 'paused' && <PauseOverlay />}
      </div>
      
      {/* Mobile controls hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded md:hidden">
        Hold to accelerate • Tap features to interact
      </div>
    </div>
  );
}