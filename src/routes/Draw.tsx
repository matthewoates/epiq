import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import DrawPad from "../components/DrawPad";
import { createConnection } from "../rpc/create-client";

function Draw() {
  const name = useSearchParams()[0].get('n') ?? 'noname';
  const { client, wsClient } = useMemo(() => createConnection('draw', name), [name]);

  // useEffect(() => {
  //   return () => wsClient.close();
  // }, []);

  return (
    <div>
      <h1>draw</h1>
      <DrawPad client={client}/>
      <p>name: {name}</p>
    </div>
  );
}

export default Draw;