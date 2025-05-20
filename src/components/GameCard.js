import { useCallback, useState } from 'react';
import { TextStyle } from 'pixi.js';

/**
 * Game card component displayed in the menu
 * @param {Object} props - Component props
 * @param {Object} props.game - Game data object
 * @param {Function} props.onSelect - Handler when game is selected
 * @param {Array} props.position - Position [x, y]
 * @param {number} props.width - Card width
 * @param {number} props.height - Card height
 */
const GameCard = ({
  game,
  onSelect,
  position = [0, 0],
  width = 250,
  height = 300,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Event handlers
  const handlePointerDown = useCallback(() => {
    setIsPressed(true);
  }, []);
  
  const handlePointerUp = useCallback(() => {
    if (isPressed) {
      onSelect && onSelect(game);
    }
    setIsPressed(false);
  }, [isPressed, onSelect, game]);
  
  const handlePointerOver = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  
  // Calculate animation values based on state
  const scale = isPressed ? 0.95 : isHovered ? 1.05 : 1;
  const yOffset = isPressed ? 0 : isHovered ? -10 : 0;
  const brightness = isPressed ? 0.9 : isHovered ? 1.1 : 1;
  
  // Text styles
  const titleStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 'bold',
    fill: 0xffffff,
    align: 'center',
  });
  
  const descriptionStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 16,
    fill: 0xdddddd,
    align: 'center',
    wordWrap: true,
    wordWrapWidth: width - 40,
  });
  
  return (
    <pixiContainer 
      position={[position[0], position[1] + yOffset]}
      scale={scale}
      interactive={true}
      pointerdown={handlePointerDown}
      pointerup={handlePointerUp}
      pointerupoutside={handlePointerUp}
      pointerover={handlePointerOver}
      pointerout={handlePointerOut}
      cursor="pointer"
    >
      {/* Card background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          
          // Card shadow
          if (isHovered) {
            g.beginFill(0x000000, 0.3);
            g.drawRoundedRect(5, 5, width, height, 15);
            g.endFill();
          }
          
          // Card background
          g.beginFill(0x2c3e50, brightness);
          g.drawRoundedRect(0, 0, width, height, 15);
          g.endFill();
          
          // Card border
          g.lineStyle(2, isHovered ? 0x3498db : 0x34495e);
          g.drawRoundedRect(0, 0, width, height, 15);
          
          // Game icon placeholder
          g.beginFill(0x34495e);
          g.drawRoundedRect(width / 2 - 50, 30, 100, 100, 10);
          g.endFill();
          
          // Game icon symbol
          g.beginFill(0x3498db);
          g.drawStar(width / 2, 80, 5, 30, 15);
          g.endFill();
        }}
      />
      
      {/* Game title */}
      <pixiText
        text={game.name}
        style={titleStyle}
        anchor={[0.5, 0]}
        position={[width / 2, 150]}
      />
      
      {/* Game description */}
      <pixiText
        text={game.description}
        style={descriptionStyle}
        anchor={[0.5, 0]}
        position={[width / 2, 190]}
      />
      
      {/* Play button indicator */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.beginFill(0x3498db);
          g.drawRoundedRect(width / 2 - 50, height - 50, 100, 30, 15);
          g.endFill();
          
          // Play triangle
          g.beginFill(0xffffff);
          g.moveTo(width / 2 - 10, height - 35);
          g.lineTo(width / 2 + 15, height - 35);
          g.lineTo(width / 2 + 2.5, height - 20);
          g.closePath();
          g.endFill();
        }}
      />
    </pixiContainer>
  );
};

export default GameCard; 