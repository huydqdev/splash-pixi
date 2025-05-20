import { Container, Graphics } from 'pixi.js';
import { useEffect, useRef } from 'react';

/**
 * Loading animation component with progress indicator
 * @param {Object} props - Component props
 * @param {number} props.progress - Loading progress (0-100)
 * @param {number} props.width - Width of the loading bar
 * @param {number} props.height - Height of the loading bar
 * @param {Array} props.position - Position [x, y] of the loading bar
 */
const LoadingAnimation = ({ progress, width = 300, height = 20, position = [0, 0] }) => {
  const backgroundRef = useRef();
  const progressRef = useRef();
  const animationRef = useRef(0);

  // Animated effect for progress bar
  useEffect(() => {
    let currentProgress = 0;
    const targetProgress = progress;
    const speed = 2;
    
    const animate = () => {
      if (Math.abs(currentProgress - targetProgress) > 0.1) {
        currentProgress += (targetProgress - currentProgress) * 0.1;
        
        // Draw the progress bar
        if (progressRef.current) {
          progressRef.current.clear();
          progressRef.current.beginFill(0xffffff);
          progressRef.current.drawRoundedRect(0, 0, (width * currentProgress) / 100, height, height / 2);
          progressRef.current.endFill();
        }
        
        animationRef.current = requestAnimationFrame(animate);
      } else if (currentProgress !== targetProgress) {
        currentProgress = targetProgress;
        
        // Final draw
        if (progressRef.current) {
          progressRef.current.clear();
          progressRef.current.beginFill(0xffffff);
          progressRef.current.drawRoundedRect(0, 0, (width * currentProgress) / 100, height, height / 2);
          progressRef.current.endFill();
        }
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [progress, width, height]);

  return (
    <Container position={position}>
      {/* Background of loading bar */}
      <Graphics
        ref={backgroundRef}
        draw={(g) => {
          g.clear();
          g.beginFill(0x333333, 0.8);
          g.drawRoundedRect(0, 0, width, height, height / 2);
          g.endFill();
        }}
      />
      
      {/* Progress part of loading bar */}
      <Graphics
        ref={progressRef}
        draw={(g) => {
          g.clear();
          g.beginFill(0xffffff);
          g.drawRoundedRect(0, 0, 0, height, height / 2);
          g.endFill();
        }}
      />
      
      {/* Text showing percentage */}
      <Container position={[width / 2, -height]}>
        <Graphics
          draw={(g) => {
            g.clear();
            // Draw text - can be replaced with BitmapText for better performance
            const text = `${Math.round(progress)}%`;
            g.beginFill(0xffffff);
            g.drawCircle(0, 0, height / 2);
            g.endFill();
          }}
        />
      </Container>
    </Container>
  );
};

export default LoadingAnimation; 