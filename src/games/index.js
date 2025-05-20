/**
 * Game definitions for the game collection
 * 
 * This file serves as a registry for all available games in the collection.
 * Each game should have its own implementation in a separate folder.
 */

// Import game logic functions
import { checkBoxCompletion, isGameFinished, getBotMove } from './sky-boxes/gameLogic';

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
    id: 'sky-boxes',
    name: 'Sky Boxes',
    description: 'Classic Dots and Boxes game. Connect dots to create boxes and score points. Be strategic to outplay the bot!',
    thumbnailUrl: '/assets/games/sky-boxes/thumbnail.png',
    assets: {
      // No specific assets needed for this game
    },
    // Game logic functions
    checkBoxCompletion,
    isGameFinished,
    getBotMove
  }
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
  return [
    {
      id: 'sky-boxes',
      name: 'Sky Boxes',
      description: 'Classic Dots and Boxes game. Connect dots to create boxes and score points. Be strategic to outplay the bot!',
      // Expose game logic functions for the GameContext
      checkBoxCompletion,
      isGameFinished,
      getBotMove
    }
  ];
};

// You might also export games individually if needed elsewhere,
// but getAllGames is what GameContext is looking for.
export {
  // Export other game scenes here if you want direct access
}; 
