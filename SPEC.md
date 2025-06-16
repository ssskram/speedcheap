# Speed is Cheap - Complete Implementation Specification

## Project Overview & Concept

**Objective**: Build a client-side web game using Next.js that captures David Abram's concept from "The Spell of the Sensuous" about Aboriginal peoples' relationship with the landscape as a living text that must be read at the proper pace.

### Core Game Concept
In Abram's book, Aboriginal elders riding in vehicles across their traditional country would speak faster as the truck's speed increased. They were "reading the land" - pointing out sacred sites, ancestral tracks, water sources, and stories embedded in every feature of the landscape. The faster they moved, the more compressed their time became to notice and interpret the landscape's communications.

### Game Mechanics Translation
The player drives a truck across the Outback with a **time limit to reach a destination** and a **minimum point threshold to win**. Points are earned by observing meaningful features in the landscape, but:

- **Speed vs. Observation Trade-off**: Faster driving reduces point values and makes interactions more difficult
- **Time Pressure**: Must balance covering distance with taking time to truly "read" the land
- **Interaction Difficulty Scaling**: Features become harder to interact with at higher speeds
- **Strategic Depth**: Players must learn the rhythm of the landscape - when to slow down for dense feature areas and when to speed through empty stretches

### Additional Requirements
- **Score Persistence**: Store game history in localStorage, display previous scores on landing page
- **Custom Assets**: Use provided truck images (`purple_truck_profile.png` for landing, `purple_truck_rear.png` in-game)
- **Next.js App Router Structure**: No `src` directory - pages in `app/`, utilities at root level

## Project Structure (No src Directory)

```
project-root/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page with game history
│   ├── game/
│   │   └── page.tsx            # Main game page
│   └── globals.css             # Global styles
├── components/                 # All React components
├── hooks/                      # Custom React hooks
├── stores/                     # Zustand state management
├── types/                      # TypeScript definitions
├── utils/                      # Utility functions
├── data/                       # Static game data
└── public/                     # Static assets
    ├── purple_truck_profile.png
    └── purple_truck_rear.png
```

## Implementation Phases & Components

### Phase 1: Foundation Types and Data Models

#### Core Types (`types/game.ts`)
Define all TypeScript interfaces:
- **GameState**: Core game state including time, position, speed, points, status, route, startTime
- **Route**: Route configuration with id, name, distance, duration, features, terrain
- **LandscapeFeature**: Individual features with type, position, points, interaction type, visual properties, lore, completion status
- **Interaction**: Active interaction state with type, progress, timing requirements
- **ViewportState**: Camera/view positioning for landscape scrolling
- **InputState**: Current input state from keyboard/mouse/touch

#### Game History Types (`types/history.ts`)
- **GameResult**: Complete game outcome with scores, timing, completion stats
- **GameHistory**: Collection of all played games with computed statistics
- **GameStats**: Aggregated statistics by route and overall performance

#### Constants (`utils/constants.ts`)
Centralized configuration for:
- **Game Physics**: Speed limits, acceleration/deceleration rates
- **Scoring System**: Point multipliers based on speed, interaction windows
- **Visual Layout**: Viewport dimensions, landscape width, vehicle positioning
- **Feature Points**: Base point values for different feature types
- **Route Definitions**: Predefined routes with difficulty progression
- **LocalStorage Settings**: Storage keys and limits

### Phase 2: Core Game Logic

#### Game Calculations (`utils/gameCalculations.ts`)
Pure functions for all game math:
- **Speed Physics**: Acceleration/deceleration based on input and time
- **Position Updates**: Converting speed to world position movement
- **Point Multipliers**: Calculate scoring reduction based on current speed
- **Interaction Windows**: Time available for feature interaction based on speed
- **Collision Detection**: Determine when features are in interaction range
- **Performance Metrics**: Calculate average speed, completion rates

#### Feature Generation (`utils/featureGeneration.ts`)
Procedural content generation:
- **Route Generation**: Create routes from configuration templates
- **Feature Distribution**: Strategic placement with clusters and sparse areas
- **Feature Type Selection**: Weighted random selection based on terrain and position
- **Visual Properties**: Generate colors, sizes, positions for features
- **Lore Generation**: Select appropriate stories based on feature type and terrain
- **Difficulty Scaling**: Ensure proper progression of challenge

#### LocalStorage Utilities (`utils/localStorage.ts`)
Safe persistence operations:
- **Game Result Storage**: Save completed games with error handling
- **History Retrieval**: Load and validate stored game history
- **Statistics Calculation**: Compute aggregated stats from history
- **Data Migration**: Handle format changes gracefully
- **Storage Limits**: Enforce maximum stored games to prevent bloat

### Phase 3: State Management

#### Main Game Store (`stores/gameStore.ts`)
Zustand store managing all game state:
- **Game State Management**: Core game loop state updates
- **Feature State**: Track feature completion and interaction status
- **Input Handling**: Process and store input state changes
- **Interaction System**: Manage active feature interactions
- **Game Flow Control**: Start, pause, resume, end game logic
- **Viewport Management**: Calculate landscape scrolling and visible features
- **Performance Optimization**: Efficient state updates and selectors

### Phase 4: Input System and Game Loop

#### Input Hook (`hooks/useGameInput.ts`)
Comprehensive input handling:
- **Keyboard Input**: Space/arrow keys for acceleration, escape for pause
- **Mouse Input**: Click features, hold for acceleration
- **Touch Input**: Mobile-optimized touch handling with proper hit targets
- **Input State Management**: Track active keys and pointer states
- **Feature Interaction**: Detect clicks/taps on landscape features
- **Accessibility**: Ensure proper keyboard navigation and screen reader support
- **Platform Detection**: Adapt input handling for desktop vs mobile

#### Game Loop Hook (`hooks/useGameLoop.ts`)
RequestAnimationFrame-based game loop:
- **Fixed Timestep**: Consistent physics updates regardless of frame rate
- **Performance Monitoring**: Track FPS and detect performance issues
- **State Updates**: Coordinate all game system updates
- **Lifecycle Management**: Start/stop loop based on game state
- **Frame Time Limiting**: Prevent spiral of death from frame drops

#### Game History Hook (`hooks/useGameHistory.ts`)
Game history and statistics management:
- **History Loading**: Retrieve and validate stored game data
- **Statistics Calculation**: Compute performance metrics and trends
- **Data Formatting**: Format times, scores, percentages for display
- **Progression Analysis**: Track improvement over time
- **Route Statistics**: Per-route performance tracking

### Phase 5: Interaction System

#### Interaction System Container (`components/interactions/InteractionSystem.tsx`)
Central interaction manager:
- **Interaction Type Routing**: Render appropriate interaction component
- **Modal Management**: Handle interaction overlay display
- **Feature Information**: Display feature lore and context
- **Timing Management**: Handle interaction timeouts and completion
- **Mobile Optimization**: Ensure touch-friendly interactions

#### Individual Interaction Components
Each interaction type requires its own component:

**Click Interaction (`components/interactions/ClickInteraction.tsx`)**:
- Simple tap/click to acknowledge feature
- Visual feedback on interaction
- Accessibility support for keyboard
- Mobile-optimized touch targets

**Hold Interaction (`components/interactions/HoldInteraction.tsx`)**:
- Hold mouse/touch for duration to "listen"
- Progress circle with visual feedback
- Handle mouse leave/touch end properly
- Haptic feedback on mobile devices

**Sequence Interaction (`components/interactions/SequenceInteraction.tsx`)**:
- Tap elements in correct order (fire, water, earth, air)
- Visual sequence display and progress tracking
- Reset on incorrect input
- Time pressure scaling with speed

**Trace Interaction (`components/interactions/TraceInteraction.tsx`)**:
- Draw path with mouse/finger
- Canvas-based path tracking
- Similarity algorithm for path matching
- Visual guide and feedback

### Phase 6: Rendering System

#### Main Game Canvas (`components/game/GameCanvas.tsx`)
Primary game viewport:
- **Input Binding**: Connect input handlers to canvas
- **Component Orchestration**: Render all game visual elements
- **Responsive Layout**: Handle different screen sizes
- **Touch Optimization**: Prevent scrolling and zoom on mobile
- **Layer Management**: Proper z-index and rendering order

#### Landscape System (`components/game/Landscape.tsx`)
Scrolling landscape container:
- **Horizontal Scrolling**: Smooth landscape movement based on position
- **Performance Optimization**: Only render visible features
- **Terrain Background**: Dynamic background based on route terrain
- **Visual Effects**: Atmospheric effects, ground line, distance markers
- **Feature Positioning**: Absolute positioning of landscape features

#### Feature Renderer (`components/game/FeatureRenderer.tsx`)
Individual feature display:
- **Visual Representation**: Icons, colors, sizes based on feature type
- **Interaction States**: Visual feedback for active/completed features
- **Click Handling**: Detect feature interactions
- **Animation Effects**: Highlight active features, completion indicators
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### Vehicle Component (`components/game/Vehicle.tsx`)
Player truck display:
- **Static Positioning**: Always centered in viewport
- **Speed Effects**: Visual feedback for different speeds (dust, motion lines)
- **Animation**: Subtle bouncing based on speed
- **Asset Integration**: Use purple_truck_rear.png image
- **Performance Indicators**: Speed display, interaction range (debug mode)

#### Game HUD (`components/game/GameHUD.tsx`)
Heads-up display overlay:
- **Score Display**: Current points, target points, multiplier
- **Progress Tracking**: Distance, time, feature completion
- **Visual Indicators**: Progress bars, urgency colors
- **Status Messages**: Speed warnings, optimal pace indicators
- **Mobile Optimization**: Responsive layout for different screen sizes

#### Terrain Background (`components/game/TerrainBackground.tsx`)
Dynamic background rendering:
- **Terrain Types**: Different visuals for desert, grassland, forest
- **Gradient System**: Smooth color transitions
- **Performance**: Efficient CSS-based rendering
- **Atmospheric Effects**: Sky gradients, lighting effects

### Phase 7: UI Components

#### Route Selector (`components/ui/RouteSelector.tsx`)
Route selection interface:
- **Route Display**: Show route information and difficulty
- **Selection State**: Visual feedback for selected route
- **Route Statistics**: Display best scores and completion rates
- **Responsive Design**: Work on all screen sizes

#### Game History Display (`components/ui/GameHistoryDisplay.tsx`)
Game history interface:
- **Recent Games**: Show last 5-10 games with scores and outcomes
- **Filtering**: Filter by route, outcome, date
- **Statistics**: Aggregate statistics and trends
- **Clear History**: Option to reset game history

#### Stats Display (`components/ui/StatsDisplay.tsx`)
Performance statistics:
- **Overall Stats**: Total games, win rate, best scores
- **Route Breakdown**: Per-route performance metrics
- **Progression Tracking**: Improvement over time
- **Visual Charts**: Simple progress indicators and comparisons

#### Pause Overlay (`components/game/PauseOverlay.tsx`)
Pause screen interface:
- **Resume Functionality**: Continue game seamlessly
- **Settings Options**: Basic game settings if needed
- **Quit Option**: Return to main menu
- **Mobile Considerations**: Prevent accidental touches

### Phase 8: Pages and Navigation

#### Landing Page (`app/page.tsx`)
Main entry point:
- **Hero Section**: Game title and concept explanation
- **Route Selection**: Choose route and see details
- **Game History**: Display recent games and statistics
- **Asset Display**: Show purple_truck_profile.png
- **Responsive Design**: Mobile-first responsive layout
- **Game Start**: Initialize game and navigate to game page

#### Game Page (`app/game/page.tsx`)
Main game interface:
- **Game Canvas**: Full-screen game display
- **State Management**: Connect to game store
- **Navigation**: Handle game completion and menu return
- **Error Handling**: Graceful handling of game errors

#### Root Layout (`app/layout.tsx`)
Application shell:
- **Global Styles**: Import global CSS
- **Metadata**: SEO and mobile optimization
- **Font Loading**: Optimize font loading
- **Provider Setup**: Wrap app in necessary providers

### Phase 9: Styling and Visual Polish

#### CSS Architecture
- **Tailwind CSS**: Utility-first styling approach
- **Custom Classes**: Game-specific styles and animations
- **Responsive Design**: Mobile-first responsive breakpoints
- **Performance**: Minimize CSS bundle size
- **Accessibility**: High contrast, focus indicators

#### Animation System
- **CSS Animations**: Smooth transitions and micro-interactions
- **Transform Optimization**: Use transform for smooth animations
- **Performance**: Hardware-accelerated animations where possible
- **Reduced Motion**: Respect user preferences for reduced motion

#### Asset Optimization
- **Image Optimization**: Next.js Image component for truck assets
- **Pixel Art**: Proper scaling for pixel art assets
- **Icon System**: Emoji or SVG icons for features
- **Loading States**: Smooth loading experiences

### Phase 10: Performance and Accessibility

#### Performance Optimization
- **Bundle Splitting**: Optimize JavaScript bundles
- **Image Optimization**: Proper image formats and sizing
- **Memory Management**: Prevent memory leaks in game loop
- **Frame Rate**: Maintain 60fps on target devices
- **Battery Optimization**: Reduce CPU usage when possible

#### Accessibility Features
- **Keyboard Navigation**: Full game playable with keyboard
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Color Accessibility**: Sufficient contrast ratios
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respect prefers-reduced-motion
- **Touch Accessibility**: Minimum 44px touch targets

#### Mobile Optimization
- **Touch Handling**: Prevent default behaviors appropriately
- **Viewport Configuration**: Proper mobile viewport settings
- **Performance**: Optimize for lower-end mobile devices
- **Battery Life**: Efficient rendering and updates
- **Orientation**: Handle portrait/landscape orientations

## Critical Implementation Details

### LocalStorage Schema
- **Storage Key**: "speed-is-cheap-history"
- **Data Structure**: JSON with versioning for migration
- **Size Limits**: Keep last 100 games maximum
- **Error Handling**: Graceful degradation if localStorage unavailable

### Game Balance
- **Speed Tiers**: 4 distinct speed ranges with different multipliers
- **Route Difficulty**: Progressive difficulty across routes
- **Feature Distribution**: Strategic clustering for decision-making
- **Time Pressure**: Balanced to encourage strategic speed choices

### Asset Requirements
- **purple_truck_profile.png**: Landing page hero image, should be crisp pixel art
- **purple_truck_rear.png**: In-game vehicle sprite, optimized for animation
- **Feature Icons**: Use emoji or simple SVG icons for landscape features
- **Responsive Images**: Provide appropriate sizes for different screens

### Build Configuration
- **Next.js Config**: Static export for client-side deployment
- **TypeScript**: Strict mode for type safety
- **Tailwind**: JIT compilation for optimal CSS
- **Bundle Analysis**: Monitor bundle sizes

### Testing Strategy
- **Component Testing**: Test individual components in isolation
- **Integration Testing**: Test game flow and state management
- **Device Testing**: Test on various mobile devices and browsers
- **Performance Testing**: Monitor frame rates and memory usage
- **Accessibility Testing**: Screen reader and keyboard navigation

This specification provides complete implementation guidance for building "Speed is Cheap" - a meaningful digital translation of David Abram's insights about embodied landscape knowledge and the importance of proper pacing in deep observation.