import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { useCallback, useEffect } from 'react';
import { TextStyle } from 'pixi.js';
import LoadingAnimation from '../components/LoadingAnimation';
import useLoader from '../hooks/useLoader';
import { useGame, SCREENS } from '../context/GameContext';
import Button from '../components/Button';

// Example game assets by game ID
const GAME_ASSETS = {
  game1: {
    // These would be actual game assets in a real game
    // 'game1-sprites': '/assets/games/game1/sprites.png',
    // 'game1-sounds': '/assets/games/game1/sounds.mp3',
  },
  game2: {
    // 'game2-sprites': '/assets/games/game2/sprites.png',
    // 'game2-background': '/assets/games/game2/background.png',
  },
  game3: {
    // 'game3-sprites': '/assets/games/game3/sprites.png',
    // 'game3-tilemap': '/assets/games/game3/tilemap.json',
  },
};

/**
 * Game-specific preloader screen
 * @param {Object} props - Component props
 * @param {Object} props.dimensions - Screen dimensions { width, height }
 */
const GamePreloader = ({ dimensions }) => {
  const { loadAssets, progress } = useLoader();
  const { selectedGame, setLoadingProgress, navigateTo, returnToMenu } = useGame();
  
  // Load game-specific assets when component mounts
  useEffect(() => {
    if (!selectedGame) {
      // If no game is selected, go back to menu
      returnToMenu();
      return;
    }
    
    const loadGameAssets = async () => {
      // Get assets for the selected game
      const gameAssets = GAME_ASSETS[selectedGame.id] || {};
      
      // Simulate loading time (remove in production)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Load actual game assets
      await loadAssets(gameAssets, () => {
        // Navigate to the game screen when loading is complete
        navigateTo(SCREENS.GAME);
      });
    };
    
    loadGameAssets();
  }, [loadAssets, navigateTo, returnToMenu, selectedGame]);
  
  // Update loading progress in context
  useEffect(() => {
    setLoadingProgress(progress);
  }, [progress, setLoadingProgress]);
  
  // Return to menu handler
  const handleReturnToMenu = useCallback(() => {
    returnToMenu();
  }, [returnToMenu]);
  
  // If no game is selected, show nothing (will redirect to menu)
  if (!selectedGame) {
    return null;
  }
  
  // Text styles
  const titleStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 30,
    fontWeight: 'bold',
    fill: 0xffffff,
    align: 'center',
  });
  
  const gameNameStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 40,
    fontWeight: 'bold',
    fill: 0x3498db,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowBlur: 4,
    dropShadowDistance: 2,
    align: 'center',
  });
  
  const tipStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 16,
    fill: 0xcccccc,
    align: 'center',
    fontStyle: 'italic',
  });
  
  // Random loading tips (would be specific to each game in a real app)
  const loadingTips = [
    "Press ESC during gameplay to access the pause menu.",
    "Remember to collect power-ups to increase your score multiplier!",
    "Higher difficulty levels offer better rewards.",
    "You can customize controls in the settings menu.",
  ];
  
  // Select a random tip
  const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
  
  return (
    <Container>
      {/* Background */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0x0f172a);
          g.drawRect(0, 0, dimensions.width, dimensions.height);
          g.endFill();
          
          // Decorative elements
          const time = Date.now() / 1000;
          
          // Animated background grid
          g.lineStyle(1, 0x3498db, 0.2);
          for (let i = 0; i < 20; i++) {
            const offset = Math.sin(time + i * 0.2) * 10;
            // Horizontal lines
            g.moveTo(0, i * 60 + offset);
            g.lineTo(dimensions.width, i * 60 + offset);
            
            // Vertical lines
            g.moveTo(i * 80 + offset, 0);
            g.lineTo(i * 80 + offset, dimensions.height);
          }
        }}
      />
      
      {/* Game title area */}
      <Container position={[dimensions.width / 2, dimensions.height / 3]}>
        <Text
          text="Loading Game"
          style={titleStyle}
          anchor={0.5}
          position={[0, -70]}
        />
        
        <Text
          text={selectedGame.name}
          style={gameNameStyle}
          anchor={0.5}
          position={[0, -20]}
        />
        
        {/* Game icon placeholder */}
        <Graphics
          draw={(g) => {
            g.clear();
            g.beginFill(0x34495e, 0.7);
            g.drawRoundedRect(-50, -135, 100, 100, 10);
            g.endFill();
            
            // Game icon symbol
            g.beginFill(0x3498db);
            g.drawStar(0, -85, 5, 30, 15);
            g.endFill();
          }}
        />
      </Container>
      
      {/* Loading progress */}
      <Container position={[dimensions.width / 2, dimensions.height / 2 + 50]}>
        <LoadingAnimation
          progress={progress}
          width={400}
          height={20}
          position={[-200, 0]}
        />
        
        <Text
          text={`Loading assets: ${Math.round(progress)}%`}
          style={new TextStyle({ fontFamily: 'Arial', fontSize: 16, fill: 0xffffff })}
          anchor={0.5}
          position={[0, 40]}
        />
        
        {/* Loading tip */}
        <Container position={[0, 80]}>
          <Text
            text="TIP:"
            style={new TextStyle({
              fontFamily: 'Arial', 
              fontSize: 16, 
              fontWeight: 'bold',
              fill: 0x3498db
            })}
            anchor={[1, 0.5]}
            position={[-10, 10]}
          />
          
          <Text
            text={randomTip}
            style={tipStyle}
            anchor={[0, 0.5]}
            position={[0, 10]}
          />
        </Container>
      </Container>
      
      {/* Cancel button */}
      <Button
        text="Cancel"
        width={120}
        height={40}
        position={[dimensions.width / 2 - 60, dimensions.height - 80]}
        color={0xe74c3c}
        onClick={handleReturnToMenu}
      />
    </Container>
  );
};

export default GamePreloader; 