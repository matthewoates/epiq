import { useEffect, useMemo, useState } from "react";
import Snapshot from "../components/Snapshot";
import { createConnection } from "../rpc/create-client";

type ControlState = {
  users: Record<string, {
    live: string,
    saved: string[]
  }>;
};

function Control() {
  const { client } = useMemo(() => createConnection('control', 'host'), []);
  const [state, setState] = useState<ControlState>({ users: {} });

  useEffect(() => {
    client.watchImages.subscribe(undefined, {
      onData: data => {
        setState(state => {
          const newState = structuredClone(state);

          newState.users[data.name] = { live: data.img, saved: [] };

          return newState;
        });
      }
    })
  }, []);

  return (
    <div>
      <h1>control</h1>

      <button onClick={() => client.setColor.mutate({ name: 'Ray', primaryColor: 'red', secondaryColor: 'black' })}>red</button>
      <button onClick={() => client.setColor.mutate({ name: 'Ray', primaryColor: 'green', secondaryColor: 'black' })}>green</button>
      <button onClick={() => client.setColor.mutate({ name: 'Ray', primaryColor: 'blue', secondaryColor: 'black' })}>blue</button>

      {Object.entries(state.users).map(([name, userData]) => (
        <div key={name}>
          <h1>{name}</h1>
          <Snapshot img={userData.live}/>
        </div>
      ))}
    </div>
  );
}

export default Control;