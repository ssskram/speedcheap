'use client';

import React, { useEffect } from 'react';
import { Interaction, LandscapeFeature } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

interface ClickInteractionProps {
  interaction: Interaction;
  feature: LandscapeFeature;
}

export default function ClickInteraction({ interaction, feature }: ClickInteractionProps) {
  const { completeInteraction } = useGameStore();

  // Auto-complete on mount for click interactions
  useEffect(() => {
    const timer = setTimeout(() => {
      completeInteraction();
    }, 500); // Small delay for visual feedback

    return () => clearTimeout(timer);
  }, [completeInteraction]);

  return (
    <div className="text-center">
      <div className="text-lg mb-4">
        <div className="animate-pulse text-green-600 font-semibold">
          ✓ Acknowledged
        </div>
        <p className="text-sm text-gray-600 mt-2">
          You notice the {feature.type.replace('-', ' ')} and acknowledge its presence.
        </p>
      </div>
    </div>
  );
}