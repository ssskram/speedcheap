"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const GameScene = dynamic(() => import("../../components/GameScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-orange-200 to-orange-400">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-900 mx-auto mb-4"></div>
      </div>
    </div>
  ),
});

const GameUI = dynamic(() => import("../../components/GameUI"), {
  ssr: false,
});

export default function GamePage() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-orange-200 to-orange-400">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-900 mx-auto mb-4"></div>
            </div>
          </div>
        }
      >
        <GameScene />
        <GameUI />
      </Suspense>
    </div>
  );
}
