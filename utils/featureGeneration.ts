import { Route, LandscapeFeature } from '../types/game';
import { FEATURES, BALANCE, INTERACTIONS } from './constants';
import { randomBetween, randomInt, weightedRandom } from './gameCalculations';

// Feature type distribution by terrain
const TERRAIN_FEATURE_WEIGHTS = {
  desert: {
    'sacred-site': 0.3,
    'animal-tracks': 0.25,
    'plant-signs': 0.2,
    'geological': 0.25,
  },
  grassland: {
    'sacred-site': 0.2,
    'animal-tracks': 0.4,
    'plant-signs': 0.3,
    'geological': 0.1,
  },
  forest: {
    'sacred-site': 0.25,
    'animal-tracks': 0.2,
    'plant-signs': 0.35,
    'geological': 0.2,
  },
} as const;

// Interaction type distribution by feature type
const FEATURE_INTERACTION_WEIGHTS = {
  'sacred-site': {
    'click': 0.1,
    'hold': 0.6,
    'sequence': 0.2,
    'trace': 0.1,
  },
  'animal-tracks': {
    'click': 0.3,
    'hold': 0.2,
    'sequence': 0.1,
    'trace': 0.4,
  },
  'plant-signs': {
    'click': 0.5,
    'hold': 0.3,
    'sequence': 0.2,
    'trace': 0.0,
  },
  'geological': {
    'click': 0.2,
    'hold': 0.4,
    'sequence': 0.3,
    'trace': 0.1,
  },
} as const;

// Generate features for a route
export function generateRouteFeatures(route: Route): LandscapeFeature[] {
  const features: LandscapeFeature[] = [];
  const { distance, terrain } = route;
  
  // Calculate total number of features
  const featuresPerMile = randomBetween(
    BALANCE.FEATURES_PER_MILE.MIN,
    BALANCE.FEATURES_PER_MILE.MAX
  );
  const totalFeatures = Math.round(distance * featuresPerMile);
  
  // Generate feature clusters and individual features
  const featurePositions = generateFeaturePositions(distance, totalFeatures);
  
  // Create features at each position
  featurePositions.forEach((position, index) => {
    const feature = createFeature(
      `${route.id}-feature-${index}`,
      position,
      terrain
    );
    features.push(feature);
  });
  
  // Sort by position for easier processing
  return features.sort((a, b) => a.position - b.position);
}

// Generate positions for features along the route
function generateFeaturePositions(routeDistance: number, totalFeatures: number): number[] {
  const positions: number[] = [];
  
  // Create clusters first
  const numClusters = Math.floor(totalFeatures * BALANCE.FEATURES_PER_MILE.CLUSTER_PROBABILITY);
  const featuresInClusters = numClusters * randomInt(2, 4); // 2-4 features per cluster
  const remainingFeatures = totalFeatures - featuresInClusters;
  
  // Generate cluster positions
  for (let i = 0; i < numClusters; i++) {
    const clusterCenter = randomBetween(1, routeDistance - 1);
    const clusterSize = randomInt(2, 4);
    const clusterSpread = 0.5; // miles
    
    for (let j = 0; j < clusterSize; j++) {
      const offset = randomBetween(-clusterSpread, clusterSpread);
      const position = Math.max(0.1, Math.min(routeDistance - 0.1, clusterCenter + offset));
      positions.push(position);
    }
  }
  
  // Generate remaining individual features
  for (let i = 0; i < remainingFeatures; i++) {
    const position = randomBetween(0.5, routeDistance - 0.5);
    positions.push(position);
  }
  
  return positions;
}

// Create an individual feature
function createFeature(
  id: string,
  position: number,
  terrain: Route['terrain']
): LandscapeFeature {
  // Select feature type based on terrain
  const featureTypes = Object.keys(TERRAIN_FEATURE_WEIGHTS[terrain]) as Array<LandscapeFeature['type']>;
  const weights = Object.values(TERRAIN_FEATURE_WEIGHTS[terrain]);
  const featureType = weightedRandom(featureTypes, weights);
  
  // Select interaction type based on feature type
  const interactionTypes = Object.keys(FEATURE_INTERACTION_WEIGHTS[featureType]) as Array<LandscapeFeature['interactionType']>;
  const interactionWeights = Object.values(FEATURE_INTERACTION_WEIGHTS[featureType]);
  const interactionType = weightedRandom(interactionTypes, interactionWeights);
  
  // Get base configuration for this feature type
  const config = getFeatureConfig(featureType);
  
  return {
    id,
    type: featureType,
    position,
    points: config.basePoints,
    interactionType,
    visual: {
      icon: config.icon,
      color: config.color,
      size: randomBetween(24, 40), // pixel size variation
    },
    lore: generateFeatureLore(featureType, terrain),
    isCompleted: false,
    isActive: false,
  };
}

// Get configuration for a feature type
function getFeatureConfig(type: LandscapeFeature['type']) {
  switch (type) {
    case 'sacred-site':
      return FEATURES.SACRED_SITE;
    case 'animal-tracks':
      return FEATURES.ANIMAL_TRACKS;
    case 'plant-signs':
      return FEATURES.PLANT_SIGNS;
    case 'geological':
      return FEATURES.GEOLOGICAL;
  }
}

// Generate contextual lore for features
function generateFeatureLore(type: LandscapeFeature['type'], terrain: Route['terrain']): string {
  const loreVariations = {
    'sacred-site': {
      desert: [
        'Ancient ceremonial ground where generations have gathered to honor the ancestors and seek guidance.',
        'Sacred waterhole where the rainbow serpent rested, leaving marks in the red stone.',
        'Initiation site where young people learned the old laws under the desert stars.',
        'Meeting place of the seven sisters, whose songs still echo in the wind.',
      ],
      grassland: [
        'Corroboree ground where traditional dances celebrate the seasons.',
        'Sacred grove where the ancestral spirits watch over the grasslands.',
        'Ceremonial circle marked by arranged stones, telling the creation story.',
        'Gathering place where elders share knowledge with the next generation.',
      ],
      forest: [
        'Ancient burial ground beneath the old-growth trees.',
        'Sacred cave where the rock paintings tell of the dreamtime.',
        'Healing spring surrounded by powerful medicinal plants.',
        'Vision quest site where seekers find their spirit guides.',
      ],
    },
    'animal-tracks': {
      desert: [
        'Fresh kangaroo tracks leading toward water, following ancient pathways.',
        'Goanna tracks crossing between rocky outcrops, marking territory.',
        'Dingo prints following the scent trails known for generations.',
        'Echidna burrows showing seasonal movement patterns.',
      ],
      grassland: [
        'Wallaby paths worn smooth by countless journeys to water.',
        'Emu tracks heading toward seasonal fruiting grounds.',
        'Wombat trails connecting burrows across the grassland.',
        'Bird scratches revealing rich feeding areas below.',
      ],
      forest: [
        'Possum highways through the canopy, marked on ancient trees.',
        'Deer paths winding between sacred groves and water sources.',
        'Lyrebird scrapes where courtship displays have echoed for ages.',
        'Koala scratches marking eucalyptus groves and shelter trees.',
      ],
    },
    'plant-signs': {
      desert: [
        'Desert pea blooming after rare rains, marking seasonal cycles.',
        'Sturt\'s pea showing the path to hidden water sources.',
        'Saltbush clusters indicating soil changes and animal paths.',
        'Ghost gum with carved symbols pointing toward sacred sites.',
      ],
      grassland: [
        'Kangaroo grass seeds ready for traditional bread-making.',
        'Billy buttons blooming in patterns that predict rainfall.',
        'Native millet patches showing optimal gathering seasons.',
        'Wattle trees flowering to announce initiation ceremonies.',
      ],
      forest: [
        'Bunya pine cones marking the great gathering seasons.',
        'Medicinal bark that heals both body and spirit wounds.',
        'Berry bushes fruiting in cycles known to the grandmothers.',
        'Tree ferns marking permanent water and sheltered camping.',
      ],
    },
    'geological': {
      desert: [
        'Rock formations shaped by the Dreamtime ancestors, holding creation stories.',
        'Ochre deposits used for ceremony and healing for thousands of years.',
        'Stone arrangements mapping the movements of celestial ancestors.',
        'Breakaway country where the earth tells stories of ancient seas.',
      ],
      grassland: [
        'Granite tors marking traditional boundaries and meeting points.',
        'Stone circles aligned with seasonal star movements.',
        'Clay deposits perfect for traditional pottery and art.',
        'Rocky ridges that channel water and guide animal migrations.',
      ],
      forest: [
        'Ancient lava flows creating fertile soil for sacred plants.',
        'Sandstone galleries displaying thousands of years of rock art.',
        'Quartz outcrops reflecting moonlight for nighttime ceremonies.',
        'Limestone caves providing shelter and acoustic spaces for song.',
      ],
    },
  };
  
  const variations = loreVariations[type][terrain];
  return variations[randomInt(0, variations.length - 1)];
}

// Validate generated route
export function validateRoute(route: Route): boolean {
  // Check that features are properly distributed
  if (route.features.length === 0) return false;
  
  // Check that features are within route bounds
  const invalidFeatures = route.features.filter(
    feature => feature.position < 0 || feature.position > route.distance
  );
  
  if (invalidFeatures.length > 0) return false;
  
  // Check that features are sorted by position
  for (let i = 1; i < route.features.length; i++) {
    if (route.features[i].position < route.features[i - 1].position) {
      return false;
    }
  }
  
  return true;
}

// Add features to existing routes
export function populateRoutes(routes: Route[]): Route[] {
  return routes.map(route => ({
    ...route,
    features: generateRouteFeatures(route),
  }));
}

// Calculate route difficulty score
export function calculateRouteDifficulty(route: Route): number {
  const featureCount = route.features.length;
  const averageDistance = route.distance / featureCount;
  const timePerMile = route.duration / route.distance;
  
  // Higher score = more difficult
  // Factors: more features, less time per mile, longer distance
  const featureDensity = featureCount / route.distance; // features per mile
  const timePressure = 1 / timePerMile; // inverse of time available
  const lengthChallenge = route.distance / 10; // normalized by short route
  
  return featureDensity * 2 + timePressure * 3 + lengthChallenge;
}