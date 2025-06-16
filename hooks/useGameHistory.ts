import { useState, useEffect, useCallback } from 'react';
import { GameHistory, GameResult, GameStats } from '../types/history';
import { 
  loadGameHistory, 
  generateGameHistory, 
  calculateGameStats,
  clearGameHistory,
  getStorageInfo 
} from '../utils/localStorage';

interface GameHistoryHook {
  history: GameHistory | null;
  stats: GameStats | null;
  recentGames: GameResult[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshHistory: () => void;
  clearHistory: () => Promise<boolean>;
  getStorageInfo: () => { isAvailable: boolean; gameCount: number; estimatedSize: string };
}

export function useGameHistory(): GameHistoryHook {
  const [history, setHistory] = useState<GameHistory | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load game history and calculate stats
  const loadAndProcessHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const games = loadGameHistory();
      const gameHistory = generateGameHistory(games);
      const gameStats = calculateGameStats(games);

      setHistory(gameHistory);
      setStats(gameStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game history');
      console.error('Error loading game history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh history (useful after completing a game)
  const refreshHistory = useCallback(() => {
    loadAndProcessHistory();
  }, [loadAndProcessHistory]);

  // Clear all game history
  const clearHistoryAction = useCallback(async (): Promise<boolean> => {
    try {
      const success = clearGameHistory();
      if (success) {
        setHistory({
          games: [],
          totalGames: 0,
          totalWins: 0,
          winRate: 0,
          routeStats: {},
          bestScore: 0,
          bestScoreRoute: '',
          averageScore: 0,
          recentWinRate: 0,
          improvementTrend: 'stable',
        });
        setStats({
          totalGames: 0,
          totalWins: 0,
          totalLosses: 0,
          winRate: 0,
          bestOverallScore: 0,
          averageScore: 0,
          totalPlayTime: 0,
          totalFeaturesFound: 0,
          totalFeaturesCompleted: 0,
          overallCompletionRate: 0,
          highestSpeedEver: 0,
          averageSpeedAcrossGames: 0,
          recentGames: [],
          recentWinRate: 0,
          recentAverageScore: 0,
          routesUnlocked: [],
          routesCompleted: [],
        });
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear game history');
      return false;
    }
  }, []);

  // Load history on mount
  useEffect(() => {
    loadAndProcessHistory();
  }, [loadAndProcessHistory]);

  // Get recent games (last 10)
  const recentGames = history?.games.slice(0, 10) || [];

  return {
    history,
    stats,
    recentGames,
    isLoading,
    error,
    refreshHistory,
    clearHistory: clearHistoryAction,
    getStorageInfo,
  };
}

// Hook for specific route statistics
export function useRouteStats(routeId: string) {
  const { history } = useGameHistory();
  
  const routeStats = history?.routeStats[routeId] || null;
  const routeGames = history?.games.filter(game => game.routeId === routeId) || [];
  
  return {
    stats: routeStats,
    games: routeGames,
    hasPlayed: routeGames.length > 0,
    bestScore: routeStats?.bestScore || 0,
    winRate: routeStats?.winRate || 0,
    timesPlayed: routeStats?.timesPlayed || 0,
  };
}

// Hook for performance analysis
export function usePerformanceAnalysis() {
  const { history, stats } = useGameHistory();
  
  const analysisData = {
    // Improvement trend
    improvementTrend: history?.improvementTrend || 'stable',
    
    // Score progression
    scoreProgression: history?.games.slice(0, 20).reverse().map((game, index) => ({
      gameNumber: index + 1,
      score: game.finalScore,
      isWon: game.isWon,
      date: new Date(game.timestamp),
    })) || [],
    
    // Route performance comparison
    routeComparison: Object.values(history?.routeStats || {}).map(route => ({
      routeName: route.routeName,
      winRate: route.winRate,
      averageScore: route.averageScore,
      timesPlayed: route.timesPlayed,
    })),
    
    // Recent vs overall performance
    performanceComparison: {
      overall: {
        winRate: stats?.winRate || 0,
        averageScore: stats?.averageScore || 0,
        completionRate: stats?.overallCompletionRate || 0,
      },
      recent: {
        winRate: stats?.recentWinRate || 0,
        averageScore: stats?.recentAverageScore || 0,
        completionRate: stats?.recentGames && stats.recentGames.length > 0 
          ? stats.recentGames.reduce((sum, game) => sum + game.completionRate, 0) / stats.recentGames.length
          : 0,
      },
    },
    
    // Speed analysis
    speedAnalysis: {
      highestSpeed: stats?.highestSpeedEver || 0,
      averageSpeed: stats?.averageSpeedAcrossGames || 0,
      speedTrends: history?.games.slice(0, 10).map(game => ({
        averageSpeed: game.averageSpeed,
        topSpeed: game.topSpeed,
        score: game.finalScore,
        completionRate: game.completionRate,
      })) || [],
    },
  };
  
  return analysisData;
}

// Hook for achievement tracking
export function useAchievements() {
  const { stats, history } = useGameHistory();
  
  const achievements = {
    // Basic achievements
    firstWin: (stats?.totalWins || 0) >= 1,
    perfectRun: history?.games.some(game => game.completionRate >= 1.0) || false,
    speedDemon: (stats?.highestSpeedEver || 0) >= 70,
    slowAndSteady: history?.games.some(game => game.averageSpeed <= 20 && game.isWon) || false,
    
    // Milestone achievements
    marathoner: (stats?.totalPlayTime || 0) >= 60, // 1 hour total
    dedicated: (stats?.totalGames || 0) >= 50,
    expert: (stats?.totalWins || 0) >= 20,
    master: (stats?.winRate || 0) >= 0.8 && (stats?.totalGames || 0) >= 10,
    
    // Route-specific achievements
    desertExplorer: stats?.routesCompleted.includes('desert-crossing') || false,
    grasslandWanderer: stats?.routesCompleted.includes('grassland-journey') || false,
    mountainClimber: stats?.routesCompleted.includes('mountain-passage') || false,
    
    // Advanced achievements
    consistent: (stats?.recentWinRate || 0) >= 0.7 && (stats?.recentGames.length || 0) >= 10,
    improving: history?.improvementTrend === 'improving',
    
    // Feature interaction achievements
    observant: (stats?.totalFeaturesCompleted || 0) >= 100,
    storyteller: (stats?.overallCompletionRate || 0) >= 0.8,
  };
  
  // Count unlocked achievements
  const unlockedCount = Object.values(achievements).filter(Boolean).length;
  const totalCount = Object.keys(achievements).length;
  
  return {
    achievements,
    unlockedCount,
    totalCount,
    completionRate: unlockedCount / totalCount,
  };
}