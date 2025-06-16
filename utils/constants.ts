import { Route, LandscapeFeature } from '../types/game';

// Game Physics
export const PHYSICS = {
  MIN_SPEED: 0,
  MAX_SPEED: 80, // mph
  ACCELERATION: 15, // mph per second
  DECELERATION: 25, // mph per second (includes natural friction)
  FRICTION: 5, // mph per second (natural slowdown)
} as const;

// Speed Tiers and Multipliers
export const SPEED_TIERS = {
  CRAWLING: { min: 5, max: 15, multiplier: 1.0, name: 'Crawling' },
  MODERATE: { min: 15, max: 35, multiplier: 0.75, name: 'Moderate' },
  FAST: { min: 35, max: 55, multiplier: 0.5, name: 'Fast' },
  RACING: { min: 55, max: 80, multiplier: 0.25, name: 'Racing' },
} as const;

// Visual Layout
export const VIEWPORT = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  LANDSCAPE_WIDTH: 1200,
  VEHICLE_X_POSITION: 100, // pixels from left edge
  FEATURE_INTERACTION_RANGE: 80, // pixels
} as const;

// Feature Configuration
export const FEATURES = {
  SACRED_SITE: {
    icon: '🗿',
    basePoints: 100,
    interactionTime: 3, // seconds
    color: '#8B4513',
    lore: 'Ancient ceremonial ground where generations have gathered to honor the ancestors and seek guidance.',
  },
  ANIMAL_TRACKS: {
    icon: '🦘',
    basePoints: 60,
    interactionTime: 2,
    color: '#CD853F',
    lore: 'Fresh tracks leading toward water. These paths have been followed for countless seasons.',
  },
  PLANT_SIGNS: {
    icon: '🌿',
    basePoints: 40,
    interactionTime: 1.5,
    color: '#228B22',
    lore: 'Medicinal plants that bloom with the rains, marking seasonal cycles and healing knowledge.',
  },
  GEOLOGICAL: {
    icon: '🪨',
    basePoints: 80,
    baseInteractionTime: 2.5,
    color: '#A0522D',
    lore: 'Rock formations shaped by the Dreamtime ancestors, holding creation stories within their stone.',
  },
} as const;

// Routes Configuration
export const ROUTES: Route[] = [
  {
    id: 'desert-crossing',
    name: 'Desert Crossing',
    distance: 15,
    duration: 6, // minutes
    targetPoints: 800,
    terrain: 'desert',
    description: 'A gentle introduction across red sand country with scattered sacred sites.',
    features: [], // Will be generated
  },
  {
    id: 'grassland-journey',
    name: 'Grassland Journey',
    distance: 20,
    duration: 8,
    targetPoints: 1200,
    terrain: 'grassland',
    description: 'Rolling country rich with animal signs and seasonal plant indicators.',
    features: [],
  },
  {
    id: 'mountain-passage',
    name: 'Mountain Passage',
    distance: 25,
    duration: 10,
    targetPoints: 1600,
    terrain: 'forest',
    description: 'Challenging terrain with complex geological formations and dense feature clusters.',
    features: [],
  },
];

// Interaction Types
export const INTERACTIONS = {
  CLICK: {
    description: 'Quick acknowledgment of the feature',
    baseTime: 0.5,
  },
  HOLD: {
    description: 'Listen deeply to the stories held within',
    baseTime: 3,
  },
  SEQUENCE: {
    description: 'Follow the traditional pattern of elements',
    baseTime: 5,
    elements: ['🔥', '💧', '🌍', '💨'], // fire, water, earth, air
  },
  TRACE: {
    description: 'Draw the path connecting to ancestral tracks',
    baseTime: 4,
  },
} as const;

// Game Balance
export const BALANCE = {
  // Feature distribution per mile
  FEATURES_PER_MILE: {
    MIN: 2,
    MAX: 6,
    CLUSTER_PROBABILITY: 0.3, // 30% chance of feature clusters
  },
  
  // Speed-based difficulty scaling
  INTERACTION_TIME_SCALING: {
    CRAWLING: 1.0, // full time available
    MODERATE: 0.8,
    FAST: 0.6,
    RACING: 0.4,
  },
  
  // Point requirements for route unlock
  UNLOCK_THRESHOLDS: {
    'grassland-journey': 600, // Need to score at least 600 on desert crossing
    'mountain-passage': 900, // Need to score at least 900 on grassland journey
  },
} as const;

// LocalStorage Configuration
export const STORAGE = {
  GAME_HISTORY_KEY: 'speed-is-cheap-history',
  MAX_STORED_GAMES: 100,
  VERSION: 1, // For data migration
} as const;

// UI Configuration
export const UI = {
  MOBILE_BREAKPOINT: 768,
  TOUCH_TARGET_SIZE: 44, // pixels
  ANIMATION_DURATION: 200, // milliseconds
  
  // HUD positioning
  HUD_MARGIN: 20,
  PROGRESS_BAR_HEIGHT: 6,
  
  // Colors
  COLORS: {
    PRIMARY: '#8B4513', // brown
    SECONDARY: '#CD853F', // light brown
    SUCCESS: '#228B22', // green
    WARNING: '#FF8C00', // orange
    DANGER: '#DC143C', // red
    BACKGROUND: '#F5E6D3', // cream
    TEXT: '#2F1B14', // dark brown
  },
} as const;

// Performance Configuration
export const PERFORMANCE = {
  TARGET_FPS: 60,
  FIXED_TIMESTEP: 1000 / 60, // 16.67ms
  MAX_FRAME_SKIP: 5,
  
  // Culling distances
  FEATURE_RENDER_DISTANCE: 400, // pixels
  FEATURE_UPDATE_DISTANCE: 200, // pixels
} as const;

// Audio Configuration (for future implementation)
export const AUDIO = {
  MASTER_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
  MUSIC_VOLUME: 0.5,
  
  SOUNDS: {
    FEATURE_COMPLETE: 'feature-complete',
    SPEED_WARNING: 'speed-warning',
    GAME_WIN: 'game-win',
    GAME_LOSE: 'game-lose',
  },
} as const;

// Development flags
export const DEBUG = {
  SHOW_HITBOXES: false,
  SHOW_SPEED_TIER: false,
  SHOW_FEATURE_RANGE: false,
  LOG_PERFORMANCE: false,
  UNLIMITED_TIME: false,
} as const;