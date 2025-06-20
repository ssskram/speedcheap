# Speed is Cheap

*"Language here is inseparable from song and story, and the songs and stories, in turn, are inseparable from the shapes and features of the land."* - David Abram, The Spell of the Sensuous

A web-based game that explores the tension between speed and deep observation, inspired by Aboriginal Australians reading the landscape from the back of a moving truck.

## How to Play

You drive a purple truck through a 3D landscape filled with natural objects. Each object contains wisdom from "The Spell of the Sensuous."

### Core Mechanics

- **Click natural objects** as you drive past them to read quotes from David Abram's book
- **Control your speed** using the slider or +/- buttons
- **Balance speed vs. wisdom**: Going faster gets you to your destination quicker, but gives you less time to click objects and fewer points when you do
- **Reach your destination** (1500km) before time runs out while collecting as much wisdom as possible

### The Trade-off

- **Slower speeds**: More time to click objects, more points per reading, but risk not reaching your destination
- **Faster speeds**: Cover distance quickly, but objects flash by too fast to click, and readings give fewer points
- **The sweet spot**: Find the rhythm that lets you gather wisdom while still completing your journey

## Controls

- **Speed Control**: Use the slider, +/- buttons, or click and drag to adjust your truck's speed
- **Reading**: Click on rocks, trees, cacti, and other natural objects to open wisdom quotes
- **Close Reading**: Click anywhere outside the quote modal to continue driving
- **Exit Game**: Use the EXIT button to return to the main menu

### Scoring
Your score reflects how much wisdom you've gathered from the landscape. The slower you're moving when you read, the more points each quote provides—just like the Aboriginal elders needed more time at slower speeds to fully share what they were seeing.

## Technical Details

### Built With
- **Next.js 14** with TypeScript and App Router
- **React Three Fiber** for 3D graphics and Three.js integration
- **Zustand** for game state management
- **Tailwind CSS** for styling

### Requirements
- Modern web browser with WebGL support
- Node.js 18+ (for development)
- Yarn package manager

## Getting Started

```bash
# Clone the repository
git clone [repository-url]
cd speedcheap

# Install dependencies
yarn install

# Start development server
yarn dev

# Open http://localhost:3000
```

## Development

```bash
# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint
```

---

*Inspired by David Abram's "The Spell of the Sensuous: Perception and Language in a More-than-Human World"*
