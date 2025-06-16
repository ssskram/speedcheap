export interface GameState {
  // Time and position
  time: number;
  position: number;
  speed: number;
  
  // Scoring
  points: number;
  targetPoints: number;
  
  // Game flow
  status: 'playing' | 'paused' | 'won' | 'lost' | 'menu';
  route: Route;
  startTime: number;
  
  // Features
  features: LandscapeFeature[];
  activeInteraction: Interaction | null;
  
  // Viewport
  viewport: ViewportState;
}

export interface Route {
  id: string;
  name: string;
  distance: number; // in miles
  duration: number; // in minutes
  targetPoints: number;
  features: LandscapeFeature[];
  terrain: 'desert' | 'grassland' | 'forest';
  description: string;
}

export interface LandscapeFeature {
  id: string;
  type: 'sacred-site' | 'animal-tracks' | 'plant-signs' | 'geological';
  position: number; // distance along route
  points: number; // base points
  interactionType: 'click' | 'hold' | 'sequence' | 'trace';
  visual: {
    icon: string;
    color: string;
    size: number;
  };
  lore: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface Interaction {
  type: 'click' | 'hold' | 'sequence' | 'trace';
  featureId: string;
  progress: number; // 0 to 1
  timeLimit: number; // in seconds
  startTime: number;
  isCompleted: boolean;
  
  // Sequence-specific
  sequence?: string[];
  currentSequence?: string[];
  
  // Trace-specific
  targetPath?: { x: number; y: number }[];
  currentPath?: { x: number; y: number }[];
}

export interface ViewportState {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  scale: number;
}

export interface InputState {
  keys: {
    space: boolean;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    escape: boolean;
    p: boolean;
  };
  mouse: {
    x: number;
    y: number;
    isDown: boolean;
  };
  touch: {
    x: number;
    y: number;
    isActive: boolean;
  };
}

export type SpeedTier = 'crawling' | 'moderate' | 'fast' | 'racing';

export interface GameMetrics {
  averageSpeed: number;
  topSpeed: number;
  featuresFound: number;
  featuresCompleted: number;
  completionRate: number;
  timeRemaining: number;
  distanceRemaining: number;
}