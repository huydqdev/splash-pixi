import { useCallback } from 'react';
import { useGame } from '../../context/GameContext';

const Box = ({ boxId, player, dotSpacing, dotSize }) => {
  const { PLAYERS } = useGame();
  
  // Parse box coordinates from boxId (format: "x,y")
  const [x, y] = boxId.split(',').map(Number);
  
  const getBoxColor = useCallback(() => {
    return player === PLAYERS.PLAYER_1 ? 0x3498db : 0xe74c3c;
  }, [player, PLAYERS]);
  
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(getBoxColor(), 0.5);
    
    // Draw box slightly smaller than the dot spacing to create a visual gap
    const padding = dotSize / 2;
    g.drawRect(
      padding, 
      padding, 
      dotSpacing - padding * 2, 
      dotSpacing - padding * 2
    );
    g.endFill();
  }, [getBoxColor, dotSpacing, dotSize]);

  return (
    <pixiGraphics
      draw={draw}
      position={[x * dotSpacing, y * dotSpacing]}
    />
  );
};

export default Box;