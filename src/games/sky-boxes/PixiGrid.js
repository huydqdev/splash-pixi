import { useCallback, useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import Dot from './Dot';
import Line from './Line';
import Box from './Box';

const PixiGrid = ({ x, y }) => {
  const { 
    boardSettings, 
    dots, 
    lines, 
    boxes, 
    handleDrawLine,
    currentPlayer,
    isGameOver,
    PLAYERS
  } = useGame();
  
  const [hoveredLine, setHoveredLine] = useState(null);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const DOT_SIZE = 8;
  const DOT_SPACING = 60;
  
  // Calculate grid dimensions
  useEffect(() => {
    setGridSize({
      width: (boardSettings.cols - 1) * DOT_SPACING,
      height: (boardSettings.rows - 1) * DOT_SPACING
    });
  }, [boardSettings]);
  
  // Handle line hover
  const handleLineHover = useCallback((lineId) => {
    if (!isGameOver && currentPlayer === PLAYERS.PLAYER_1 && !lines[lineId]) {
      setHoveredLine(lineId);
    }
  }, [isGameOver, currentPlayer, PLAYERS.PLAYER_1, lines]);
  
  // Handle line click
  const handleLineClick = useCallback((lineId) => {
    if (!isGameOver && currentPlayer === PLAYERS.PLAYER_1 && !lines[lineId]) {
      handleDrawLine(lineId);
    }
  }, [isGameOver, currentPlayer, PLAYERS.PLAYER_1, lines, handleDrawLine]);
  
  return (
    <pixiContainer position={[x, y]}>
      {/* Render boxes */}
      {Object.entries(boxes).map(([boxId, player]) => (
        <Box 
          key={boxId} 
          boxId={boxId} 
          player={player}
          dotSpacing={DOT_SPACING}
          dotSize={DOT_SIZE}
        />
      ))}
      
      {/* Render lines */}
      {dots.map(dot => {
        // Horizontal lines
        if (dot.x < boardSettings.cols - 1) {
          const lineId = `${dot.x},${dot.y}-${dot.x + 1},${dot.y}`;
          return (
            <Line
              key={`h-${lineId}`}
              lineId={lineId}
              startX={dot.x * DOT_SPACING}
              startY={dot.y * DOT_SPACING}
              endX={(dot.x + 1) * DOT_SPACING}
              endY={dot.y * DOT_SPACING}
              owner={lines[lineId]}
              isHovered={hoveredLine === lineId}
              onHover={handleLineHover}
              onClick={handleLineClick}
            />
          );
        }
        return null;
      })}
      
      {/* Vertical lines */}
      {dots.map(dot => {
        if (dot.y < boardSettings.rows - 1) {
          const lineId = `${dot.x},${dot.y}-${dot.x},${dot.y + 1}`;
          return (
            <Line
              key={`v-${lineId}`}
              lineId={lineId}
              startX={dot.x * DOT_SPACING}
              startY={dot.y * DOT_SPACING}
              endX={dot.x * DOT_SPACING}
              endY={(dot.y + 1) * DOT_SPACING}
              owner={lines[lineId]}
              isHovered={hoveredLine === lineId}
              onHover={handleLineHover}
              onClick={handleLineClick}
            />
          );
        }
        return null;
      })}
      
      {/* Render dots */}
      {dots.map(dot => (
        <Dot 
          key={dot.id} 
          x={dot.x * DOT_SPACING} 
          y={dot.y * DOT_SPACING} 
          size={DOT_SIZE} 
        />
      ))}
    </pixiContainer>
  );
};

export default PixiGrid;