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
      {/* GitHub link in top right corner with half-moon design */}
      <a
        href="https://github.com/ssskram/speedcheap"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          width: "80px",
          height: "80px",
          backgroundColor: "#f59e0b",
          borderBottomLeftRadius: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          paddingBottom: "12px",
          paddingLeft: "12px",
          zIndex: 1000,
          boxShadow: "0 2px 6px rgba(245, 158, 11, 0.3)",
        }}
        onMouseOver={(e) => {
          (e.target as HTMLAnchorElement).style.transform = "translateY(-2px)";
        }}
        onMouseOut={(e) => {
          (e.target as HTMLAnchorElement).style.transform = "translateY(0)";
        }}
      >
        <Image src="/github.png" alt="GitHub" width={36} height={36} />
      </a>

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
            height={300}
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center pb-4">
          <div>
            <p 
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#2c2621",
                lineHeight: "1.7",
                letterSpacing: "0.3px",
                textAlign: "justify",
                fontWeight: "400",
                fontSize: "16px",
                margin: "0 0 16px 0"
              }}
            >
              In the liminal space between velocity and contemplation, where
              asphalt becomes prayer and the landscape whispers ancient
              wisdom...
            </p>

            <p 
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#2c2621",
                lineHeight: "1.7",
                letterSpacing: "0.3px",
                textAlign: "justify",
                fontWeight: "400",
                fontSize: "16px",
                margin: "0"
              }}
            >
              Will you rush past the teachings, or move slow enough to receive what
              the landscape offers? The choice reshapes both journey and
              traveler.
            </p>
          </div>

          <div style={{ marginTop: "24px" }}>
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
