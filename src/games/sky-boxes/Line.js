import { useCallback } from 'react';
import { useGame } from '../../context/GameContext';

const Line = ({ 
  lineId, 
  startX, 
  startY, 
  endX, 
  endY, 
  owner, 
  isHovered,
  onHover,
  onClick
}) => {
  const { PLAYERS } = useGame();
  
  const getLineColor = useCallback(() => {
    if (owner === PLAYERS.PLAYER_1) return 0x3498db; // Blue for player
    if (owner === PLAYERS.BOT) return 0xe74c3c; // Red for bot
    if (isHovered) return 0x2ecc71; // Green for hover
    return 0x95a5a6; // Gray for default
  }, [owner, isHovered, PLAYERS]);
  
  const getLineWidth = useCallback(() => {
    if (owner || isHovered) return 6;
    return 3;
  }, [owner, isHovered]);
  
  const getLineAlpha = useCallback(() => {
    if (owner) return 1;
    if (isHovered) return 0.8;
    return 0.3;
  }, [owner, isHovered]);
  
  const draw = useCallback((g) => {
    g.clear();
    g.lineStyle(getLineWidth(), getLineColor(), getLineAlpha());
    g.moveTo(0, 0);
    g.lineTo(endX - startX, endY - startY);
  }, [getLineWidth, getLineColor, getLineAlpha, startX, startY, endX, endY]);
  
  const handlePointerOver = useCallback(() => {
    onHover(lineId);
  }, [onHover, lineId]);
  
  const handlePointerOut = useCallback(() => {
    onHover(null);
  }, [onHover]);
  
  const handlePointerDown = useCallback(() => {
    onClick(lineId);
  }, [onClick, lineId]);

  return (
    <pixiGraphics
      draw={draw}
      position={[startX, startY]}
      interactive={!owner}
      cursor={owner ? 'default' : 'pointer'}
      pointerover={handlePointerOver}
      pointerout={handlePointerOut}
      pointerdown={handlePointerDown}
    />
  );
};

export default Line;