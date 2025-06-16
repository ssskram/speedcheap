import { PHYSICS, SPEED_TIERS, BALANCE } from './constants';
import { SpeedTier } from '../types/game';

// Speed Physics Functions
export function updateSpeed(currentSpeed: number, isAccelerating: boolean, deltaTime: number): number {
  let newSpeed = currentSpeed;
  
  if (isAccelerating) {
    newSpeed += PHYSICS.ACCELERATION * deltaTime;
  } else {
    // Natural friction always applies when not accelerating
    newSpeed -= PHYSICS.FRICTION * deltaTime;
  }
  
  // Clamp speed to valid range
  return Math.max(PHYSICS.MIN_SPEED, Math.min(PHYSICS.MAX_SPEED, newSpeed));
}

export function updatePosition(currentPosition: number, speed: number, deltaTime: number): number {
  // Convert speed from mph to miles per second
  const milesPerSecond = speed / 3600;
  return currentPosition + (milesPerSecond * deltaTime);
}

// Speed Tier Functions
export function getSpeedTier(speed: number): SpeedTier {
  if (speed <= SPEED_TIERS.CRAWLING.max) return 'crawling';
  if (speed <= SPEED_TIERS.MODERATE.max) return 'moderate';
  if (speed <= SPEED_TIERS.FAST.max) return 'fast';
  return 'racing';
}

export function getSpeedMultiplier(speed: number): number {
  const tier = getSpeedTier(speed);
  switch (tier) {
    case 'crawling': return SPEED_TIERS.CRAWLING.multiplier;
    case 'moderate': return SPEED_TIERS.MODERATE.multiplier;
    case 'fast': return SPEED_TIERS.FAST.multiplier;
    case 'racing': return SPEED_TIERS.RACING.multiplier;
  }
}

export function getSpeedTierName(speed: number): string {
  const tier = getSpeedTier(speed);
  switch (tier) {
    case 'crawling': return SPEED_TIERS.CRAWLING.name;
    case 'moderate': return SPEED_TIERS.MODERATE.name;
    case 'fast': return SPEED_TIERS.FAST.name;
    case 'racing': return SPEED_TIERS.RACING.name;
  }
}

// Scoring Functions
export function calculateFeaturePoints(basePoints: number, speed: number): number {
  const multiplier = getSpeedMultiplier(speed);
  return Math.round(basePoints * multiplier);
}

export function calculateInteractionTimeLimit(baseTime: number, speed: number): number {
  const tier = getSpeedTier(speed);
  const scaling = BALANCE.INTERACTION_TIME_SCALING[tier.toUpperCase() as keyof typeof BALANCE.INTERACTION_TIME_SCALING];
  return baseTime * scaling;
}

// Distance and Time Calculations
export function convertMilesToPixels(miles: number, routeDistance: number, viewportWidth: number): number {
  return (miles / routeDistance) * viewportWidth;
}

export function convertPixelsToMiles(pixels: number, routeDistance: number, viewportWidth: number): number {
  return (pixels / viewportWidth) * routeDistance;
}

export function calculateProgress(currentPosition: number, routeDistance: number): number {
  return Math.max(0, Math.min(1, currentPosition / routeDistance));
}

export function calculateTimeRemaining(startTime: number, duration: number): number {
  const elapsed = (Date.now() - startTime) / 1000; // convert to seconds
  const totalTime = duration * 60; // convert minutes to seconds
  return Math.max(0, totalTime - elapsed);
}

// Performance Metrics
export function calculateAverageSpeed(positions: number[], timestamps: number[]): number {
  if (positions.length < 2) return 0;
  
  const totalDistance = positions[positions.length - 1] - positions[0];
  const totalTime = (timestamps[timestamps.length - 1] - timestamps[0]) / 1000; // convert to seconds
  
  if (totalTime === 0) return 0;
  
  // Convert from miles per second to miles per hour
  return (totalDistance / totalTime) * 3600;
}

export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return completed / total;
}

// Collision Detection
export function isFeatureInRange(
  featurePosition: number,
  playerPosition: number,
  interactionRange: number,
  routeDistance: number,
  viewportWidth: number
): boolean {
  const featurePixels = convertMilesToPixels(featurePosition, routeDistance, viewportWidth);
  const playerPixels = convertMilesToPixels(playerPosition, routeDistance, viewportWidth);
  
  return Math.abs(featurePixels - playerPixels) <= interactionRange;
}

// Game State Validation
export function isGameWon(points: number, targetPoints: number, position: number, routeDistance: number): boolean {
  return points >= targetPoints && position >= routeDistance;
}

export function isGameLost(timeRemaining: number, points: number, targetPoints: number, position: number, routeDistance: number): boolean {
  // Time is up
  if (timeRemaining <= 0) {
    // Check if we've reached the destination with enough points
    if (position >= routeDistance && points >= targetPoints) {
      return false; // Actually won!
    }
    return true; // Lost due to time/insufficient points
  }
  
  return false;
}

// Utility Functions
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatSpeed(speed: number): string {
  return `${Math.round(speed)} mph`;
}

export function formatDistance(miles: number): string {
  return `${miles.toFixed(1)} miles`;
}

export function formatPoints(points: number): string {
  return points.toLocaleString();
}

// Random Utilities (for feature generation)
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

export function weightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}