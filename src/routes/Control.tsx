import { useEffect, useMemo, useState } from "react";
import LiveView from "../components/LiveView";
import { createConnection } from "../rpc/create-client";

type ControlState = {
  users: Record<string, {
    img: string,
    primaryColor: string,
    secondaryColor: string
  }>;
};

function Control() {
  const { client } = useMemo(() => createConnection('control', 'host'), []);
  const [state, setState] = useState<ControlState>({ users: {} });
  const [watchState, setWatchState] = useState<{ name: string, img?: string, live: boolean }>({ name: '', live: false });

  useEffect(() => {
    client.watchWatch.subscribe(undefined, {
      onData: data => {
        setWatchState(data);
      }
    });
  }, []);

  useEffect(() => {
    client.watchUser.subscribe({}, {
      onData: data => {
        setState(state => {
          const { name, ...userData } = data;
          const newState = structuredClone(state);

          newState.users[name] = userData;
          return newState;
        });
      }
    });
  }, []);

  const entries = Object.entries(state.users)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div>
      <h1>control</h1>

      {entries.map(([name, userData]) => (
        <LiveView
          watchState={watchState}
          client={client}
          name={name}
          img={userData.img}
          primaryColor={userData.primaryColor}
          secondaryColor={userData.secondaryColor}
        />
      ))}
    </div>
  );
}

export default Control;