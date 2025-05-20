/**
 * Game definitions for the game collection
 * 
 * This file serves as a registry for all available games in the collection.
 * Each game should have its own implementation in a separate folder.
 */

// Example game definitions
export const GAME_DEFINITIONS = [
  {
    id: 'game1',
    name: 'Space Shooter',
    description: 'Navigate through space and destroy enemy ships in this action-packed shooter.',
    thumbnailUrl: '/assets/games/game1/thumbnail.png',
    assets: {
      // Define game-specific assets to preload
      // 'sprites': '/assets/games/game1/sprites.png',
      // 'sounds': '/assets/games/game1/sounds.mp3',
    },
    // Initialize game function
    initialize: (container, dimensions) => {
      // Game initialization code would go here
      console.log('Initializing Space Shooter game');
    }
  },
  {
    id: 'game2',
    name: 'Puzzle Adventure',
    description: 'Solve challenging puzzles in this brain-teasing adventure across multiple worlds.',
    thumbnailUrl: '/assets/games/game2/thumbnail.png',
    assets: {
      // 'sprites': '/assets/games/game2/sprites.png',
      // 'background': '/assets/games/game2/background.png',
    },
    initialize: (container, dimensions) => {
      console.log('Initializing Puzzle Adventure game');
    }
  },
  {
    id: 'game3',
    name: 'Racing Challenge',
    description: 'Race against time and opponents in this high-speed racing experience.',
    thumbnailUrl: '/assets/games/game3/thumbnail.png',
    assets: {
      // 'sprites': '/assets/games/game3/sprites.png',
      // 'tracks': '/assets/games/game3/tracks.json',
    },
    initialize: (container, dimensions) => {
      console.log('Initializing Racing Challenge game');
    }
  },
];

/**
 * Get a game definition by ID
 * @param {string} gameId - The ID of the game to get
 * @returns {Object|null} The game definition or null if not found
 */
export const getGameById = (gameId) => {
  return GAME_DEFINITIONS.find(game => game.id === gameId) || null;
};

/**
 * Get all available games
 * @returns {Array} Array of game definitions
 */
export const getAllGames = () => {
  return [...GAME_DEFINITIONS];
}; 