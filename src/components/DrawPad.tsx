import { RefObject, useEffect, useRef, useState } from "react";
import Constants from "../Constants";
import { createConnection } from "../routes/Draw";
import DrawPadButtons from "./DrawPadButtons";

const getContext = (cr: RefObject<HTMLCanvasElement>) => {
  return cr.current?.getContext('2d');
};

const clear = (cr: RefObject<HTMLCanvasElement>, offColor: string) => {
  const ctx = getContext(cr);

  if (ctx) {
    ctx.fillStyle = offColor;
    ctx.fillRect(0, 0, Constants.imgSize.width, Constants.imgSize.height);
  }
}

const draw = (
  cr: RefObject<HTMLCanvasElement>,
  onColor: string,
  offColor: string,
  eraseMode: boolean,
  { x, y }: { x: number, y: number }
) => {
  const ctx = getContext(cr);

  if (ctx) {
    ctx.fillStyle = eraseMode ? offColor : onColor;
    let strokeWidth = Constants.strokeWidth;
    if (eraseMode) strokeWidth *= 3;

    ctx.fillRect(x, y, strokeWidth, strokeWidth);
  }
}

function getPos(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
  if (e.target instanceof HTMLCanvasElement) {
    const { left, top } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    return { x, y };
  } else {
    throw new Error('Not a canvas element');
  }
}

function getImgData(cr: RefObject<HTMLCanvasElement>) {
  const canvas = cr.current;

  if (canvas) {
    const imgData = canvas.toDataURL('image/png');

    return imgData;
  }

  return '';
}

function sendImgData(ws: ReturnType<typeof createConnection>, cr: RefObject<HTMLCanvasElement>) {
  const img = getImgData(cr);
  ws.setImg.mutate({ img });
}

type DrawPadProps = {
  ws: ReturnType<typeof createConnection>;
};

function DrawPad({ ws }: DrawPadProps) {
  const [onColor, setOnColor] = useState('green');
  const [offColor, setOffColor] = useState('black');
  const [eraseMode, setEraseMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    clear(canvasRef, offColor);
  }, [offColor]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid black',
          ...Constants.imgSize
        }}
        width={Constants.imgSize.width}
        height={Constants.imgSize.height}
        onMouseMove={e => {
          draw(canvasRef, onColor, offColor, eraseMode, getPos(e));
          sendImgData(ws, canvasRef);
        }}
      />
      <DrawPadButtons
        undo={() => {}}
        redo={() => {}}
        eraseMode={eraseMode}
        setEraseMode={setEraseMode}
        clear={() => clear(canvasRef, offColor)}
      />
    </div>
  );
}

export default DrawPad;