import { useRef } from "react";
import Constants from "../Constants";

type DrawPadProps = {
  onColor: string;
  offColor: string;
}

function DrawPad({ onColor, offColor }: DrawPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: '1px solid black',
        ...Constants.imgSize
      }}
      width={Constants.imgSize.width}
      height={Constants.imgSize.height}
      onMouseMove={e => {
        if (e.target instanceof HTMLCanvasElement) {
          const { left, top } = e.target.getBoundingClientRect();
          const x = e.clientX - left;
          const y = e.clientY - top;
          console.log({ x, y });

          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
              ctx.fillStyle = onColor;
              ctx.fillRect(
                x,
                y,
                Constants.strokeWidth,
                Constants.strokeWidth
              )
            }
          }
        }
      }}
    />
  );
}

export default DrawPad;