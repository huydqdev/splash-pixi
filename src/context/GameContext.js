import { createContext, useState, useContext, useCallback, useEffect } from 'react';
// Removed external imports and implementing stub functions locally
// Stub implementations for the game logic
const initializeBoard = (rows, cols) => {
  const dots = Array(rows * cols).fill().map((_, i) => ({
    id: i,
    x: i % rows,
    y: Math.floor(i / rows)
  }));
  return { dots, lines: {}, boxes: {} };
};

const checkBoxCompletion = () => []; // Stub implementation returning no completed boxes
const isGameFinished = () => false; // Stub implementation, game never finishes
const getBotMove = () => null; // Stub bot move function

// Game states
export const SCREENS = {
  INITIAL_LOADER: 'INITIAL_LOADER',
  MENU: 'MENU',
  GAME_LOADER: 'GAME_LOADER',
  GAME: 'GAME',
};

// Create context
const GameContext = createContext();

// Players
export const PLAYERS = {
  PLAYER_1: 'PLAYER_1',
  BOT: 'BOT',
};

// Context provider
export const GameProvider = ({ children }) => {
  // Track current screen
  const [currentScreen, setCurrentScreen] = useState(SCREENS.INITIAL_LOADER);
  
  // Track selected game
  const [selectedGame, setSelectedGame] = useState(null);
  
  // Available games list from our games definition
  const [games, setGames] = useState([]);
  
  // Load games when the context is initialized
  useEffect(() => {
    // In a real app, this could be an API call or dynamic import
    import('../games').then(({ getAllGames }) => {
      setGames(getAllGames());
    });
  }, []);

  // Track loading progress
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Sky Boxes Game State
  const [boardSettings, setBoardSettings] = useState({ rows: 9, cols: 9 }); // Example: 9x9 grid means 8x8 boxes
  const [dots, setDots] = useState([]); // Array of dot positions
  const [lines, setLines] = useState({}); // Object to store lines, e.g., {'0,0-0,1': 'PLAYER_1'}
  const [boxes, setBoxes] = useState({}); // Object to store boxes, e.g., {'0,0': 'PLAYER_1'}
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.PLAYER_1);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // Navigate to a screen
  const navigateTo = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  // Select a game and move to game loader
  const selectGame = useCallback((game) => {
    setSelectedGame(game);
    setLoadingProgress(0);
    navigateTo(SCREENS.GAME_LOADER);
  }, [navigateTo]); // Removed boardSettings from dependencies

  // Return to menu
  const returnToMenu = useCallback(() => {
    setSelectedGame(null);
    // Potentially reset Sky Boxes game state here if needed
    navigateTo(SCREENS.MENU);
  }, [navigateTo]);

  // Track if menu is loaded
  const [isMenuLoaded, setIsMenuLoaded] = useState(false);

  // Update the menu loaded state
  const setMenuLoaded = useCallback(() => {
    setIsMenuLoaded(true);
    navigateTo(SCREENS.MENU);
  }, [navigateTo]);

  // --- Sky Boxes Game Logic ---

  const handleDrawLine = useCallback((lineId) => {
    if (isGameOver || lines[lineId] || !lineId) { // Added !lineId check for safety
      console.log('Line draw skipped:', { isGameOver, lineExists: !!lines[lineId], lineId });
      return; 
    }

    const playerMakingMove = currentPlayer; // Capture current player before any state changes
    console.log(`Attempting to draw line: ${lineId} by ${playerMakingMove}`);

    // 1. Update lines state
    const newLines = { ...lines, [lineId]: playerMakingMove };
    setLines(newLines);

    // 2. Check for completed boxes
    const completedBoxIds = checkBoxCompletion(lineId, newLines, boardSettings.rows, boardSettings.cols);
    let turnChanged = true;

    if (completedBoxIds.length > 0) {
      const newBoxes = { ...boxes };
      completedBoxIds.forEach(boxId => {
        newBoxes[boxId] = playerMakingMove;
      });
      setBoxes(newBoxes);

      // 3. Update score and player gets another turn
      if (playerMakingMove === PLAYERS.PLAYER_1) {
        setPlayerScore(prev => prev + completedBoxIds.length);
      } else if (playerMakingMove === PLAYERS.BOT) {
        setBotScore(prev => prev + completedBoxIds.length);
      }
      turnChanged = false; // Player (or Bot) gets another turn
      console.log('Player', playerMakingMove, 'completed', completedBoxIds.length, 'box(es)!');
    }

    // 4. Check for game over BEFORE switching turns if player completed a box
    // It's important to check game over with the current player's completed boxes
    // The `newBoxes` from above might not be immediately available in `isGameFinished` if it relies on state `boxes`
    // For simplicity here, we pass the potentially updated newBoxes to isGameFinished
    // However, isGameFinished in board.js currently takes currentBoxes (the state version)
    // For robustness, isGameFinished should ideally take the most up-to-date box data.
    // Let's assume isGameFinished can correctly determine game over from the *next* state of boxes
    // which will be set after this function. Or, we check based on `newBoxes` if available.
    
    // For now, isGameFinished uses the `boxes` state, so it will be checked with one-turn-old box data in this exact spot if a box was just made.
    // This is a subtle point. The game over check should ideally use the *result* of the current move.
    // Let's refine this: check for game over AFTER boxes state is updated.
    // We can do this in a useEffect that watches `boxes` changing is more robust for game over.

    // Given React's async state updates, the `isGameFinished` check here might use slightly stale `boxes` state
    // if called immediately after `setBoxes`. A `useEffect` listening to `boxes` changing is more robust for game over.
    // However, for turn logic, we need to decide to switch turns or not *now*.

    if (isGameFinished(turnChanged ? boxes : { ...boxes, ...completedBoxIds.reduce((acc, id) => ({...acc, [id]: playerMakingMove}), {}) }, boardSettings.rows, boardSettings.cols)) {
      setIsGameOver(true);
      console.log('Game Over! Final Scores - P1:', playerScore, 'Bot:', botScore);
      return; // Game is over, no more turns
    }

    // 5. Switch turn if no box was completed (turnChanged is true) and game is not over
    if (turnChanged) {
      setCurrentPlayer(prevPlayer => prevPlayer === PLAYERS.PLAYER_1 ? PLAYERS.BOT : PLAYERS.PLAYER_1);
    }
    // If a box was made (turnChanged is false), the current player (who just made a box) continues.
    // The bot logic will re-trigger if it's still the bot's turn and it made a box.

  }, [lines, boxes, currentPlayer, isGameOver, boardSettings.rows, boardSettings.cols, playerScore, botScore, PLAYERS]); // Added more dependencies

  // Effect for Bot's turn
  useEffect(() => {
    if (currentPlayer === PLAYERS.BOT && !isGameOver) {
      console.log("Bot's turn. Thinking...");
      const timer = setTimeout(() => {
        const botMoveLineId = getBotMove(lines, boardSettings.rows, boardSettings.cols);
        if (botMoveLineId) {
          console.log(`Bot chose line: ${botMoveLineId}`);
          handleDrawLine(botMoveLineId); // Bot draws the line
        } else {
          console.log("Bot has no moves (should ideally not happen if game not over).");
          // This case should ideally not be reached if isGameFinished is accurate
          // and all lines are filled. If it is reached, and game not over,
          // it might imply a bug or that all lines are taken but no one won (e.g. a draw with no boxes made).
        }
      }, 1000); // 1-second delay for bot move

      return () => clearTimeout(timer); // Cleanup timer if component unmounts or dependencies change
    }
  }, [currentPlayer, isGameOver, lines, boardSettings.rows, boardSettings.cols, handleDrawLine, PLAYERS.BOT]);

  const resetSkyBoxGame = useCallback(() => {
    console.log('Resetting Sky Boxes game');
    // Reset game state
    const boardData = initializeBoard(boardSettings.rows, boardSettings.cols);
    setDots(boardData.dots);
    setLines(boardData.lines);
    setBoxes(boardData.boxes);
    setPlayerScore(0);
    setBotScore(0);
    setCurrentPlayer(PLAYERS.PLAYER_1); // Player 1 starts
    setIsGameOver(false);
  }, [boardSettings]);

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        navigateTo,
        selectedGame,
        selectGame,
        returnToMenu,
        loadingProgress,
        setLoadingProgress,
        games,
        isMenuLoaded,
        setMenuLoaded,

        // Sky Boxes specific state and actions
        boardSettings,
        setBoardSettings,
        dots,
        lines,
        boxes,
        currentPlayer,
        playerScore,
        botScore,
        isGameOver,
        handleDrawLine,
        resetSkyBoxGame,
        PLAYERS, // Export PLAYERS object
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext; 