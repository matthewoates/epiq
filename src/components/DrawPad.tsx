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

function sendImgData(client: RPCClient, cr: RefObject<HTMLCanvasElement>) {
  const img = getImgData(cr);
  client.setUserState.mutate({ img });
}

type DrawPadProps = {
  client: RPCClient;
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

function DrawPad({ client }: DrawPadProps) {
  const [onColor, setOnColor] = useState('green');
  const [offColor, setOffColor] = useState('black');
  const [eraseMode, setEraseMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawSize = getDrawSize(useContext(SizeContext));

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

  return (
    <div style={{ display: 'flex' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid black',
          ...drawSize
        }}
        width={Constants.imgSize.width}
        height={Constants.imgSize.height}
        onMouseMove={e => {
          draw(canvasRef, onColor, offColor, eraseMode, getPos(e));
          sendImgData(client, canvasRef);
        }}
      />
      <DrawPadButtons
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
      />
    </div>
  );
}

export default DrawPad;