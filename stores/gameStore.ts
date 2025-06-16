import { create } from 'zustand';
import { GameState, Route, LandscapeFeature, Interaction, GameMetrics } from '../types/game';
import { GameResult } from '../types/history';
import { ROUTES, VIEWPORT, PHYSICS } from '../utils/constants';
import { populateRoutes } from '../utils/featureGeneration';
import { 
  updateSpeed, 
  updatePosition, 
  calculateFeaturePoints,
  calculateInteractionTimeLimit,
  isFeatureInRange,
  isGameWon,
  isGameLost,
  calculateTimeRemaining,
  calculateProgress,
  getSpeedTier,
  formatTime,
  formatSpeed
} from '../utils/gameCalculations';
import { saveGameResult } from '../utils/localStorage';

interface GameStore {
  // Game state
  time: number;
  position: number;
  speed: number;
  points: number;
  targetPoints: number;
  status: 'playing' | 'paused' | 'won' | 'lost' | 'menu';
  route: Route;
  startTime: number;
  features: LandscapeFeature[];
  activeInteraction: Interaction | null;
  viewport: {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    scale: number;
  };
  
  // Game initialization
  initializeGame: (route: Route) => void;
  
  // Game loop actions
  updateGame: (deltaTime: number, isAccelerating: boolean) => void;
  
  // Feature interactions
  startInteraction: (featureId: string) => void;
  updateInteraction: (progress: number) => void;
  completeInteraction: () => void;
  cancelInteraction: () => void;
  
  // Game flow control
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (reason: 'won' | 'lost' | 'quit') => void;
  resetGame: () => void;
  
  // Viewport management
  updateViewport: () => void;
  
  // Utility getters
  getVisibleFeatures: () => LandscapeFeature[];
  getActiveFeatures: () => LandscapeFeature[];
  getGameMetrics: () => GameMetrics;
  getCurrentSpeedTier: () => string;
  getTimeRemainingFormatted: () => string;
  getSpeedFormatted: () => string;
}

// Initial game state
const createInitialState = () => ({
  time: 0,
  position: 0,
  speed: 0,
  points: 0,
  targetPoints: 0,
  status: 'menu' as const,
  route: populateRoutes(ROUTES)[0], // Default to first route
  startTime: 0,
  features: [] as LandscapeFeature[],
  activeInteraction: null as Interaction | null,
  viewport: {
    centerX: 0,
    centerY: 0,
    width: VIEWPORT.GAME_WIDTH,
    height: VIEWPORT.GAME_HEIGHT,
    scale: 1,
  },
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),
  
  // Initialize a new game with the selected route
  initializeGame: (route: Route) => {
    const populatedRoute = populateRoutes([route])[0];
    
    set({
      ...createInitialState(),
      route: populatedRoute,
      targetPoints: populatedRoute.targetPoints,
      features: populatedRoute.features,
      status: 'playing',
      startTime: Date.now(),
    });
  },
  
  // Main game loop update
  updateGame: (deltaTime: number, isAccelerating: boolean) => {
    const state = get();
    
    if (state.status !== 'playing') {
      return;
    }
    
    // Update physics
    const newSpeed = updateSpeed(state.speed, isAccelerating, deltaTime);
    const newPosition = updatePosition(state.position, newSpeed, deltaTime);
    const newTime = state.time + deltaTime;
    
    // Update active features based on player position
    const updatedFeatures = state.features.map(feature => ({
      ...feature,
      isActive: isFeatureInRange(
        feature.position,
        newPosition,
        VIEWPORT.FEATURE_INTERACTION_RANGE,
        state.route.distance,
        VIEWPORT.LANDSCAPE_WIDTH
      ),
    }));
    
    // Check for interaction timeouts
    let activeInteraction = state.activeInteraction;
    if (activeInteraction) {
      const elapsed = (Date.now() - activeInteraction.startTime) / 1000;
      if (elapsed >= activeInteraction.timeLimit) {
        // Interaction timed out
        activeInteraction = null;
      }
    }
    
    // Check win/lose conditions
    const timeRemaining = calculateTimeRemaining(state.startTime, state.route.duration);
    
    if (isGameWon(state.points, state.targetPoints, newPosition, state.route.distance)) {
      get().endGame('won');
      return;
    } else if (isGameLost(timeRemaining, state.points, state.targetPoints, newPosition, state.route.distance)) {
      get().endGame('lost');
      return;
    }
    
    // Update state
    set({
      time: newTime,
      position: newPosition,
      speed: newSpeed,
      features: updatedFeatures,
      activeInteraction,
    });
    
    // Update viewport
    get().updateViewport();
  },
  
  // Start interacting with a feature
  startInteraction: (featureId: string) => {
    const state = get();
    
    if (state.activeInteraction || state.status !== 'playing') {
      return;
    }
    
    const feature = state.features.find(f => f.id === featureId && f.isActive && !f.isCompleted);
    if (!feature) {
      return;
    }
    
    const timeLimit = calculateInteractionTimeLimit(
      getInteractionBaseTime(feature.interactionType),
      state.speed
    );
    
    const interaction: Interaction = {
      type: feature.interactionType,
      featureId: feature.id,
      progress: 0,
      timeLimit,
      startTime: Date.now(),
      isCompleted: false,
    };
    
    // Initialize interaction-specific data
    if (feature.interactionType === 'sequence') {
      interaction.sequence = ['🔥', '💧', '🌍', '💨']; // fire, water, earth, air
      interaction.currentSequence = [];
    } else if (feature.interactionType === 'trace') {
      interaction.targetPath = generateTracePath();
      interaction.currentPath = [];
    }
    
    set({ activeInteraction: interaction });
  },
  
  // Update interaction progress
  updateInteraction: (progress: number) => {
    const state = get();
    
    if (!state.activeInteraction) {
      return;
    }
    
    set({
      activeInteraction: {
        ...state.activeInteraction,
        progress: Math.max(0, Math.min(1, progress)),
      },
    });
  },
  
  // Complete current interaction
  completeInteraction: () => {
    const state = get();
    
    if (!state.activeInteraction) {
      return;
    }
    
    const feature = state.features.find(f => f.id === state.activeInteraction!.featureId);
    if (!feature) {
      return;
    }
    
    // Calculate points earned
    const pointsEarned = calculateFeaturePoints(feature.points, state.speed);
    
    // Update feature and game state
    const updatedFeatures = state.features.map(f =>
      f.id === feature.id ? { ...f, isCompleted: true, isActive: false } : f
    );
    
    set({
      features: updatedFeatures,
      points: state.points + pointsEarned,
      activeInteraction: null,
    });
  },
  
  // Cancel current interaction
  cancelInteraction: () => {
    set({ activeInteraction: null });
  },
  
  // Pause the game
  pauseGame: () => {
    const state = get();
    if (state.status === 'playing') {
      set({ status: 'paused' });
    }
  },
  
  // Resume the game
  resumeGame: () => {
    const state = get();
    if (state.status === 'paused') {
      set({ status: 'playing' });
    }
  },
  
  // End the game and save results
  endGame: (reason: 'won' | 'lost' | 'quit') => {
    const state = get();
    
    if (state.status === 'menu') {
      return;
    }
    
    const endTime = Date.now();
    const duration = (endTime - state.startTime) / 1000; // in seconds
    const metrics = get().getGameMetrics();
    
    // Create game result
    const result: GameResult = {
      id: `game-${endTime}`,
      timestamp: endTime,
      routeId: state.route.id,
      routeName: state.route.name,
      finalScore: state.points,
      targetScore: state.targetPoints,
      isWon: reason === 'won',
      completionReason: reason === 'won' ? 'success' : 
                       reason === 'lost' ? 'time-up' : 'insufficient-points',
      duration,
      averageSpeed: metrics.averageSpeed,
      topSpeed: metrics.topSpeed,
      featuresFound: metrics.featuresFound,
      featuresCompleted: metrics.featuresCompleted,
      completionRate: metrics.completionRate,
      distanceCovered: state.position,
      timeRemaining: metrics.timeRemaining,
    };
    
    // Save to localStorage
    saveGameResult(result);
    
    // Update game status
    set({ 
      status: reason === 'won' ? 'won' : 'lost',
      activeInteraction: null,
    });
  },
  
  // Reset game to menu state
  resetGame: () => {
    set({
      ...createInitialState(),
      route: populateRoutes(ROUTES)[0],
    });
  },
  
  // Update viewport based on player position
  updateViewport: () => {
    const state = get();
    const progress = calculateProgress(state.position, state.route.distance);
    const centerX = progress * VIEWPORT.LANDSCAPE_WIDTH;
    
    set({
      viewport: {
        ...state.viewport,
        centerX,
      },
    });
  },
  
  // Get features visible in current viewport
  getVisibleFeatures: () => {
    const state = get();
    const { centerX, width } = state.viewport;
    const leftBound = centerX - width / 2;
    const rightBound = centerX + width / 2;
    
    return state.features.filter(feature => {
      const featureX = (feature.position / state.route.distance) * VIEWPORT.LANDSCAPE_WIDTH;
      return featureX >= leftBound && featureX <= rightBound;
    });
  },
  
  // Get features that can be interacted with
  getActiveFeatures: () => {
    const state = get();
    return state.features.filter(feature => feature.isActive && !feature.isCompleted);
  },
  
  // Calculate current game metrics
  getGameMetrics: () => {
    const state = get();
    
    const featuresFound = state.features.length;
    const featuresCompleted = state.features.filter(f => f.isCompleted).length;
    const completionRate = featuresFound > 0 ? featuresCompleted / featuresFound : 0;
    
    const timeRemaining = calculateTimeRemaining(state.startTime, state.route.duration);
    const distanceRemaining = state.route.distance - state.position;
    
    return {
      averageSpeed: state.speed, // Simplified - would need history for true average
      topSpeed: state.speed, // Simplified - would need to track maximum
      featuresFound,
      featuresCompleted,
      completionRate,
      timeRemaining,
      distanceRemaining,
    };
  },
  
  // Get current speed tier name
  getCurrentSpeedTier: () => {
    const state = get();
    return getSpeedTier(state.speed);
  },
  
  // Get formatted time remaining
  getTimeRemainingFormatted: () => {
    const metrics = get().getGameMetrics();
    return formatTime(metrics.timeRemaining);
  },
  
  // Get formatted current speed
  getSpeedFormatted: () => {
    const state = get();
    return formatSpeed(state.speed);
  },
}));

// Helper functions
function getInteractionBaseTime(type: LandscapeFeature['interactionType']): number {
  switch (type) {
    case 'click': return 0.5;
    case 'hold': return 3;
    case 'sequence': return 5;
    case 'trace': return 4;
  }
}

function generateTracePath(): { x: number; y: number }[] {
  // Generate a simple curved path for tracing
  const path: { x: number; y: number }[] = [];
  const steps = 10;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * 200; // 200px wide
    const y = 50 + Math.sin(t * Math.PI * 2) * 20; // Sine wave
    path.push({ x, y });
  }
  
  return path;
}