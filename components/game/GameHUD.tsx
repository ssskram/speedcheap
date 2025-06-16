'use client';

import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { calculateProgress, getSpeedTier } from '../../utils/gameCalculations';
import { formatPoints } from '../../utils/gameCalculations';

export default function GameHUD() {
  const {
    points,
    targetPoints,
    speed,
    position,
    route,
    getTimeRemainingFormatted,
    getSpeedFormatted,
    getCurrentSpeedTier,
  } = useGameStore();

  const progress = calculateProgress(position, route.distance);
  const speedTier = getCurrentSpeedTier();
  
  // Calculate progress towards target points
  const pointsProgress = Math.min(1, points / targetPoints);
  
  // Get speed tier styling
  const getSpeedTierClass = (tier: string) => {
    switch (tier) {
      case 'crawling': return 'speed-crawling';
      case 'moderate': return 'speed-moderate';
      case 'fast': return 'speed-fast';
      case 'racing': return 'speed-racing';
      default: return 'speed-moderate';
    }
  };

  return (
    <div className="game-hud">
      <div className="flex justify-between items-start">
        {/* Left side - Score and Progress */}
        <div className="flex flex-col space-y-2">
          {/* Score */}
          <div className="bg-black/30 rounded-lg px-3 py-2">
            <div className="text-sm opacity-80">Score</div>
            <div className="text-xl font-bold">
              {formatPoints(points)} / {formatPoints(targetPoints)}
            </div>
            
            {/* Points progress bar */}
            <div className="w-32 mt-1">
              <div className="progress-bar h-1">
                <div 
                  className="progress-bar-fill bg-green-400"
                  style={{ width: `${pointsProgress * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Distance Progress */}
          <div className="bg-black/30 rounded-lg px-3 py-2">
            <div className="text-sm opacity-80">Progress</div>
            <div className="text-lg font-semibold">
              {position.toFixed(1)} / {route.distance} miles
            </div>
            
            {/* Distance progress bar */}
            <div className="w-32 mt-1">
              <div className="progress-bar h-1">
                <div 
                  className="progress-bar-fill bg-blue-400"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Speed and Time */}
        <div className="flex flex-col space-y-2 items-end">
          {/* Speed */}
          <div className="bg-black/30 rounded-lg px-3 py-2 text-right">
            <div className="text-sm opacity-80">Speed</div>
            <div className="text-xl font-bold">{getSpeedFormatted()}</div>
            <div className={`speed-indicator mt-1 ${getSpeedTierClass(speedTier)}`}>
              {speedTier.charAt(0).toUpperCase() + speedTier.slice(1)}
            </div>
          </div>

          {/* Time Remaining */}
          <div className="bg-black/30 rounded-lg px-3 py-2 text-right">
            <div className="text-sm opacity-80">Time</div>
            <div className="text-xl font-bold">{getTimeRemainingFormatted()}</div>
          </div>
        </div>
      </div>

      {/* Route info */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/30 rounded-lg px-3 py-2">
          <div className="text-sm font-semibold">{route.name}</div>
          <div className="text-xs opacity-80">{route.description}</div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 text-right">
        <div className="bg-black/30 rounded-lg px-3 py-2">
          <div className="text-xs opacity-80 hidden md:block">
            SPACE or ↑ to accelerate • ESC to pause
          </div>
          <div className="text-xs opacity-80 md:hidden">
            Hold to accelerate • ESC to pause
          </div>
        </div>
      </div>
    </div>
  );
}