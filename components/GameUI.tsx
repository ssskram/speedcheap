"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "../stores/gameStore";

export default function GameUI() {
  const router = useRouter();
  const [currentReadingPoints, setCurrentReadingPoints] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const {
    speed,
    score,
    timeRemaining,
    position,
    isGameActive,
    isGameComplete,
    isReading,
    currentQuote,
    readingStartTime,
    setSpeed,
    startGame,
    resetGame,
    stopReading,
    updateTime,
    updatePosition,
  } = useGameStore();

  // Game loop - always running when game is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive) {
      interval = setInterval(() => {
        updateTime(1);
        updatePosition(1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, updateTime, updatePosition]);

  // Update reading points in real-time with speed multiplier
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading && readingStartTime > 0) {
      interval = setInterval(() => {
        const readingTime = (Date.now() - readingStartTime) / 1000;
        const speedMultiplier = Math.max(0.5, 3 - speed * 0.5);
        setCurrentReadingPoints(Math.floor(readingTime * 10 * speedMultiplier));
      }, 100);
    } else {
      setCurrentReadingPoints(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReading, readingStartTime, speed]);

  const handleBackToMenu = () => {
    resetGame();
    router.push("/");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = Math.min((position / 1500) * 100, 100);

  const handleStartGame = useCallback(() => {
    setShowWelcomeModal(false);
    startGame();
  }, [startGame]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      {/* Welcome Modal */}
      {showWelcomeModal && !isGameActive && !isGameComplete && (
        <>
          {/* Modal Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              zIndex: 10005,
              pointerEvents: "auto",
            }}
          />

          {/* Welcome Modal Content */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              border: "2px solid #f59e0b",
              maxWidth: "320px",
              width: "75%",
              zIndex: 10006,
              pointerEvents: "auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                textAlign: "left",
                marginBottom: "20px",
                lineHeight: "1.7",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: "#2c2621",
                  letterSpacing: "0.3px",
                  fontWeight: "400",
                }}
              >
                <strong>🎯 Objective:</strong> Arrive at your destination on
                time, but collect wisdom along the way.
              </p>

              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: "#2c2621",
                  letterSpacing: "0.3px",
                  fontWeight: "400",
                }}
              >
                <strong>📖 Wisdom:</strong> Click roadside objects to read the
                landscape.
              </p>

              <p
                style={{
                  margin: "0 0 0 0",
                  fontSize: "14px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: "#2c2621",
                  letterSpacing: "0.3px",
                  fontWeight: "400",
                }}
              >
                <strong>⚡ Speed:</strong> Higher speeds cover more distance but
                make the landscape harder to read.
              </p>
            </div>

            <button
              onClick={handleStartGame}
              style={{
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 3px 8px rgba(245, 158, 11, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#d97706";
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#f59e0b";
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              START
            </button>
          </div>
        </>
      )}

      {/* Bottom Panel - Only when game active and NOT complete */}
      {isGameActive && !isGameComplete && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
            backgroundColor: "white",
            border: "2px solid #f59e0b",
            padding: "10px",
            zIndex: 10003,
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div
              style={{
                flex: 1,
                padding: "5px",
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "#92400e" }}>Score</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#92400e",
                }}
              >
                {score + currentReadingPoints}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "5px",
                backgroundColor: "#fee2e2",
                border: "1px solid #ef4444",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "#991b1b" }}>Time</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#991b1b",
                }}
              >
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "5px",
                backgroundColor: "#dbeafe",
                border: "1px solid #3b82f6",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "#1e40af" }}>Speed</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1e40af",
                }}
              >
                {speed.toFixed(1)}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "5px",
                backgroundColor: "#dcfce7",
                border: "1px solid #22c55e",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "#15803d" }}>Progress</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#15803d",
                }}
              >
                {progressPercentage.toFixed(0)}%
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setSpeed(Math.max(0, speed - 0.5))}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              -
            </button>

            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={{ flex: 1, height: "8px" }}
            />

            <button
              onClick={() => setSpeed(Math.min(5, speed + 0.5))}
              style={{
                backgroundColor: "#22c55e",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              +
            </button>

            <button
              onClick={handleBackToMenu}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              EXIT
            </button>
          </div>
        </div>
      )}

      {/* Game Complete Screen - Shows in place of game controls */}
      {isGameComplete && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "2px solid #f59e0b",
            padding: "20px",
            zIndex: 10003,
            pointerEvents: "auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: "24px",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: "bold",
                color: "#92400e",
                letterSpacing: "0.3px",
              }}
            >
              {position >= 1500 ? "🏆 Congratulations!" : "⏰ Time's Up!"}
            </h2>

            {/* Final Stats */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #f59e0b",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div 
                  style={{ 
                    fontSize: "14px", 
                    color: "#92400e",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    letterSpacing: "0.3px",
                  }}
                >
                  Final Score
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#92400e",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    letterSpacing: "0.3px",
                  }}
                >
                  {score}
                </div>
              </div>
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#dcfce7",
                  border: "1px solid #22c55e",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div 
                  style={{ 
                    fontSize: "14px", 
                    color: "#15803d",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    letterSpacing: "0.3px",
                  }}
                >
                  Distance
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#15803d",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    letterSpacing: "0.3px",
                  }}
                >
                  {position.toFixed(0)}/1500 km
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              onClick={() => {
                resetGame();
                setShowWelcomeModal(true);
              }}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Play Again
            </button>
            <button
              onClick={handleBackToMenu}
              style={{
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}

      {/* Reading Modal */}
      {isReading && currentQuote && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fefbf3",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid #d4c4a0",
            maxWidth: "480px",
            minWidth: "320px",
            zIndex: 10004,
            pointerEvents: "auto",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
            backdropFilter: "blur(8px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p
            style={{
              margin: 0,
              textAlign: "justify",
              color: "#2c2621",
              lineHeight: "1.7",
              fontSize: "15px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: "400",
              letterSpacing: "0.3px",
              textIndent: "1.2em",
            }}
          >
            {currentQuote}
          </p>
        </div>
      )}

      {/* Modal Overlay for Closing */}
      {isReading && currentQuote && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10003,
            pointerEvents: "auto",
          }}
          onClick={stopReading}
        />
      )}
    </div>
  );
}
