import { useState } from "react";
import DrawPad from "../components/DrawPad";

function Draw() {
  const [onColor, setOnColor] = useState('green');
  const [offColor, setOffColor] = useState('black');

  return (
    <div>
      <h1>draw</h1>
      <DrawPad
        onColor={onColor}
        offColor={offColor}
      />
    </div>
  );
}

export default Draw;