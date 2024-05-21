import { useEffect, useMemo, useState } from "react";
import WatchView from "../components/WatchView";
import { createConnection } from "../rpc/create-client";

function Watch() {
  const { client } = useMemo(() => createConnection('watch', 'tv'), []);
  const [state, setState] = useState<{ name: string, img?: string }>({ name: '' });

  useEffect(() => {
    client.watchWatch.subscribe(undefined, {
      onData: data => {
        setState(data);
      }
    });
  }, []);


  return (
    <WatchView img={state.img ?? null}/>
  );
}

export default Watch;