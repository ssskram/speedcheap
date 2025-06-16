'use client';

import React, { useState } from 'react';
import { Interaction, LandscapeFeature } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

interface SequenceInteractionProps {
  interaction: Interaction;
  feature: LandscapeFeature;
}

export default function SequenceInteraction({ interaction, feature }: SequenceInteractionProps) {
  const { updateInteraction, completeInteraction } = useGameStore();
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);

  const targetSequence = interaction.sequence || ['🔥', '💧', '🌍', '💨'];
  
  const handleElementClick = (element: string) => {
    const newSequence = [...currentSequence, element];
    const expectedElement = targetSequence[currentSequence.length];
    
    if (element === expectedElement) {
      // Correct element
      setCurrentSequence(newSequence);
      setIsWrong(false);
      
      const progress = newSequence.length / targetSequence.length;
      updateInteraction(progress);
      
      if (progress >= 1) {
        completeInteraction();
      }
    } else {
      // Wrong element
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setCurrentSequence([]);
        updateInteraction(0);
      }, 1000);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Follow the traditional pattern of the elements:
        </p>
        
        {/* Target sequence display */}
        <div className="flex justify-center space-x-2 mb-4">
          {targetSequence.map((element, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl ${
                index < currentSequence.length
                  ? 'bg-green-100 border-green-400'
                  : index === currentSequence.length
                  ? 'bg-blue-100 border-blue-400 animate-pulse'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              {index < currentSequence.length ? '✓' : element}
            </div>
          ))}
        </div>
        
        {/* Current sequence feedback */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">
            Progress: {currentSequence.length} / {targetSequence.length}
          </p>
        </div>
        
        {/* Element buttons */}
        <div className="grid grid-cols-2 gap-4 max-w-48 mx-auto">
          {['🔥', '💧', '🌍', '💨'].map((element, index) => (
            <button
              key={element}
              onClick={() => handleElementClick(element)}
              className={`w-20 h-20 rounded-lg border-2 text-3xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                isWrong
                  ? 'bg-red-100 border-red-400 animate-shake'
                  : 'bg-white border-gray-300 hover:border-blue-400'
              }`}
              disabled={isWrong}
            >
              {element}
            </button>
          ))}
        </div>
        
        {/* Element labels */}
        <div className="grid grid-cols-2 gap-4 max-w-48 mx-auto mt-2">
          <span className="text-xs text-gray-500">Fire</span>
          <span className="text-xs text-gray-500">Water</span>
          <span className="text-xs text-gray-500">Earth</span>
          <span className="text-xs text-gray-500">Air</span>
        </div>
        
        {/* Feedback messages */}
        {isWrong && (
          <p className="text-red-600 text-sm mt-4 animate-pulse">
            Not quite right. The sequence resets...
          </p>
        )}
        
        {currentSequence.length > 0 && !isWrong && (
          <p className="text-green-600 text-sm mt-4">
            Good! Continue the pattern...
          </p>
        )}
      </div>
    </div>
  );
}