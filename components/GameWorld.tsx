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
    // Calculate which quote this should be based on game progress
    const quoteIndex = Math.floor((position - worldPosition) / 200);
    const adjustedIndex = Math.abs(quoteIndex) % gameQuotes.current!.length;
    return gameQuotes.current![adjustedIndex];
  };
  
  // Function to get random natural object type
  const getNaturalObject = (index: number) => {
    const objects = ['rock', 'tree', 'cactus', 'boulder', 'shrub', 'deadtree', 'mountain', 'mesa'];
    return objects[index % objects.length];
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

    // Generate natural objects with position-based quotes
  const generateNaturalObjects = () => {
    const objects = [];
    
    // Create natural objects at regular intervals - spread them out like before
    for (let i = 0; i < 20; i++) {
      const zPosition = i * -200 - 100; // Much wider spacing for better gameplay
      const side = i % 2 === 0 ? 1 : -1;
      const quote = getQuoteForPosition(zPosition);
      const objectType = getNaturalObject(i);
      
      // Position objects closer to the road for easier clicking
      const xPosition = side * 8; // Closer than billboards were
      
      objects.push(
        <group 
          key={`nature-${i}`} 
          position={[xPosition, 0, zPosition]}
          userData={{ isBillboard: true, originalPosition: zPosition }} // Keep same userData for compatibility
          onClick={(e) => {
            e.stopPropagation();
            const { isReading, isGameActive, isGameComplete, startReading } =
              useGameStore.getState();
            if (!isReading && isGameActive && !isGameComplete) {
              startReading(quote, zPosition);
            }
          }}
        >
          {/* Render different natural objects based on type */}
          {objectType === 'rock' && (
            <>
              {/* Clustered rock formation */}
              <Box args={[1.8, 1.2, 1.5]} position={[0, 0.6, 0]} rotation={[0, 0.3, 0]}>
                <meshLambertMaterial color="#8B7355" />
              </Box>
              <Box args={[1.2, 0.8, 1.0]} position={[0.8, 0.4, 0.5]} rotation={[0, -0.2, 0]}>
                <meshLambertMaterial color="#A0522D" />
              </Box>
              <Box args={[0.8, 0.6, 0.8]} position={[-0.5, 0.3, -0.3]} rotation={[0, 0.5, 0]}>
                <meshLambertMaterial color="#696969" />
              </Box>
            </>
          )}
          
          {objectType === 'boulder' && (
            <>
              {/* Large irregular boulder */}
              <Box args={[4, 3, 3.5]} position={[0, 1.5, 0]} rotation={[0, 0.4, 0.1]}>
                <meshLambertMaterial color="#555555" />
              </Box>
              <Box args={[2.5, 2, 2]} position={[1, 2.5, 1]} rotation={[0.1, -0.3, 0]}>
                <meshLambertMaterial color="#696969" />
              </Box>
            </>
          )}
          
          {objectType === 'tree' && (
            <>
              {/* Realistic tree trunk */}
              <Box args={[0.8, 5, 0.8]} position={[0, 2.5, 0]} rotation={[0, 0.1, 0.05]}>
                <meshLambertMaterial color="#654321" />
              </Box>
              {/* Layered canopy */}
              <Box args={[4, 2.5, 4]} position={[0, 6, 0]} rotation={[0, 0.2, 0]}>
                <meshLambertMaterial color="#228B22" />
              </Box>
              <Box args={[3, 2, 3]} position={[0.3, 7.5, -0.2]} rotation={[0, -0.3, 0]}>
                <meshLambertMaterial color="#32CD32" />
              </Box>
              <Box args={[2, 1.5, 2]} position={[-0.2, 8.5, 0.3]} rotation={[0, 0.4, 0]}>
                <meshLambertMaterial color="#228B22" />
              </Box>
            </>
          )}
          
          {objectType === 'deadtree' && (
            <>
              {/* Weathered dead tree */}
              <Box args={[0.6, 6, 0.6]} position={[0, 3, 0]} rotation={[0, 0, 0.1]}>
                <meshLambertMaterial color="#8B4513" />
              </Box>
              {/* Multiple twisted branches */}
              <Box args={[2.5, 0.3, 0.3]} position={[1.2, 4.5, 0]} rotation={[0, 0, 0.2]}>
                <meshLambertMaterial color="#A0522D" />
              </Box>
              <Box args={[1.8, 0.25, 0.25]} position={[-0.9, 3.8, 0.3]} rotation={[0.1, 0.3, -0.3]}>
                <meshLambertMaterial color="#8B4513" />
              </Box>
              <Box args={[1.2, 0.2, 0.2]} position={[0.8, 5.2, -0.4]} rotation={[-0.1, -0.2, 0.4]}>
                <meshLambertMaterial color="#A0522D" />
              </Box>
            </>
          )}
          
          {objectType === 'cactus' && (
            <>
              {/* Saguaro-style cactus */}
              <Box args={[1.2, 4, 1.2]} position={[0, 2, 0]}>
                <meshLambertMaterial color="#228B22" />
              </Box>
              {/* Multiple arms */}
              <Box args={[0.8, 2.5, 0.8]} position={[1.5, 3, 0]} rotation={[0, 0, 0.3]}>
                <meshLambertMaterial color="#228B22" />
              </Box>
              <Box args={[0.7, 1.8, 0.7]} position={[-1.2, 2.5, 0.3]} rotation={[0, 0, -0.4]}>
                <meshLambertMaterial color="#228B22" />
              </Box>
              {/* Ribbed texture suggestion */}
              <Box args={[1.3, 4.2, 0.1]} position={[0, 2, 0.6]}>
                <meshLambertMaterial color="#32CD32" />
              </Box>
            </>
          )}
          
          {objectType === 'shrub' && (
            <>
              {/* Desert shrub cluster */}
              <Box args={[2.5, 1.2, 2]} position={[0, 0.6, 0]} rotation={[0, 0.3, 0]}>
                <meshLambertMaterial color="#9ACD32" />
              </Box>
              <Box args={[1.8, 0.8, 1.5]} position={[0.8, 0.4, -0.5]} rotation={[0, -0.4, 0]}>
                <meshLambertMaterial color="#8FBC8F" />
              </Box>
              <Box args={[1.2, 0.6, 1.2]} position={[-0.6, 0.3, 0.7]} rotation={[0, 0.6, 0]}>
                <meshLambertMaterial color="#228B22" />
              </Box>
            </>
          )}
          
          {objectType === 'mountain' && (
            <>
              {/* Distant mountain silhouette */}
              <Box args={[8, 12, 6]} position={[0, 6, 0]} rotation={[0, 0.2, 0]}>
                <meshLambertMaterial color="#8B7D6B" />
              </Box>
              <Box args={[6, 8, 4]} position={[3, 8, 2]} rotation={[0, -0.3, 0]}>
                <meshLambertMaterial color="#A0522D" />
              </Box>
              <Box args={[5, 6, 3]} position={[-2, 9, -1]} rotation={[0, 0.4, 0]}>
                <meshLambertMaterial color="#696969" />
              </Box>
            </>
          )}
          
          {objectType === 'mesa' && (
            <>
              {/* Flat-topped mesa */}
              <Box args={[6, 8, 4]} position={[0, 4, 0]}>
                <meshLambertMaterial color="#D2691E" />
              </Box>
              <Box args={[6.2, 1, 4.2]} position={[0, 8.5, 0]}>
                <meshLambertMaterial color="#CD853F" />
              </Box>
              {/* Layered rock strata */}
              <Box args={[6.1, 0.3, 4.1]} position={[0, 6, 0]}>
                <meshLambertMaterial color="#A0522D" />
              </Box>
              <Box args={[6.1, 0.3, 4.1]} position={[0, 4, 0]}>
                <meshLambertMaterial color="#8B4513" />
              </Box>
            </>
          )}
        </group>
      );
    }
    return objects;
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

        {/* Natural Objects */}
        {generateNaturalObjects()}
      </group>

      {/* Truck - positioned prominently in view */}
      <TruckModel />
    </group>
  );
}
