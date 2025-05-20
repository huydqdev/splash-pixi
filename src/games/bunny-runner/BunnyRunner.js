import { Container as pixiContainer } from 'pixi.js';
import { Background } from './Background';
import { BunnySprite } from '../bunny/BunnySprite';
import { useState, useEffect } from 'react';

export function BunnyRunner({ dimensions = { width: window.innerWidth, height: window.innerHeight } }) {
    const [gameSize, setGameSize] = useState(dimensions);
    
    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setGameSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        
        // Set initial size if dimensions weren't provided
        if (!dimensions.width || !dimensions.height) {
            handleResize();
        }
        
        // Listen for window resize events
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dimensions]);
    
    // Position the bunny in a good spot (slightly left of center, and on the ground)
    const bunnyPosition = {
        x: gameSize.width * 0.4,
        y: gameSize.height * 0.65
    };
    
    return (
        <pixiContainer>
            <Background width={gameSize.width} height={gameSize.height} />
            <BunnySprite x={bunnyPosition.x} y={bunnyPosition.y} />
        </pixiContainer>
    );
} 