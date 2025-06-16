import { useEffect, useCallback, useRef } from 'react';
import { InputState } from '../types/game';

interface GameInputHook {
  inputState: InputState;
  isAccelerating: boolean;
  bindInputHandlers: (element: HTMLElement) => void;
  unbindInputHandlers: () => void;
}

export function useGameInput(): GameInputHook {
  const inputStateRef = useRef<InputState>({
    keys: {
      space: false,
      up: false,
      down: false,
      left: false,
      right: false,
      escape: false,
      p: false,
    },
    mouse: {
      x: 0,
      y: 0,
      isDown: false,
    },
    touch: {
      x: 0,
      y: 0,
      isActive: false,
    },
  });

  const boundElementRef = useRef<HTMLElement | null>(null);

  // Keyboard event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const code = event.code.toLowerCase();
    
    switch (key) {
      case ' ':
      case 'space':
        inputStateRef.current.keys.space = true;
        event.preventDefault();
        break;
      case 'arrowup':
        inputStateRef.current.keys.up = true;
        event.preventDefault();
        break;
      case 'arrowdown':
        inputStateRef.current.keys.down = true;
        event.preventDefault();
        break;
      case 'arrowleft':
        inputStateRef.current.keys.left = true;
        event.preventDefault();
        break;
      case 'arrowright':
        inputStateRef.current.keys.right = true;
        event.preventDefault();
        break;
      case 'escape':
        inputStateRef.current.keys.escape = true;
        event.preventDefault();
        break;
      case 'p':
        inputStateRef.current.keys.p = true;
        event.preventDefault();
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    switch (key) {
      case ' ':
      case 'space':
        inputStateRef.current.keys.space = false;
        event.preventDefault();
        break;
      case 'arrowup':
        inputStateRef.current.keys.up = false;
        event.preventDefault();
        break;
      case 'arrowdown':
        inputStateRef.current.keys.down = false;
        event.preventDefault();
        break;
      case 'arrowleft':
        inputStateRef.current.keys.left = false;
        event.preventDefault();
        break;
      case 'arrowright':
        inputStateRef.current.keys.right = false;
        event.preventDefault();
        break;
      case 'escape':
        inputStateRef.current.keys.escape = false;
        event.preventDefault();
        break;
      case 'p':
        inputStateRef.current.keys.p = false;
        event.preventDefault();
        break;
    }
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((event: MouseEvent) => {
    inputStateRef.current.mouse.isDown = true;
    inputStateRef.current.mouse.x = event.clientX;
    inputStateRef.current.mouse.y = event.clientY;
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    inputStateRef.current.mouse.isDown = false;
    inputStateRef.current.mouse.x = event.clientX;
    inputStateRef.current.mouse.y = event.clientY;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    inputStateRef.current.mouse.x = event.clientX;
    inputStateRef.current.mouse.y = event.clientY;
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      inputStateRef.current.touch.isActive = true;
      inputStateRef.current.touch.x = touch.clientX;
      inputStateRef.current.touch.y = touch.clientY;
    }
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    event.preventDefault();
    inputStateRef.current.touch.isActive = false;
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      inputStateRef.current.touch.x = touch.clientX;
      inputStateRef.current.touch.y = touch.clientY;
    }
  }, []);

  // Prevent context menu on long press
  const handleContextMenu = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  // Prevent default behaviors that interfere with the game
  const handlePreventDefault = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  // Bind input handlers to an element
  const bindInputHandlers = useCallback((element: HTMLElement) => {
    if (boundElementRef.current) {
      unbindInputHandlers();
    }

    boundElementRef.current = element;

    // Keyboard events (global)
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Mouse events (element-specific)
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mousemove', handleMouseMove);

    // Touch events (element-specific)
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('contextmenu', handleContextMenu);

    // Prevent other default behaviors
    element.addEventListener('selectstart', handlePreventDefault);
    element.addEventListener('dragstart', handlePreventDefault);

    // Focus the element to ensure keyboard events work
    if (element.tabIndex < 0) {
      element.tabIndex = 0;
    }
    element.focus();
  }, [
    handleKeyDown,
    handleKeyUp,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleContextMenu,
    handlePreventDefault,
  ]);

  // Unbind all input handlers
  const unbindInputHandlers = useCallback(() => {
    // Remove keyboard events
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // Remove mouse and touch events
    if (boundElementRef.current) {
      const element = boundElementRef.current;
      
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mousemove', handleMouseMove);
      
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('contextmenu', handleContextMenu);
      
      element.removeEventListener('selectstart', handlePreventDefault);
      element.removeEventListener('dragstart', handlePreventDefault);
    }

    boundElementRef.current = null;
  }, [
    handleKeyDown,
    handleKeyUp,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleContextMenu,
    handlePreventDefault,
  ]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      unbindInputHandlers();
    };
  }, [unbindInputHandlers]);

  // Calculate if acceleration is active
  const isAccelerating = 
    inputStateRef.current.keys.space || 
    inputStateRef.current.keys.up || 
    inputStateRef.current.mouse.isDown || 
    inputStateRef.current.touch.isActive;

  return {
    inputState: inputStateRef.current,
    isAccelerating,
    bindInputHandlers,
    unbindInputHandlers,
  };
}

// Hook for handling pause/resume inputs
export function usePauseInput(onPause: () => void, onResume: () => void, isPaused: boolean) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key.toLowerCase() === 'p') {
        event.preventDefault();
        if (isPaused) {
          onResume();
        } else {
          onPause();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onPause, onResume, isPaused]);
}

// Hook for detecting mobile devices
export function useIsMobile(): boolean {
  const isMobile = 
    typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  return isMobile;
}