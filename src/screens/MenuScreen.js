import { useCallback, useRef, useState } from 'react';
import { TextStyle } from 'pixi.js';
import Button from '../components/Button';
import GameCard from '../components/GameCard';
import { useGame } from '../context/GameContext';

/**
 * Menu screen with game selection
 * @param {Object} props - Component props
 * @param {Object} props.dimensions - Screen dimensions { width, height }
 */
const MenuScreen = ({ dimensions }) => {
  const { games, selectGame } = useGame();
  const [selectedTab, setSelectedTab] = useState('games'); // 'games', 'settings', 'help'
  const animationRef = useRef(null);
  
  // Tab navigation handlers
  const handleTabChange = useCallback((tab) => {
    setSelectedTab(tab);
  }, []);
  
  // Select a game and transition to game loader
  const handleGameSelect = useCallback((game) => {
    selectGame(game);
  }, [selectGame]);
  
  // Text styles
  const titleStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 48,
    fontWeight: 'bold',
    fill: 0xffffff,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowBlur: 4,
    dropShadowDistance: 2,
    align: 'center',
  });
  
  // Calculate grid layout for game cards
  const cardWidth = 250;
  const cardHeight = 300;
  const cardMargin = 20;
  const cardsPerRow = Math.floor((dimensions.width - 100) / (cardWidth + cardMargin));
  const gridStartX = (dimensions.width - (cardsPerRow * (cardWidth + cardMargin) - cardMargin)) / 2;
  
  return (
    <pixiContainer>
      {/* Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Gradient background
          // const gradientMatrix = new Matrix();
          // gradientMatrix.scale(1, dimensions.height / 100);
          // gradientMatrix.translate(0, 0);
          
          g.beginFill(0x1a1a2e);
          g.drawRect(0, 0, dimensions.width, dimensions.height);
          g.endFill();
          
          // Decorative elements
          const time = Date.now() / 1000;
          g.lineStyle(2, 0x3498db, 0.3);
          g.moveTo(0, dimensions.height * 0.3 + Math.sin(time) * 20);
          g.lineTo(dimensions.width, dimensions.height * 0.7 + Math.cos(time) * 20);
          
          g.lineStyle(2, 0x2ecc71, 0.2);
          g.moveTo(0, dimensions.height * 0.6 + Math.cos(time) * 30);
          g.lineTo(dimensions.width, dimensions.height * 0.4 + Math.sin(time) * 30);
        }}
        ref={animationRef}
      />
      
      {/* Header */}
      <pixiContainer position={[0, 20]}>
        <pixiText
          text="Game Collection"
          style={titleStyle}
          anchor={[0.5, 0]}
          position={[dimensions.width / 2, 10]}
        />
        
        {/* Navigation tabs */}
        <pixiContainer position={[dimensions.width / 2 - 200, 100]}>
          <Button
            text="Games"
            width={120}
            height={40}
            position={[0, 0]}
            color={selectedTab === 'games' ? 0x3498db : 0x2c3e50}
            onClick={() => handleTabChange('games')}
          />
          
          <Button
            text="Settings"
            width={120}
            height={40}
            position={[140, 0]}
            color={selectedTab === 'settings' ? 0x3498db : 0x2c3e50}
            onClick={() => handleTabChange('settings')}
          />
          
          <Button
            text="Help"
            width={120}
            height={40}
            position={[280, 0]}
            color={selectedTab === 'help' ? 0x3498db : 0x2c3e50}
            onClick={() => handleTabChange('help')}
          />
        </pixiContainer>
      </pixiContainer>
      
      {/* Games tab content */}
      {selectedTab === 'games' && (
        <pixiContainer position={[0, 180]}>
          {games.length === 0 ? (
            <pixiText
              text="No games available."
              style={new TextStyle({ fontFamily: 'Arial', fontSize: 20, fill: 0xcccccc, align: 'center' })}
              anchor={0.5}
              position={[dimensions.width / 2, 50]}
            />
          ) : cardsPerRow > 0 ? (
            <pixiContainer position={[gridStartX, 0]}>
              {games.map((game, index) => {
                const row = Math.floor(index / cardsPerRow);
                const col = index % cardsPerRow;
                const x = col * (cardWidth + cardMargin);
                const y = row * (cardHeight + cardMargin);

                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    position={[x, y]}
                    width={cardWidth}
                    height={cardHeight}
                    onSelect={handleGameSelect}
                  />
                );
              })}
            </pixiContainer>
          ) : (
            <pixiText
              text="Screen too small to display games. Try resizing the window."
              style={new TextStyle({ fontFamily: 'Arial', fontSize: 18, fill: 0xcccccc, align: 'center', wordWrap: true, wordWrapWidth: dimensions.width - 40 })}
              anchor={0.5}
              position={[dimensions.width / 2, 50]}
            />
          )}
        </pixiContainer>
      )}
      
      {/* Settings tab content */}
      {selectedTab === 'settings' && (
        <pixiContainer position={[dimensions.width / 2 - 250, 200]}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(0x2c3e50, 0.8);
              g.drawRoundedRect(0, 0, 500, 300, 15);
              g.endFill();
            }}
          />
          
          <pixiText
            text="Settings"
            style={new TextStyle({ fontFamily: 'Arial', fontSize: 24, fontWeight: 'bold', fill: 0xffffff })}
            position={[20, 20]}
          />
          
          <pixiText
            text="Settings options would go here"
            style={new TextStyle({ fontFamily: 'Arial', fontSize: 16, fill: 0xcccccc })}
            position={[20, 60]}
          />
        </pixiContainer>
      )}
      
      {/* Help tab content */}
      {selectedTab === 'help' && (
        <pixiContainer position={[dimensions.width / 2 - 250, 200]}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(0x2c3e50, 0.8);
              g.drawRoundedRect(0, 0, 500, 300, 15);
              g.endFill();
            }}
          />
          
          <pixiText
            text="Help & Instructions"
            style={new TextStyle({ fontFamily: 'Arial', fontSize: 24, fontWeight: 'bold', fill: 0xffffff })}
            position={[20, 20]}
          />
          
          <pixiText
            text="Help content would go here"
            style={new TextStyle({ fontFamily: 'Arial', fontSize: 16, fill: 0xcccccc })}
            position={[20, 60]}
          />
        </pixiContainer>
      )}
      
      {/* Footer */}
      <pixiContainer position={[0, dimensions.height - 40]}>
        <pixiText
          text="© 2023 Game Collection"
          style={new TextStyle({ fontFamily: 'Arial', fontSize: 12, fill: 0x777777 })}
          anchor={[0, 0]}
          position={[20, 0]}
        />
        
        <pixiText
          text="v0.1.0"
          style={new TextStyle({ fontFamily: 'Arial', fontSize: 12, fill: 0x777777 })}
          anchor={[1, 0]}
          position={[dimensions.width - 20, 0]}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default MenuScreen; 