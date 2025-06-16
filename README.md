# Speed is Cheap

A web-based game inspired by David Abram's "The Spell of the Sensuous" that explores the tension between speed and deep observation of the landscape.

*"The faster the vehicle moved, the faster these people spoke, as though they were trying to keep pace with the land itself..."* - David Abram

## Game Concept

In Abram's book, Aboriginal elders riding in vehicles across their traditional country would speak faster as the truck's speed increased. They were "reading the land" - pointing out sacred sites, ancestral tracks, water sources, and stories embedded in every feature of the landscape. The faster they moved, the more compressed their time became to notice and interpret the landscape's communications.

This game translates that insight into an interactive experience where players must balance the urgency of reaching their destination with the patience required to truly observe and understand the living landscape.

### Core Mechanics

- **Speed vs. Observation Trade-off**: Drive faster to cover distance, but earn fewer points from landscape features
- **Time Pressure**: Reach your destination within the time limit while earning enough points to "prove" you've read the land
- **Interactive Features**: Sacred sites, animal tracks, plant signs, and geological formations each require different types of attention
- **Strategic Rhythm**: Learn when to slow down for dense feature areas and when to speed through empty stretches

## Gameplay

Players drive a purple truck across the Australian Outback, encountering meaningful landscape features that can be "read" through various interactions:

- **Click**: Quick acknowledgment of obvious landmarks
- **Hold**: Listen deeply to the stories of sacred places
- **Sequence**: Follow traditional patterns (elements, seasons, etc.)
- **Trace**: Draw paths that connect to ancestral tracks

The faster you drive, the less time you have to interact with features and the fewer points they're worth. Success requires finding the right pace - fast enough to reach your destination, slow enough to truly see.

## Technical Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Deployment**: Static export for client-side deployment
- **Storage**: localStorage for game history and statistics

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [Yarn](https://yarnpkg.com/) package manager

Install Yarn globally if you haven't already:

```bash
npm install -g yarn
```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd speedcheap
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to play the game.

## Game Features

### Routes

- **Desert Crossing**: 15 miles, 6 minutes - Introduction to core mechanics
- **Grassland Journey**: 20 miles, 8 minutes - Intermediate challenge
- **Mountain Passage**: 25 miles, 10 minutes - Advanced difficulty

### Landscape Features

- **Sacred Sites** (🗿): Ancient ceremonial places requiring deep listening
- **Animal Tracks** (🦘): Signs of wildlife pointing to resources
- **Plant Signs** (🌿): Botanical indicators of water, seasons, and medicine
- **Geological Formations** (🪨): Rock formations holding creation stories

### Scoring System

Points are awarded based on successful feature interactions, multiplied by your current speed:

- **Crawling (5-15 mph)**: 100% points - Perfect for deep observation
- **Moderate (15-35 mph)**: 75% points - Balanced pace
- **Fast (35-55 mph)**: 50% points - Rushing but still aware
- **Racing (55+ mph)**: 25% points - Too fast to truly see

## 🎮 Controls

### Desktop

- **Acceleration**: Space bar or Up arrow key
- **Feature Interaction**: Click on landscape features when in range
- **Pause**: Escape key or P key

### Mobile

- **Acceleration**: Touch and hold anywhere on screen
- **Feature Interaction**: Tap on landscape features when in range
- **Responsive Design**: Optimized for touch interaction

## Game History

The game automatically tracks your performance across sessions:

- **Recent Games**: View your last 10 games with scores and outcomes
- **Route Statistics**: Performance breakdown by route
- **Progression Tracking**: Monitor improvement over time
- **Best Scores**: Track personal records for each route

All data is stored locally in your browser using localStorage.

## Project Structure

```
project-root/
├── app/                        # Next.js app router pages
│   ├── page.tsx               # Landing page with game history
│   ├── game/page.tsx          # Main game interface
│   └── layout.tsx             # Root layout
├── components/                 # React components
│   ├── game/                  # Game-specific components
│   ├── interactions/          # Feature interaction components
│   └── ui/                    # Reusable UI components
├── hooks/                     # Custom React hooks
├── stores/                    # Zustand state management
├── types/                     # TypeScript type definitions
├── utils/                     # Utility functions
├── data/                      # Static game data
└── public/                    # Static assets
```

## Development Scripts

```bash
# Development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Linting
yarn lint
```
