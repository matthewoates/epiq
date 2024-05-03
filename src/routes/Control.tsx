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

  return (
    <div>
      <h1>control</h1>

      {Object.entries(state.users).map(([name, userData]) => (
        <LiveView
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