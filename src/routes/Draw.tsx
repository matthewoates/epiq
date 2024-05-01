import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DrawPad from "../components/DrawPad";

function Draw() {
  const name = useSearchParams()[0].get('n');
  const [onColor, setOnColor] = useState('green');
  const [offColor, setOffColor] = useState('black');

  return (
    <div>
      <h1>draw</h1>
      <DrawPad
        onColor={onColor}
        offColor={offColor}
      />
      <button>undo</button>
      <button>redo</button>
      <button>eraser</button>
      <button>clear</button>
      <p>name: {name}</p>
    </div>
  );
}

export default Draw;