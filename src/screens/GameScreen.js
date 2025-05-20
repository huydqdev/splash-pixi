import { Container, Graphics, Text } from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TextStyle } from 'pixi.js';
import Button from '../components/Button';
import { useGame } from '../context/GameContext';

/**
 * Main game screen
 * @param {Object} props - Component props
 * @param {Object} props.dimensions - Screen dimensions { width, height }
 */
const GameScreen = ({ dimensions }) => {
  const { selectedGame, returnToMenu } = useGame();
  const [isPaused, setIsPaused] = useState(false);
  const [gameState, setGameState] = useState({
    score: 0,
    lives: 3,
    level: 1,
  });
  const gameLoopRef = useRef(null);
  
  // Set up game loop
  useEffect(() => {
    if (!selectedGame || isPaused) return;
    
    // Game loop
    const gameLoop = () => {
      // Update game state
      setGameState(prevState => ({
        ...prevState,
        score: prevState.score + 1,
      }));
      
      // Store reference for cleanup
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    // Set up keyboard handling
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedGame, isPaused]);
  
  // Handle pause/resume
  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);
  
  // Return to menu
  const handleReturnToMenu = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    returnToMenu();
  }, [returnToMenu]);
  
  // Error case: no game selected
  if (!selectedGame) {
    return (
      <Container>
        <Text
          text="No game selected!"
          style={new TextStyle({ fontFamily: 'Arial', fontSize: 24, fill: 0xff0000 })}
          anchor={0.5}
          position={[dimensions.width / 2, dimensions.height / 2]}
        />
        <Button
          text="Return to Menu"
          position={[dimensions.width / 2 - 100, dimensions.height / 2 + 50]}
          onClick={handleReturnToMenu}
        />
      </Container>
    );
  }
  
  // Text styles
  const scoreStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'bold',
    fill: 0xffffff,
  });
  
  const gameOverStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 48,
    fontWeight: 'bold',
    fill: 0xff0000,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowBlur: 4,
    dropShadowDistance: 2,
  });
  
  return (
    <Container>
      {/* Game background */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0x222222);
          g.drawRect(0, 0, dimensions.width, dimensions.height);
          g.endFill();
          
          // Game area border
          g.lineStyle(2, 0x3498db);
          g.drawRect(20, 60, dimensions.width - 40, dimensions.height - 80);
        }}
      />
      
      {/* Game title bar */}
      <Container position={[0, 0]}>
        <Graphics
          draw={(g) => {
            g.clear();
            g.beginFill(0x2c3e50);
            g.drawRect(0, 0, dimensions.width, 50);
            g.endFill();
          }}
        />
        
        <Text
          text={selectedGame.name}
          style={new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            fill: 0xffffff,
          })}
          position={[20, 15]}
        />
        
        {/* Game UI elements */}
        <Container position={[dimensions.width - 300, 15]}>
          <Text
            text={`Score: ${gameState.score}`}
            style={scoreStyle}
            position={[0, 0]}
          />
          
          <Text
            text={`Lives: ${gameState.lives}`}
            style={scoreStyle}
            position={[120, 0]}
          />
          
          <Text
            text={`Level: ${gameState.level}`}
            style={scoreStyle}
            position={[220, 0]}
          />
        </Container>
      </Container>
      
      {/* Game area - where the actual game would be rendered */}
      <Container position={[20, 60]}>
        <Graphics
          draw={(g) => {
            g.clear();
            
            // Example game elements (would be replaced with actual game)
            const time = Date.now() / 1000;
            
            // Player
            g.beginFill(0x3498db);
            g.drawCircle(
              100 + Math.sin(time) * 50,
              100 + Math.cos(time) * 50,
              20
            );
            g.endFill();
            
            // Enemies
            for (let i = 0; i < 5; i++) {
              g.beginFill(0xe74c3c);
              g.drawCircle(
                300 + Math.sin(time + i) * 100,
                200 + Math.cos(time + i) * 100,
                10
              );
              g.endFill();
            }
          }}
        />
      </Container>
      
      {/* Pause menu overlay */}
      {isPaused && (
        <Container>
          <Graphics
            draw={(g) => {
              g.clear();
              g.beginFill(0x000000, 0.7);
              g.drawRect(0, 0, dimensions.width, dimensions.height);
              g.endFill();
            }}
          />
          
          <Text
            text="PAUSED"
            style={gameOverStyle}
            anchor={0.5}
            position={[dimensions.width / 2, dimensions.height / 3]}
          />
          
          <Container position={[dimensions.width / 2 - 100, dimensions.height / 2]}>
            <Button
              text="Resume"
              position={[0, 0]}
              color={0x2ecc71}
              onClick={handleTogglePause}
            />
            
            <Button
              text="Restart"
              position={[0, 60]}
              color={0xf1c40f}
              onClick={() => {
                setGameState({
                  score: 0,
                  lives: 3,
                  level: 1,
                });
                setIsPaused(false);
              }}
            />
            
            <Button
              text="Return to Menu"
              position={[0, 120]}
              color={0xe74c3c}
              onClick={handleReturnToMenu}
            />
          </Container>
        </Container>
      )}
      
      {/* Pause button */}
      {!isPaused && (
        <Button
          text="Pause"
          width={80}
          height={30}
          position={[dimensions.width - 100, dimensions.height - 40]}
          color={0x7f8c8d}
          onClick={handleTogglePause}
        />
      )}
    </Container>
  );
};

export default GameScreen; 