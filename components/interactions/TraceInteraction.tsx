'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Interaction, LandscapeFeature } from '../../types/game';
import { useGameStore } from '../../stores/gameStore';

interface TraceInteractionProps {
  interaction: Interaction;
  feature: LandscapeFeature;
}

export default function TraceInteraction({ interaction, feature }: TraceInteractionProps) {
  const { updateInteraction, completeInteraction } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [similarity, setSimilarity] = useState(0);

  const targetPath = interaction.targetPath || [
    { x: 50, y: 50 },
    { x: 100, y: 75 },
    { x: 150, y: 50 },
    { x: 200, y: 75 },
    { x: 250, y: 50 },
  ];

  useEffect(() => {
    drawCanvas();
  }, [currentPath, similarity]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw target path (faded)
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    targetPath.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw target path points
    ctx.fillStyle = 'rgba(156, 163, 175, 0.7)';
    targetPath.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw current path
    if (currentPath.length > 0) {
      ctx.strokeStyle = similarity > 0.7 ? '#10B981' : '#3B82F6';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      currentPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
  };

  const getCanvasPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const calculateSimilarity = (path: { x: number; y: number }[]) => {
    if (path.length < 2) return 0;

    // Simple similarity calculation based on distance from target path
    let totalDistance = 0;
    let comparisons = 0;

    path.forEach((point) => {
      let minDistance = Infinity;
      targetPath.forEach((targetPoint) => {
        const distance = Math.sqrt(
          Math.pow(point.x - targetPoint.x, 2) + Math.pow(point.y - targetPoint.y, 2)
        );
        minDistance = Math.min(minDistance, distance);
      });
      totalDistance += minDistance;
      comparisons++;
    });

    const averageDistance = totalDistance / comparisons;
    const maxAllowedDistance = 30; // pixels
    const similarity = Math.max(0, 1 - averageDistance / maxAllowedDistance);
    
    return similarity;
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasPosition(event);
    setCurrentPath([pos]);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    event.preventDefault();
    
    const pos = getCanvasPosition(event);
    const newPath = [...currentPath, pos];
    setCurrentPath(newPath);
    
    const newSimilarity = calculateSimilarity(newPath);
    setSimilarity(newSimilarity);
    updateInteraction(newSimilarity);
    
    if (newSimilarity > 0.8) {
      completeInteraction();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const resetPath = () => {
    setCurrentPath([]);
    setSimilarity(0);
    updateInteraction(0);
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Trace the ancestral path to connect with the traditional routes:
        </p>
        
        {/* Canvas for drawing */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden mx-auto" style={{ width: 300, height: 120 }}>
          <canvas
            ref={canvasRef}
            width={300}
            height={120}
            className="cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Path Similarity</span>
            <span className="text-sm font-medium">{Math.round(similarity * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-bar-fill transition-all duration-300 ${
                similarity > 0.7 ? 'bg-green-400' : 'bg-blue-400'
              }`}
              style={{ width: `${similarity * 100}%` }}
            />
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Follow the gray path with your mouse or finger</p>
          <p>Need {Math.round((0.8 - similarity) * 100)}% more accuracy to complete</p>
        </div>
        
        {/* Reset button */}
        <button
          onClick={resetPath}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
        >
          Clear Path
        </button>
      </div>
    </div>
  );
}