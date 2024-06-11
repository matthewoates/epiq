import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import DrawPad from "../components/DrawPad";
import SizeProvider from "../components/SizeProvider";
import { createConnection } from "../rpc/create-client";

function Draw() {
  const name = useSearchParams()[0].get('n') ?? 'noname';
  const { client, wsClient } = useMemo(() => createConnection('draw', name), [name]);

  // useEffect(() => {
  //   return () => wsClient.close();
  // }, []);

  return (
    // <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
    <div style={{ display: 'flex', width: 915, height: 412, overflow: 'hidden' }}>
      <SizeProvider waitForSize>
        <DrawPad client={client} name={name} />
      </SizeProvider>
    </div>
  );
}

export default Draw;