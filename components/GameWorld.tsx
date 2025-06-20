"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Plane } from "@react-three/drei";
import { Group } from "three";
import { useGameStore } from "../stores/gameStore";
import TruckModel from "./TruckModel";

// Quotes from "The Spell of the Sensuous" by David Abram
const baseQuotes = [
  "A story must be judged according to whether it makes sense. And 'making sense' must be here understood in its most direct meaning: to make sense is to enliven the senses.",
  "We ourselves are characters within a huge story that is visibly unfolding all around us, participants within the vast imagination, or Dreaming, of the world.",
  "We are human only in contact, and conviviality, with what is not human.",
  "Humans are tuned for relationship. The eyes, the skin, the tongue, ears, and nostrils—all are gates where our body receives the nourishment of otherness.",
  "As technological civilization diminishes the biotic diversity of the earth, language itself is diminished.",
  "At the heart of any language is the poetic productivity of expressive speech. A living language is continually being made and remade, woven out of the silence by those who speak.",
  "The world and I reciprocate one another. The landscape as I directly experience it is hardly a determinate object; it is an ambiguous realm that responds to my emotions and calls forth feelings from me in turn.",
  "This breathing landscape is no longer just a passive backdrop against which human history unfolds, but a potentized field of intelligence in which our actions participate.",
  "A civilization that relentlessly destroys the living land it inhabits is not well acquainted with truth, regardless of how many supported facts it has amassed.",
  "The body is a creative, shape-shifting entity. These mortal limits in no way close me off from the things around me or render my relations to them wholly predictable.",
  "A particular place in the land is never, for an oral culture, just a passive or inert setting for the human events that occur there. It is an active participant in those occurrences.",
  "Does the human intellect really spring us free from our inherence in the depths of this wild proliferation of forms? Or is it rooted in our forgotten contact with the multiple nonhuman shapes that surround us?",
  "To make sense is to release the body from the constraints imposed by outworn ways of speaking, and hence to renew and rejuvenate one's felt awareness of the world.",
  "It is to make the senses wake up to where they are.",
  "When we no longer hear the voices of warbler and wren, our own speaking can no longer be nourished by their cadences.",
  "As we drive more and more of the land's wild voices into the oblivion of extinction, our own languages become increasingly impoverished and weightless.",
  "This silence is that of our wordless participations, of our perceptual immersion in the depths of an animate, expressive world.",
  "Only as we begin to notice and to experience, once again, our immersion in the invisible air do we start to recall what it is to be fully a part of this world.",
  "Statements that foster violence toward the land can be described as false ways of speaking—ways that encourage an unsustainable relation with the encompassing earth.",
  "By virtue of its underlying and enveloping presence, the place may even be felt to be the source, the primary power that expresses itself through the various events that unfold there.",
  "Our own speaking can no longer be nourished by their cadences as the splashing speech of the rivers is silenced by more and more dams.",
  "We start to recall what it is to be fully a part of this world as we begin to notice our immersion in the invisible air.",
  "The civilized mind still feels itself somehow separate, autonomous, independent of the body and of bodily nature in general.",
  "Is the human intellect secretly borne by our forgotten contact with the multiple nonhuman shapes that surround us on every hand?",
];

// Shuffle quotes randomly for each gameplay
const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function GameWorld() {
  const roadRef = useRef<Group>(null);
  const worldRef = useRef<Group>(null);
  const { speed, position, isReading, currentBillboardPosition, stopReading } =
    useGameStore();

  // Shuffle quotes once per game and create lookup function
  const gameQuotes = useRef<string[]>();
  if (!gameQuotes.current) {
    gameQuotes.current = shuffleArray(baseQuotes);
  }

  // Function to get quote based on position in the world
  const getQuoteForPosition = (worldPosition: number): string => {
    // Calculate which billboard this should be based on game progress
    const billboardIndex = Math.floor((position - worldPosition) / 200);
    const adjustedIndex = Math.abs(billboardIndex) % gameQuotes.current!.length;
    return gameQuotes.current![adjustedIndex];
  };

  useFrame((state, delta) => {
    if (roadRef.current && worldRef.current) {
      // Move road and world based on speed (camera stays still, world moves toward us)
      const moveSpeed = speed * delta * 20;

      // Move road tiles toward the camera
      roadRef.current.children.forEach((child) => {
        child.position.z += moveSpeed;
        if (child.position.z > 50) {
          child.position.z -= 200;
        }
      });

      // Move world elements toward the camera
      worldRef.current.children.forEach((child) => {
        child.position.z += moveSpeed;
        if (child.position.z > 50) {
          child.position.z -= 400;
        }
      });

      // Check if the billboard we're reading has passed behind us
      if (isReading && currentBillboardPosition !== null && worldRef.current) {
        const billboards = worldRef.current.children.filter(
          (child) =>
            child.userData?.isBillboard &&
            child.userData?.originalPosition === currentBillboardPosition
        );

        if (billboards.length > 0) {
          const billboard = billboards[0];
          // If billboard has moved past the camera (z > 10), close the reading modal
          if (billboard.position.z > 10) {
            stopReading();
          }
        }
      }
    }
  });

  // Generate desert terrain
  const generateDesert = () => {
    const desert = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        desert.push(
          <Box
            key={`desert-${i}-${j}`}
            args={[4, 0.2, 4]}
            position={[
              (i - 10) * 4 + Math.random() * 1,
              -1 + Math.random() * 0.3,
              (j - 10) * 4 - 100,
            ]}
          >
            <meshLambertMaterial color="#DEB887" />
          </Box>
        );
      }
    }
    return desert;
  };

  // Generate road segments
  const generateRoad = () => {
    const road = [];
    for (let i = 0; i < 20; i++) {
      road.push(
        <Box
          key={`road-${i}`}
          args={[8, 0.1, 10]}
          position={[0, 0, i * 10 - 100]}
        >
          <meshLambertMaterial color="#333333" />
        </Box>
      );
    }
    return road;
  };

  // Generate billboards with position-based quotes
  const generateBillboards = () => {
    const billboards = [];

    // Create billboards at regular intervals - spread them out like before
    for (let i = 0; i < 20; i++) {
      const zPosition = i * -200 - 100; // Much wider spacing for better gameplay
      const side = i % 2 === 0 ? 1 : -1;
      const quote = getQuoteForPosition(zPosition);

      billboards.push(
        <group
          key={`billboard-${i}`}
          position={[side * 12, 3, zPosition]}
          userData={{ isBillboard: true, originalPosition: zPosition }}
        >
          {/* Billboard structure */}
          <Box args={[0.5, 6, 0.5]} position={[-3, 0, 0]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          <Box args={[0.5, 6, 0.5]} position={[3, 0, 0]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>

          {/* Billboard background - clickable and larger */}
          <Plane
            args={[6, 4]}
            position={[0, 1, 0]}
            onClick={(e) => {
              e.stopPropagation();
              const { isReading, isGameActive, isGameComplete, startReading } =
                useGameStore.getState();
              if (!isReading && isGameActive && !isGameComplete) {
                startReading(quote, zPosition); // Pass original z-position for tracking
              }
            }}
          >
            <meshLambertMaterial color="#F5F5DC" />
          </Plane>

          {/* Simple text representation using colored boxes - bigger */}
          <Box args={[0.15, 0.6, 0.1]} position={[-2.2, 1.8, 0.1]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          <Box args={[0.15, 0.6, 0.1]} position={[-1.1, 1.8, 0.1]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          <Box args={[0.15, 0.6, 0.1]} position={[0, 1.8, 0.1]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          <Box args={[0.15, 0.6, 0.1]} position={[1.1, 1.8, 0.1]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          <Box args={[0.15, 0.6, 0.1]} position={[2.2, 1.8, 0.1]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>

          {/* Line patterns to suggest text - bigger */}
          <Box args={[4.5, 0.15, 0.1]} position={[0, 1, 0.1]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          <Box args={[3.8, 0.15, 0.1]} position={[-0.35, 0.4, 0.1]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
          <Box args={[4.5, 0.15, 0.1]} position={[0, -0.2, 0.1]}>
            <meshLambertMaterial color="#8B4513" />
          </Box>
        </group>
      );
    }
    return billboards;
  };

  return (
    <group>
      {/* Road */}
      <group ref={roadRef}>
        {generateRoad()}

        {/* Road lines */}
        {Array.from({ length: 40 }, (_, i) => (
          <Box
            key={`line-${i}`}
            args={[0.3, 0.05, 3]}
            position={[0, 0.06, i * 5 - 100]}
          >
            <meshLambertMaterial color="#FFFF00" />
          </Box>
        ))}
      </group>

      {/* World elements that move toward camera */}
      <group ref={worldRef}>
        {/* Desert terrain */}
        {generateDesert()}

        {/* Billboards */}
        {generateBillboards()}
      </group>

      {/* Truck - positioned prominently in view */}
      <TruckModel />
    </group>
  );
}
