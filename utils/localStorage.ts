import { GameResult, GameHistory, GameStats, RouteStats } from '../types/history';
import { STORAGE } from './constants';

// Storage interface for game data
interface StoredGameData {
  version: number;
  games: GameResult[];
  timestamp: number;
}

// Safe JSON parsing with error handling
function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return fallback;
  }
}

// Safe localStorage operations
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('Failed to write to localStorage:', error);
    return false;
  }
}

// Load game history from localStorage
export function loadGameHistory(): GameResult[] {
  const stored = safeGetItem(STORAGE.GAME_HISTORY_KEY);
  
  if (!stored) {
    return [];
  }
  
  const data = safeJSONParse<StoredGameData>(stored, {
    version: STORAGE.VERSION,
    games: [],
    timestamp: Date.now(),
  });
  
  // Handle version migration if needed
  if (data.version !== STORAGE.VERSION) {
    console.log('Game data version mismatch, migrating...');
    return migrateGameData(data);
  }
  
  return data.games;
}

// Save game result to localStorage
export function saveGameResult(result: GameResult): boolean {
  const existingGames = loadGameHistory();
  
  // Add new result
  const updatedGames = [result, ...existingGames];
  
  // Trim to maximum stored games
  const trimmedGames = updatedGames.slice(0, STORAGE.MAX_STORED_GAMES);
  
  const dataToStore: StoredGameData = {
    version: STORAGE.VERSION,
    games: trimmedGames,
    timestamp: Date.now(),
  };
  
  return safeSetItem(STORAGE.GAME_HISTORY_KEY, JSON.stringify(dataToStore));
}

// Clear all game history
export function clearGameHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE.GAME_HISTORY_KEY);
    return true;
  } catch (error) {
    console.warn('Failed to clear game history:', error);
    return false;
  }
}

// Calculate comprehensive game statistics
export function calculateGameStats(games: GameResult[]): GameStats {
  if (games.length === 0) {
    return {
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
    };
  }
  
  const totalGames = games.length;
  const totalWins = games.filter(game => game.isWon).length;
  const totalLosses = totalGames - totalWins;
  const winRate = totalWins / totalGames;
  
  const bestOverallScore = Math.max(...games.map(game => game.finalScore));
  const averageScore = games.reduce((sum, game) => sum + game.finalScore, 0) / totalGames;
  const totalPlayTime = games.reduce((sum, game) => sum + game.duration, 0) / 60; // convert to minutes
  
  const totalFeaturesFound = games.reduce((sum, game) => sum + game.featuresFound, 0);
  const totalFeaturesCompleted = games.reduce((sum, game) => sum + game.featuresCompleted, 0);
  const overallCompletionRate = totalFeaturesFound > 0 ? totalFeaturesCompleted / totalFeaturesFound : 0;
  
  const highestSpeedEver = Math.max(...games.map(game => game.topSpeed));
  const averageSpeedAcrossGames = games.reduce((sum, game) => sum + game.averageSpeed, 0) / totalGames;
  
  // Recent games analysis (last 10 games)
  const recentGames = games.slice(0, 10);
  const recentWins = recentGames.filter(game => game.isWon).length;
  const recentWinRate = recentGames.length > 0 ? recentWins / recentGames.length : 0;
  const recentAverageScore = recentGames.length > 0 
    ? recentGames.reduce((sum, game) => sum + game.finalScore, 0) / recentGames.length 
    : 0;
  
  // Route progression
  const uniqueRoutes = [...new Set(games.map(game => game.routeId))];
  const completedRoutes = [...new Set(games.filter(game => game.isWon).map(game => game.routeId))];
  
  return {
    totalGames,
    totalWins,
    totalLosses,
    winRate,
    bestOverallScore,
    averageScore,
    totalPlayTime,
    totalFeaturesFound,
    totalFeaturesCompleted,
    overallCompletionRate,
    highestSpeedEver,
    averageSpeedAcrossGames,
    recentGames,
    recentWinRate,
    recentAverageScore,
    routesUnlocked: uniqueRoutes,
    routesCompleted: completedRoutes,
  };
}

// Calculate route-specific statistics
export function calculateRouteStats(games: GameResult[]): Record<string, RouteStats> {
  const routeStats: Record<string, RouteStats> = {};
  
  games.forEach(game => {
    const { routeId, routeName } = game;
    
    if (!routeStats[routeId]) {
      routeStats[routeId] = {
        routeId,
        routeName,
        timesPlayed: 0,
        timesWon: 0,
        winRate: 0,
        bestScore: 0,
        bestTime: 0,
        bestCompletionRate: 0,
        averageScore: 0,
        averageSpeed: 0,
        averageCompletionRate: 0,
        firstPlayDate: game.timestamp,
        lastPlayDate: game.timestamp,
        isUnlocked: true,
      };
    }
    
    const stats = routeStats[routeId];
    
    // Update counters
    stats.timesPlayed++;
    if (game.isWon) stats.timesWon++;
    
    // Update bests
    stats.bestScore = Math.max(stats.bestScore, game.finalScore);
    stats.bestTime = Math.max(stats.bestTime, game.duration);
    stats.bestCompletionRate = Math.max(stats.bestCompletionRate, game.completionRate);
    
    // Update date range
    stats.firstPlayDate = Math.min(stats.firstPlayDate, game.timestamp);
    stats.lastPlayDate = Math.max(stats.lastPlayDate, game.timestamp);
  });
  
  // Calculate averages and rates
  Object.values(routeStats).forEach(stats => {
    const routeGames = games.filter(game => game.routeId === stats.routeId);
    
    stats.winRate = stats.timesWon / stats.timesPlayed;
    stats.averageScore = routeGames.reduce((sum, game) => sum + game.finalScore, 0) / routeGames.length;
    stats.averageSpeed = routeGames.reduce((sum, game) => sum + game.averageSpeed, 0) / routeGames.length;
    stats.averageCompletionRate = routeGames.reduce((sum, game) => sum + game.completionRate, 0) / routeGames.length;
  });
  
  return routeStats;
}

// Generate complete game history object
export function generateGameHistory(games: GameResult[]): GameHistory {
  const stats = calculateGameStats(games);
  const routeStats = calculateRouteStats(games);
  
  // Calculate improvement trend
  const recentGames = games.slice(0, 10);
  const olderGames = games.slice(10, 20);
  
  let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
  
  if (recentGames.length >= 5 && olderGames.length >= 5) {
    const recentAvg = recentGames.reduce((sum, game) => sum + game.finalScore, 0) / recentGames.length;
    const olderAvg = olderGames.reduce((sum, game) => sum + game.finalScore, 0) / olderGames.length;
    
    const improvement = (recentAvg - olderAvg) / olderAvg;
    
    if (improvement > 0.1) improvementTrend = 'improving';
    else if (improvement < -0.1) improvementTrend = 'declining';
  }
  
  return {
    games,
    totalGames: stats.totalGames,
    totalWins: stats.totalWins,
    winRate: stats.winRate,
    routeStats,
    bestScore: stats.bestOverallScore,
    bestScoreRoute: games.find(game => game.finalScore === stats.bestOverallScore)?.routeId || '',
    averageScore: stats.averageScore,
    recentWinRate: stats.recentWinRate,
    improvementTrend,
  };
}

// Migrate game data between versions
function migrateGameData(data: StoredGameData): GameResult[] {
  // For now, just return the games as-is
  // In future versions, implement migration logic here
  console.log('No migration needed for version', data.version);
  return data.games || [];
}

// Check if localStorage is available
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

// Export storage information
export function getStorageInfo(): { isAvailable: boolean; gameCount: number; estimatedSize: string } {
  const isAvailable = isLocalStorageAvailable();
  
  if (!isAvailable) {
    return {
      isAvailable: false,
      gameCount: 0,
      estimatedSize: '0 KB',
    };
  }
  
  const games = loadGameHistory();
  const stored = safeGetItem(STORAGE.GAME_HISTORY_KEY);
  const estimatedSize = stored ? `${Math.round(stored.length / 1024)} KB` : '0 KB';
  
  return {
    isAvailable: true,
    gameCount: games.length,
    estimatedSize,
  };
}