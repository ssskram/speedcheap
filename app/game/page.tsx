'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../../stores/gameStore';
import { useGameHistory } from '../../hooks/useGameHistory';
import GameCanvas from '../../components/game/GameCanvas';

export default function GamePage() {
  const router = useRouter();
  const { refreshHistory } = useGameHistory();
  
  const { 
    status, 
    route, 
    points, 
    targetPoints, 
    resetGame,
    getTimeRemainingFormatted 
  } = useGameStore();

  // Handle game end states
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      // Refresh history to include the completed game
      refreshHistory();
      
      // Show end game screen after a delay
      const timer = setTimeout(() => {
        showEndGameDialog();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, refreshHistory]);

  // Redirect to menu if no game is active
  useEffect(() => {
    if (status === 'menu') {
      router.push('/');
    }
  }, [status, router]);

  const showEndGameDialog = () => {
    const isWon = status === 'won';
    const title = isWon ? '🎉 Journey Complete!' : '⏰ Time\'s Up!';
    const message = isWon 
      ? `Congratulations! You've successfully read the landscape and earned ${points} points on the ${route.name}.`
      : `The sun sets before you could gather enough wisdom. You earned ${points} of ${targetPoints} points needed.`;
    
    const playAgain = window.confirm(`${title}\n\n${message}\n\nWould you like to return to the menu?`);
    
    if (playAgain) {
      resetGame();
      router.push('/');
    }
  };

  if (status === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Returning to menu...</p>
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-200 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Game status overlay for end states */}
        {(status === 'won' || status === 'lost') && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center max-w-md w-full mx-4 shadow-2xl">
              {status === 'won' ? (
                <div>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-green-600 mb-4">Journey Complete!</h2>
                  <p className="text-gray-700 mb-4">
                    You've successfully read the landscape of the <strong>{route.name}</strong>!
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="text-lg font-semibold text-green-800">
                      Final Score: {points.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">
                      Target: {targetPoints.toLocaleString()} • Time: {getTimeRemainingFormatted()}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">⏰</div>
                  <h2 className="text-2xl font-bold text-red-600 mb-4">Time's Up!</h2>
                  <p className="text-gray-700 mb-4">
                    The sun sets before you could gather enough wisdom from the <strong>{route.name}</strong>.
                  </p>
                  <div className="bg-red-50 rounded-lg p-4 mb-4">
                    <div className="text-lg font-semibold text-red-800">
                      Final Score: {points.toLocaleString()}
                    </div>
                    <div className="text-sm text-red-600">
                      Needed: {targetPoints.toLocaleString()} • Deficit: {(targetPoints - points).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                You'll return to the menu shortly...
              </div>
            </div>
          </div>
        )}

        {/* Main game canvas */}
        <GameCanvas className="w-full rounded-xl overflow-hidden shadow-2xl" />
        
        {/* Game info footer */}
        <div className="mt-4 text-center text-white">
          <p className="text-sm opacity-80">
            <strong>{route.name}</strong> • {route.description}
          </p>
          <p className="text-xs opacity-60 mt-1">
            The faster you move, the less it's all worth • Read the landscape with care
          </p>
        </div>
      </div>
    </main>
  );
}