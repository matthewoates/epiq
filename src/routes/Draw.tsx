import { useMemo } from "react";
import DrawPad from "../components/DrawPad";
import SizeProvider from "../components/SizeProvider";
import { createConnection } from "../rpc/create-client";

function Draw() {
  const name = useMemo(() => localStorage.getItem('name') ?? 'noname', []);
  const { client, wsClient } = useMemo(() => createConnection('draw', name), [name]);

  // useEffect(() => {
  //   return () => wsClient.close();
  // }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', position: 'absolute' }}>
      <SizeProvider waitForSize>
        <DrawPad client={client} name={name} />
      </SizeProvider>
    </div>
  );
}

export default Draw;