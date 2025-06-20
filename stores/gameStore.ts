import { create } from 'zustand';

interface GameState {
  // Game mechanics
  speed: number;
  position: number;
  score: number;
  timeRemaining: number;
  isGameActive: boolean;
  isGameComplete: boolean;
  
  // Reading mechanics
  isReading: boolean;
  currentQuote: string | null;
  readingStartTime: number;
  currentBillboardPosition: number | null; // Track z-position of billboard being read
  
  // ActionsN
  setSpeed: (speed: number) => void;
  updatePosition: (delta: number) => void;
  addPoints: (points: number) => void;
  startReading: (quote: string, billboardPosition?: number) => void;
  stopReading: () => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateTime: (delta: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  speed: 0,
  position: 0,
  score: 0,
  timeRemaining: 60, // 1 minute - brutal time pressure, impossible without high speeds
  isGameActive: false,
  isGameComplete: false,
  
  isReading: false,
  currentQuote: null,
  readingStartTime: 0,
  currentBillboardPosition: null,
  
  // Actions
  setSpeed: (speed: number) => set({ speed: Math.max(0, Math.min(5, speed)) }),
  
  updatePosition: (delta: number) => {
    const { speed, isGameActive } = get();
    if (isGameActive) {
      // Position updates even while reading - no pausing!
      const newPosition = get().position + speed * delta * 15;
      set({ position: newPosition });
      
      // Check if game is complete (reached end) - extreme distance with brutal time pressure
      if (newPosition >= 1500) {
        get().endGame();
      }
    }
  },
  
  addPoints: (points: number) => set((state) => ({ 
    score: state.score + points 
  })),
  
  startReading: (quote: string, billboardPosition?: number) => {
    const { isReading } = get();
    // Don't start reading if already reading
    if (isReading) return;
    
    const currentTime = Date.now();
    set({
      isReading: true,
      currentQuote: quote,
      readingStartTime: currentTime,
      currentBillboardPosition: billboardPosition,
    });
  },
  
  stopReading: () => {
    const { readingStartTime, isReading, speed } = get();
    if (isReading && readingStartTime > 0) {
      const readingTime = (Date.now() - readingStartTime) / 1000;
      
      // Always give points for any reading time
      const speedMultiplier = Math.max(0.5, speed); // Minimum 0.5x, up to 5x
      const points = Math.floor(readingTime * 10 * speedMultiplier);
      
      set((state) => ({
        isReading: false,
        currentQuote: null,
        readingStartTime: 0,
        currentBillboardPosition: null,
        score: state.score + points
      }));
    }
  },
  
  startGame: () => set({
    isGameActive: true,
    isGameComplete: false,
    timeRemaining: 60, // 1 minute - impossible without strategic high-speed management
    score: 0,
    position: 0,
    speed: 1
  }),
  
  endGame: () => {
    const { stopReading } = get();
    stopReading(); // Stop any current reading and add accumulated points
    set({
      isGameActive: false,
      isGameComplete: true,
      speed: 0
    });
  },
  
  resetGame: () => set({
    speed: 0,
    position: 0,
    score: 0,
    timeRemaining: 60,
    isGameActive: false,
    isGameComplete: false,
    isReading: false,
    currentQuote: null,
    readingStartTime: 0,
    currentBillboardPosition: null,
  }),
  
  updateTime: (delta: number) => {
    const { isGameActive, timeRemaining } = get();
    if (isGameActive && timeRemaining > 0) {
      const newTime = Math.max(0, timeRemaining - delta);
      set({ timeRemaining: newTime });
      
      if (newTime <= 0) {
        get().endGame();
      }
    }
  }
})); 