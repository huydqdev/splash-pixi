import { createContext, useState, useContext, useCallback, useEffect } from 'react';

// Game states
export const SCREENS = {
  INITIAL_LOADER: 'INITIAL_LOADER',
  MENU: 'MENU',
  GAME_LOADER: 'GAME_LOADER',
  GAME: 'GAME',
};

// Create context
const GameContext = createContext();

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
  
  // Navigate to a screen
  const navigateTo = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  // Select a game and move to game loader
  const selectGame = useCallback((game) => {
    setSelectedGame(game);
    setLoadingProgress(0);
    navigateTo(SCREENS.GAME_LOADER);
  }, [navigateTo]);

  // Return to menu
  const returnToMenu = useCallback(() => {
    setSelectedGame(null);
    navigateTo(SCREENS.MENU);
  }, [navigateTo]);

  // Track if menu is loaded
  const [isMenuLoaded, setIsMenuLoaded] = useState(false);

  // Update the menu loaded state
  const setMenuLoaded = useCallback(() => {
    setIsMenuLoaded(true);
    navigateTo(SCREENS.MENU);
  }, [navigateTo]);

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