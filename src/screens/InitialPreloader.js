import { useEffect } from 'react';
import { TextStyle } from 'pixi.js';
import LoadingAnimation from '../components/LoadingAnimation';
import useLoader from '../hooks/useLoader';
import { useGame } from '../context/GameContext';

// Example menu assets to load
const MENU_ASSETS = {
  // In a real application, you'd include actual assets here
  // 'menu-background': '/assets/menu-background.png',
  // 'menu-logo': '/assets/menu-logo.png',
  // 'menu-button': '/assets/menu-button.png',
};

/**
 * Initial preloader screen - loads menu assets
 * @param {Object} props - Component props
 * @param {Object} props.dimensions - Screen dimensions { width, height }
 */
const InitialPreloader = ({ dimensions }) => {
  const { loadAssets, progress } = useLoader();
  const { setLoadingProgress, setMenuLoaded } = useGame();
  
  // Load menu assets when component mounts
  useEffect(() => {
    const loadMenuAssets = async () => {
      // Simulate loading time (remove in production)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Load actual assets in a real application
      await loadAssets(MENU_ASSETS, () => {
        setMenuLoaded();
      });
    };
    
    loadMenuAssets();
  }, [loadAssets, setMenuLoaded]);
  
  // Update loading progress in context
  useEffect(() => {
    setLoadingProgress(progress);
  }, [progress, setLoadingProgress]);
  
  // Text style
  const textStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: 0xffffff,
    align: 'center',
  });
  
  const subtitleStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 18,
    fill: 0xcccccc,
    align: 'center',
  });
  
  return (
    <pixiContainer>
      {/* Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.beginFill(0x1a1a2e);
          g.drawRect(0, 0, dimensions.width, dimensions.height);
          g.endFill();
          
          // Animated circles for background effect
          const time = Date.now() / 1000;
          for (let i = 0; i < 10; i++) {
            const x = dimensions.width * (0.1 + 0.8 * Math.sin(time * 0.1 + i));
            const y = dimensions.height * (0.1 + 0.8 * Math.cos(time * 0.2 + i));
            const radius = 20 + 15 * Math.sin(time * 0.3 + i * 0.5);
            
            g.beginFill(0x16213e, 0.2);
            g.drawCircle(x, y, radius);
            g.endFill();
          }
        }}
      />
      
      {/* Title */}
      <pixiText
        text="Game Collection"
        style={textStyle}
        anchor={0.5}
        position={[dimensions.width / 2, dimensions.height / 2 - 80]}
      />
      
      {/* Subtitle */}
      <pixiText
        text="Loading menu assets..."
        style={subtitleStyle}
        anchor={0.5}
        position={[dimensions.width / 2, dimensions.height / 2 - 30]}
      />
      
      {/* Loading animation */}
      <LoadingAnimation
        progress={progress}
        width={300}
        height={20}
        position={[dimensions.width / 2 - 150, dimensions.height / 2 + 20]}
      />
      
      {/* Version info */}
      <pixiText
        text="v0.1.0"
        style={new TextStyle({ fontFamily: 'Arial', fontSize: 12, fill: 0x777777 })}
        anchor={[1, 1]}
        position={[dimensions.width - 20, dimensions.height - 20]}
      />
    </pixiContainer>
  );
};

export default InitialPreloader; 