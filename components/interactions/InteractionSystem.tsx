'use client';

import React from 'react';
import { Interaction } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';
import ClickInteraction from './ClickInteraction';
import HoldInteraction from './HoldInteraction';
import SequenceInteraction from './SequenceInteraction';
import TraceInteraction from './TraceInteraction';

interface InteractionSystemProps {
  interaction: Interaction;
}

export default function InteractionSystem({ interaction }: InteractionSystemProps) {
  const { features, cancelInteraction } = useGameStore();
  
  // Find the feature being interacted with
  const feature = features.find(f => f.id === interaction.featureId);
  
  if (!feature) {
    return null;
  }

  // Handle backdrop click to cancel interaction
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      cancelInteraction();
    }
  };

  // Render the appropriate interaction component
  const renderInteractionComponent = () => {
    switch (interaction.type) {
      case 'click':
        return <ClickInteraction interaction={interaction} feature={feature} />;
      case 'hold':
        return <HoldInteraction interaction={interaction} feature={feature} />;
      case 'sequence':
        return <SequenceInteraction interaction={interaction} feature={feature} />;
      case 'trace':
        return <TraceInteraction interaction={interaction} feature={feature} />;
      default:
        return null;
    }
  };

  // Calculate time remaining
  const timeRemaining = Math.max(0, interaction.timeLimit - (Date.now() - interaction.startTime) / 1000);
  const timeProgress = 1 - (timeRemaining / interaction.timeLimit);

  return (
    <div className="interaction-modal" onClick={handleBackdropClick}>
      <div className="interaction-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{feature.visual.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{getFeatureTypeName(feature.type)}</h3>
          <p className="text-gray-600 text-sm">{feature.lore}</p>
        </div>

        {/* Time remaining indicator */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">Time remaining</span>
            <span className="text-sm font-medium">{timeRemaining.toFixed(1)}s</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill bg-red-400"
              style={{ 
                width: `${timeProgress * 100}%`,
                transition: 'width 0.1s linear'
              }}
            />
          </div>
        </div>

        {/* Interaction component */}
        <div className="mb-6">
          {renderInteractionComponent()}
        </div>

        {/* Cancel button */}
        <div className="text-center">
          <button
            onClick={cancelInteraction}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to get feature type display name
function getFeatureTypeName(type: string): string {
  switch (type) {
    case 'sacred-site':
      return 'Sacred Site';
    case 'animal-tracks':
      return 'Animal Tracks';
    case 'plant-signs':
      return 'Plant Signs';
    case 'geological':
      return 'Geological Formation';
    default:
      return 'Landscape Feature';
  }
}