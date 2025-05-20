import { Container as pixiContainer, Sprite as pixiSprite, Assets, Texture } from 'pixi.js';
import { useRef, useEffect, useState } from 'react';
import { useTick } from '@pixi/react';

export function Background({ width = 800, height = 600 }) {
    const [bgTexture, setBgTexture] = useState(null);
    const scrollRef = useRef(0);
    const scrollSpeed = 3; // Increased speed to make movement more visible
    
    // Load the background image
    useEffect(() => {
        console.log("Loading background image...");
        const bgUrl = '/images/bg.png';
        
        Assets.load(bgUrl)
            .then(texture => {
                console.log("Background image loaded successfully");
                setBgTexture(texture);
            })
            .catch(error => {
                console.error("Failed to load background image:", error);
            });
    }, []);
    
    // Use ref for scroll position to avoid re-renders
    const [, setFrame] = useState(0);
    
    // Force component to update
    const forceUpdate = () => setFrame(prev => prev + 1);
    
    // Setup animation loop with direct DOM animation for smoother scrolling
    useEffect(() => {
        if (!bgTexture) return;
        
        console.log("Setting up animation loop");
        let animationId;
        let lastTime = 0;
        
        const animate = (timestamp) => {
            // Calculate delta time (similar to Pixi ticker)
            const delta = lastTime ? (timestamp - lastTime) / 16.667 : 1;
            lastTime = timestamp;
            
            // Update scroll position
            scrollRef.current -= scrollSpeed * delta;
            
            // Reset position for seamless looping
            if (scrollRef.current <= -width) {
                scrollRef.current = 0;
            }
            
            // Force update component to re-render
            forceUpdate();
            
            // Continue animation loop
            animationId = requestAnimationFrame(animate);
        };
        
        // Start animation
        animationId = requestAnimationFrame(animate);
        
        // Clean up animation on unmount
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [bgTexture, width, scrollSpeed]);
    
    if (!bgTexture) {
        return null;
    }
    
    // Current scroll position
    const scrollX = scrollRef.current;
    
    return (
        <pixiContainer>
            {/* First background image */}
            <pixiSprite
                texture={bgTexture}
                x={scrollX}
                y={0}
                width={width}
                height={height}
            />
            {/* Second background image for seamless looping */}
            <pixiSprite
                texture={bgTexture}
                x={scrollX + width}
                y={0}
                width={width}
                height={height}
            />
        </pixiContainer>
    );
} 