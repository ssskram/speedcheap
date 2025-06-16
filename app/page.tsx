'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../stores/gameStore';
import { useGameHistory } from '../hooks/useGameHistory';
import { ROUTES } from '../utils/constants';
import { populateRoutes } from '../utils/featureGeneration';

export default function Home() {
  const router = useRouter();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(ROUTES[0].id);
  
  const { initializeGame } = useGameStore();
  const { history, recentGames, isLoading } = useGameHistory();

  // Populate routes with features
  const availableRoutes = populateRoutes(ROUTES);
  const selectedRoute = availableRoutes.find(r => r.id === selectedRouteId) || availableRoutes[0];

  const handleStartGame = () => {
    initializeGame(selectedRoute);
    router.push('/game');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getResultIcon = (isWon: boolean) => isWon ? '🎉' : '⏰';
  const getResultColor = (isWon: boolean) => isWon ? 'text-green-600' : 'text-red-600';

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-6">
            <Image
              src="/purple_truck_profile.png"
              alt="Purple truck"
              width={120}
              height={80}
              className="mx-auto pixelated"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Speed is Cheap
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            "The faster we move, the less it's all worth"
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Inspired by David Abram's "The Spell of the Sensuous" — Drive across the Australian Outback 
            and learn to read the landscape at the proper pace. Balance speed with deep observation.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Route Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Journey</h2>
            
            <div className="space-y-4 mb-8">
              {availableRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`route-card ${selectedRouteId === route.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRouteId(route.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {route.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {route.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Distance</span>
                          <div className="font-semibold">{route.distance} miles</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Time Limit</span>
                          <div className="font-semibold">{route.duration} min</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Target Points</span>
                          <div className="font-semibold">{route.targetPoints.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Features</span>
                          <div className="font-semibold">{route.features.length}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        route.terrain === 'desert' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : route.terrain === 'grassland'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {route.terrain.charAt(0).toUpperCase() + route.terrain.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Start Game Button */}
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="game-button text-lg px-8 py-4"
              >
                Begin Journey: {selectedRoute.name}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Use SPACE or ↑ to accelerate • Click features to interact • ESC to pause
              </p>
            </div>
          </div>

          {/* Game History Sidebar */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Journeys</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading history...</p>
              </div>
            ) : recentGames.length === 0 ? (
              <div className="game-card text-center py-8">
                <p className="text-gray-500 mb-4">No journeys yet</p>
                <p className="text-sm text-gray-400">
                  Complete your first route to see your progress here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentGames.slice(0, 5).map((game) => (
                  <div key={game.id} className="game-card py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getResultIcon(game.isWon)}</span>
                        <span className="font-medium text-sm">{game.routeName}</span>
                      </div>
                      <span className={`text-xs font-medium ${getResultColor(game.isWon)}`}>
                        {game.isWon ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="text-gray-500">Score:</span> {game.finalScore.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span> {formatDuration(game.duration)}
                      </div>
                      <div>
                        <span className="text-gray-500">Speed:</span> {Math.round(game.averageSpeed)} mph
                      </div>
                      <div>
                        <span className="text-gray-500">Features:</span> {Math.round(game.completionRate * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Overall Stats */}
            {history && history.totalGames > 0 && (
              <div className="game-card mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Overall Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Journeys:</span>
                    <span className="font-medium">{history.totalGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium">{Math.round(history.winRate * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Score:</span>
                    <span className="font-medium">{history.bestScore.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Improvement:</span>
                    <span className={`font-medium ${
                      history.improvementTrend === 'improving' 
                        ? 'text-green-600' 
                        : history.improvementTrend === 'declining' 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                    }`}>
                      {history.improvementTrend === 'improving' ? '↗ Improving' :
                       history.improvementTrend === 'declining' ? '↘ Declining' :
                       '→ Stable'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p className="mb-2">
            "The faster the vehicle moved, the faster these people spoke, as though they were trying to keep pace with the land itself..."
          </p>
          <p>— David Abram, <em>The Spell of the Sensuous</em></p>
        </footer>
      </div>
    </main>
  );
}
