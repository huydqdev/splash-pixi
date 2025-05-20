import { useCallback, useState } from 'react';
import { TextStyle } from 'pixi.js';
import { Container, Graphics, Sprite, Text } from "pixi.js";

/**
 * Interactive button component
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {Function} props.onClick - Click handler
 * @param {Array} props.position - Position [x, y]
 * @param {number} props.width - Button width
 * @param {number} props.height - Button height
 * @param {number} props.cornerRadius - Border radius
 * @param {number} props.color - Button color
 * @param {number} props.hoverColor - Button hover color
 */

const Button = ({
  text,
  onClick,
  position = [0, 0],
  width = 200,
  height = 50,
  cornerRadius = 10,
  color = 0x4287f5,
  hoverColor = 0x5c9aff,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Event handlers
  const handlePointerDown = useCallback(() => {
    setIsPressed(true);
  }, []);
  
  const handlePointerUp = useCallback(() => {
    if (isPressed) {
      onClick && onClick();
    }
    setIsPressed(false);
  }, [isPressed, onClick]);
  
  const handlePointerOver = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  
  // Calculate current color based on state
  const currentColor = isPressed ? 0x3a69b0 : isHovered ? hoverColor : color;
  
  // Button text style
  const textStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'bold',
    fill: 0xffffff,
    align: 'center',
  });
  
  return (
    <Container 
      position={position}
      interactive={true}
      pointerdown={handlePointerDown}
      pointerup={handlePointerUp}
      pointerupoutside={handlePointerUp}
      pointerover={handlePointerOver}
      pointerout={handlePointerOut}
      cursor="pointer"
    >
      {/* Button background */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(currentColor);
          g.drawRoundedRect(0, 0, width, height, cornerRadius);
          g.endFill();
          
          // Add shadow effect
          if (isHovered && !isPressed) {
            g.lineStyle(2, 0xffffff, 0.3);
            g.drawRoundedRect(0, 0, width, height, cornerRadius);
          }
        }}
      />
      
      {/* Button text */}
      <Text
        text={text}
        style={textStyle}
        anchor={0.5}
        position={[width / 2, height / 2]}
      />
    </Container>
  );
};

export default Button; 