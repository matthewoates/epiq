import { useEffect, useMemo, useState } from "react";
import Snapshot from "../components/Snapshot";
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
    <div>
      <h1>watch</h1>
      <p>name: {state.name}</p>
      <Snapshot img={state.img ?? ''} selected={false}/>
    </div>
  );
}

export default Watch;