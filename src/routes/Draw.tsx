import { useSearchParams } from "react-router-dom";
import DrawPad from "../components/DrawPad";

function Draw() {
  const name = useSearchParams()[0].get('n');

  return (
    <div>
      <h1>draw</h1>
      <DrawPad/>
      <p>name: {name}</p>
    </div>
  );
}

export default Draw;