import { useContext, useEffect, useRef, useState, type RefObject } from "react";
import Constants from "../Constants";
import type { RPCClient } from "../rpc/create-client";
import DrawPadButtons from "./DrawPadButtons";
import { SizeContext } from "./SizeProvider";

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
  pos: { x: number, y: number },
  prev: { x: number, y: number }[]
) => {
  const ctx = getContext(cr);

  if (ctx) {
    let strokeWidth = Constants.strokeWidth;
    if (eraseMode) strokeWidth *= 6;
    ctx.strokeStyle = eraseMode ? offColor : onColor;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    const points = [...prev, pos];
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.stroke();
  }
}

function getPos(e: TouchEvent, scale: number) {
  const touch = e.touches[0];
  if (!touch) return;

  if (e.target instanceof HTMLCanvasElement) {
    const { left, top } = e.target.getBoundingClientRect();
    const x = Math.round((touch.clientX - left) * scale);
    const y = Math.round((touch.clientY - top) * scale);

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

function sendImgData(client: RPCClient, cr: RefObject<HTMLCanvasElement>) {
  const img = getImgData(cr);
  client.setUserState.mutate({ img });
}

type DrawPadProps = {
  client: RPCClient;
  name: string;
};

function getDrawSize(size: { width: number, height: number }) {
  let { width, height } = size;

  if (width / 4 > height / 3) {
    width = Math.floor(height * (4 / 3));
  } else {
    height = Math.floor(width * (3 / 4));
  }

  return { width, height };
}

function DrawPad({ client, name }: DrawPadProps) {
  const [onColor, setOnColor] = useState('green');
  const [offColor, setOffColor] = useState('black');
  const [eraseMode, setEraseMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawSize = getDrawSize(useContext(SizeContext));
  const prevPos = useRef<{ x: number, y: number }[]>([]);

  useEffect(() => {
    clear(canvasRef, offColor);
    sendImgData(client, canvasRef);

    client.watchColors.subscribe({}, {
      onData: data => {
        const { primaryColor, secondaryColor } = data;
        if (primaryColor) setOnColor(primaryColor);
        if (secondaryColor) setOffColor(secondaryColor);
      }
    });
  }, [onColor, offColor]);

  function touchEvent(e: TouchEvent) {
    e.preventDefault(); // prevent the page from moving around

    const pos = getPos(e, Constants.imgSize.width / drawSize.width);

    if (pos) {
      if (e.type === 'touchstart') {
        prevPos.current.length = 0;
      }
      while (prevPos.current.length > 2) prevPos.current.shift();
      const prev = prevPos.current ?? pos;
      draw(canvasRef, onColor, offColor, eraseMode, pos, prev);
      prevPos.current.push(pos);
      sendImgData(client, canvasRef);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const events = ['touchstart', 'touchmove', 'touchend'] as const;

    events.forEach(event => {
      canvas?.addEventListener(event, touchEvent, { passive: false });
    });

    return () => {
      events.forEach(event => {
        canvas?.removeEventListener(event, touchEvent);
      });
    };
  })

  return (
    <div style={{ display: 'flex' }}>
      <DrawPadButtons
        name={name}
        primaryColor={onColor}
        secondaryColor={offColor}
        undo={() => { }}
        redo={() => { }}
        eraseMode={eraseMode}
        setEraseMode={setEraseMode}
        clear={() => {
          clear(canvasRef, offColor);
          sendImgData(client, canvasRef);
        }}
        drawSize={drawSize}
      >
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid black',
            imageRendering: 'pixelated',
            ...drawSize
          }}
          width={Constants.imgSize.width}
          height={Constants.imgSize.height}
        />
      </DrawPadButtons>
    </div>
  );
}

export default DrawPad;