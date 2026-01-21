import { useState, useEffect, RefObject } from 'react';

interface MousePosition {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
}

export const useMousePosition = (ref?: RefObject<HTMLElement>) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    centerX: 0,
    centerY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = x - rect.width / 2;
        const centerY = y - rect.height / 2;
        setMousePosition({ x, y, centerX, centerY });
      } else {
        setMousePosition({
          x: event.clientX,
          y: event.clientY,
          centerX: event.clientX - window.innerWidth / 2,
          centerY: event.clientY - window.innerHeight / 2,
        });
      }
    };

    const element = ref?.current || window;
    element.addEventListener('mousemove', handleMouseMove as EventListener);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
    };
  }, [ref]);

  return mousePosition;
};

export default useMousePosition;
