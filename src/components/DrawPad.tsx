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
};

const drawImg = (cr: RefObject<HTMLCanvasElement>, src: string, offColor: string) => {
  const ctx = getContext(cr);

  if (ctx) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      clear(cr, offColor);
      ctx.drawImage(img, 0, 0, Constants.imgSize.width, Constants.imgSize.height);
    };
  }
};

function getPos(e: TouchEvent, scale: number) {
  const touch = e.touches[0];
  if (!touch) return;

  if (e.target instanceof HTMLCanvasElement) {
    const { left, top } = e.target.getBoundingClientRect();
    const x = Math.floor((touch.clientX - left) * scale);
    const y = Math.floor((touch.clientY - top) * scale);

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
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const undoImgData = useRef<string>('');

  useEffect(() => {
    clear(canvasRef, offColor);
    sendImgData(client, canvasRef);

    client.watchColors.subscribe({}, {
      onData: data => {
        const { primaryColor, secondaryColor } = data;
        if (primaryColor) setOnColor(primaryColor);
        if (secondaryColor) setOffColor(secondaryColor);
        setUndoStack([]);
        setRedoStack([]);
      }
    });
  }, [onColor, offColor]);

  function touchEvent(e: TouchEvent) {
    e.preventDefault(); // prevent the page from moving around

    const pos = getPos(e, Constants.imgSize.width / drawSize.width);

    if (e.type === 'touchend') {
      if (undoImgData.current) setUndoStack([...undoStack, undoImgData.current]);
      undoImgData.current = '';
    }

    if (pos) {
      if (e.type === 'touchstart') {
        prevPos.current.length = 0;
        undoImgData.current = getImgData(canvasRef);
      }

      while (prevPos.current.length > 2) prevPos.current.shift();
      const prev = prevPos.current ?? pos;
      draw(canvasRef, onColor, offColor, eraseMode, pos, prev);
      prevPos.current.push(pos);
      sendImgData(client, canvasRef);
      if (redoStack.length) setRedoStack([]);
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
  });

  const undo = () => {
    const oldImg = getImgData(canvasRef);
    const img = undoStack.at(-1);

    if (img) {
      drawImg(canvasRef, img, offColor);
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
      setRedoStack([...redoStack, oldImg]);
    }
  };

  const redo = () => {
    const oldImg = getImgData(canvasRef);
    const img = redoStack.at(-1);

    if (img) {
      drawImg(canvasRef, img, offColor);
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
      setUndoStack([...undoStack, oldImg]);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <DrawPadButtons
        name={name}
        primaryColor={onColor}
        secondaryColor={offColor}
        undo={undoStack.length ? undo : null}
        redo={redoStack.length ? redo : null}
        eraseMode={eraseMode}
        setEraseMode={setEraseMode}
        clear={() => {
          clear(canvasRef, offColor);
          sendImgData(client, canvasRef);
        }}
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