'use client';

import React from 'react';
import { useGameStore } from '../../stores/gameStore';

export default function PauseOverlay() {
  const { resumeGame, resetGame } = useGameStore();

  const handleResumeGame = () => {
    resumeGame();
  };

  const handleQuitGame = () => {
    if (window.confirm('Are you sure you want to quit the current game?')) {
      resetGame();
    }
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Game Paused</h2>
        
        <div className="space-y-4">
          <button
            onClick={handleResumeGame}
            className="game-button w-full"
          >
            Resume Game
          </button>
          
          <button
            onClick={handleQuitGame}
            className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Quit to Menu
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">ESC</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">P</kbd> to resume</p>
        </div>
      </div>
    </div>
  );
}