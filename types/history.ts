export interface GameResult {
  id: string;
  timestamp: number;
  routeId: string;
  routeName: string;
  
  // Final scores
  finalScore: number;
  targetScore: number;
  
  // Completion status
  isWon: boolean;
  completionReason: 'success' | 'time-up' | 'insufficient-points';
  
  // Performance metrics
  duration: number; // actual play time in seconds
  averageSpeed: number;
  topSpeed: number;
  
  // Feature interaction stats
  featuresFound: number;
  featuresCompleted: number;
  completionRate: number;
  
  // Distance and time
  distanceCovered: number;
  timeRemaining: number;
}

export interface GameHistory {
  games: GameResult[];
  totalGames: number;
  totalWins: number;
  winRate: number;
  
  // Route-specific stats
  routeStats: Record<string, RouteStats>;
  
  // Overall performance
  bestScore: number;
  bestScoreRoute: string;
  averageScore: number;
  
  // Recent performance (last 10 games)
  recentWinRate: number;
  improvementTrend: 'improving' | 'declining' | 'stable';
}

export interface RouteStats {
  routeId: string;
  routeName: string;
  
  // Play count
  timesPlayed: number;
  timesWon: number;
  winRate: number;
  
  // Best performance
  bestScore: number;
  bestTime: number;
  bestCompletionRate: number;
  
  // Averages
  averageScore: number;
  averageSpeed: number;
  averageCompletionRate: number;
  
  // Progression
  firstPlayDate: number;
  lastPlayDate: number;
  isUnlocked: boolean;
}

export interface GameStats {
  // Overall statistics
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  
  // Performance metrics
  bestOverallScore: number;
  averageScore: number;
  totalPlayTime: number; // in minutes
  
  // Feature interaction
  totalFeaturesFound: number;
  totalFeaturesCompleted: number;
  overallCompletionRate: number;
  
  // Speed statistics
  highestSpeedEver: number;
  averageSpeedAcrossGames: number;
  
  // Recent performance (last 10 games)
  recentGames: GameResult[];
  recentWinRate: number;
  recentAverageScore: number;
  
  // Route progression
  routesUnlocked: string[];
  routesCompleted: string[];
}