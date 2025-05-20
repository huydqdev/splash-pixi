import "./App.css";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { useEffect, useState } from "react";
import { GameProvider, useGame, SCREENS } from "./context/GameContext";
import InitialPreloader from "./screens/InitialPreloader";
import MenuScreen from "./screens/MenuScreen";
import GamePreloader from "./screens/GamePreloader";
import GameScreen from "./screens/GameScreen";

extend({
  Container,
  Graphics,
  Sprite,
  Text
});

// Game content component
const GameContent = () => {
  const { currentScreen } = useGame();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Render current screen based on game state
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case SCREENS.INITIAL_LOADER:
        return <InitialPreloader dimensions={dimensions} />;
      case SCREENS.MENU:
        return <MenuScreen dimensions={dimensions} />;
      case SCREENS.GAME_LOADER:
        return <GamePreloader dimensions={dimensions} />;
      case SCREENS.GAME:
        return <GameScreen dimensions={dimensions} />;
      default:
        return <InitialPreloader dimensions={dimensions} />;
    }
  };

  return (
    <Application
      background="#1a1a2e"
      width={dimensions.width}
      height={dimensions.height}
      options={{ autoDensity: true, resolution: window.devicePixelRatio || 1 }}
    >
      {renderCurrentScreen()}
    </Application>
  );
};

// Main App component with provider
function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
