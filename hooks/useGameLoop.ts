import { useEffect, useRef, useCallback } from 'react';
import { PERFORMANCE } from '../utils/constants';

interface GameLoopHook {
  startLoop: () => void;
  stopLoop: () => void;
  isRunning: boolean;
}

export function useGameLoop(
  updateCallback: (deltaTime: number) => void,
  shouldRun: boolean = true
): GameLoopHook {
  const animationIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const frameCountRef = useRef<number>(0);
  const fpsStartTimeRef = useRef<number>(0);
  
  // Performance tracking
  const trackPerformance = useCallback((deltaTime: number) => {
    frameCountRef.current++;
    
    // Log FPS every second if performance logging is enabled
    if (frameCountRef.current % 60 === 0) {
      const now = performance.now();
      if (fpsStartTimeRef.current === 0) {
        fpsStartTimeRef.current = now;
      } else {
        const elapsed = now - fpsStartTimeRef.current;
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        
        // Optional: Enable debug logging in constants
        if (process.env.NODE_ENV === 'development') {
          console.log(`FPS: ${fps}, Frame time: ${deltaTime.toFixed(2)}ms`);
        }
        
        // Reset counters
        frameCountRef.current = 0;
        fpsStartTimeRef.current = now;
      }
    }
  }, []);

  // Main game loop function
  const gameLoop = useCallback((currentTime: number) => {
    if (!isRunningRef.current) {
      return;
    }

    // Calculate delta time in seconds
    const deltaTime = lastTimeRef.current === 0 ? 0 : (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    // Clamp delta time to prevent spiral of death
    const clampedDeltaTime = Math.min(deltaTime, PERFORMANCE.FIXED_TIMESTEP * PERFORMANCE.MAX_FRAME_SKIP / 1000);

    // Track performance
    trackPerformance(clampedDeltaTime * 1000); // Convert back to ms for logging

    // Call update callback with delta time
    if (clampedDeltaTime > 0) {
      updateCallback(clampedDeltaTime);
    }

    // Schedule next frame
    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [updateCallback, trackPerformance]);

  // Start the game loop
  const startLoop = useCallback(() => {
    if (isRunningRef.current) {
      return; // Already running
    }

    isRunningRef.current = true;
    lastTimeRef.current = 0; // Reset timing
    frameCountRef.current = 0;
    fpsStartTimeRef.current = 0;
    
    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Stop the game loop
  const stopLoop = useCallback(() => {
    if (!isRunningRef.current) {
      return; // Already stopped
    }

    isRunningRef.current = false;
    
    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  // Auto-start/stop based on shouldRun prop
  useEffect(() => {
    if (shouldRun) {
      startLoop();
    } else {
      stopLoop();
    }
  }, [shouldRun, startLoop, stopLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, [stopLoop]);

  // Handle visibility changes (pause when tab is not active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isRunningRef.current && shouldRun) {
          stopLoop();
        }
      } else {
        if (!isRunningRef.current && shouldRun) {
          startLoop();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [shouldRun, startLoop, stopLoop]);

  return {
    startLoop,
    stopLoop,
    isRunning: isRunningRef.current,
  };
}

// Specialized hook for game state updates
export function useGameUpdateLoop(
  gameUpdate: (deltaTime: number, isAccelerating: boolean) => void,
  isAccelerating: boolean,
  isActive: boolean
) {
  const updateCallback = useCallback((deltaTime: number) => {
    gameUpdate(deltaTime, isAccelerating);
  }, [gameUpdate, isAccelerating]);

  return useGameLoop(updateCallback, isActive);
}

// Hook for animation loops (non-game related)
export function useAnimationLoop(
  animationCallback: (deltaTime: number) => void,
  isActive: boolean = true
) {
  return useGameLoop(animationCallback, isActive);
}