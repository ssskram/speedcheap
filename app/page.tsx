"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleStartGame = () => {
    router.push("/game");
  };

  return (
    <div className="min-h-screen">
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <div>
          <Image
            src="/purple_truck_profile.png"
            alt="Purple Truck"
            width={320}
            height={192}
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <div>
            <p className="text-gray-700">
              In the liminal space between velocity and contemplation, where
              asphalt becomes prayer and the landscape whispers ancient
              wisdom...
            </p>

            <p className="text-sm text-gray-600">
              Will you rush past the teachings, or slow enough to receive what
              the landscape offers? The choice reshapes both journey and
              traveler.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartGame}
              style={{
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(245, 158, 11, 0.3)",
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
              Begin the Journey →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
