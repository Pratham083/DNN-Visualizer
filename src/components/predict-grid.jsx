import { useEffect, useRef } from 'react';
const Grid = ({ predictions }) => {
  const canvasRef = useRef(null);
  const pixelSize = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < predictions.length; i++) {
      for (let j = 0; j < predictions[i].length; j++) {
        ctx.fillStyle = `rgb(${predictions[i][j][0] * 255},${
          predictions[i][j][0] * 255
        },${predictions[i][j][0] * 255})`;
        ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
      }
    }
  }, [predictions]);

  return (
    <canvas
      ref={canvasRef}
      width={predictions.length * pixelSize}
      height={predictions.length * pixelSize}
      style={{ border: '1px solid black' }}
    >
      Your browser does not support the canvas element.
    </canvas>
  );
};
export default Grid;
