import { useCallback } from 'react';

const Dot = ({ x, y, size }) => {
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(0xFFFFFF);
    g.drawCircle(0, 0, size);
    g.endFill();
    
    // Add a subtle shadow/glow effect
    g.beginFill(0xFFFFFF, 0.3);
    g.drawCircle(0, 0, size + 2);
    g.endFill();
  }, [size]);

  return (
    <pixiGraphics
      draw={draw}
      position={[x, y]}
    />
  );
};

export default Dot;