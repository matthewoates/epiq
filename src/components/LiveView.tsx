import type { RPCClient } from "../rpc/create-client";
import Snapshot from "./Snapshot";

type LiveViewProps = {
  showAdmin: boolean;
  client: RPCClient;
  watchState: { name: string, img?: string, live: boolean };
  name: string;
  img: string;
  primaryColor: string;
  secondaryColor: string;
  onSaveClicked: () => void;
};

function LiveView({
  showAdmin,
  client,
  watchState,
  name,
  img,
  primaryColor,
  secondaryColor,
  onSaveClicked
}: LiveViewProps) {
  return (
    <div>
      <p>Name: {name}</p>
      <Snapshot
        onClick={() => {
          if (watchState.name === name && watchState.live) {
            client.setWatch.mutate({ name: '__' });
          } else {
            client.setWatch.mutate({ name });
          }
        }}
        img={img}
      />
      {showAdmin && (
        <button onClick={() => {
          client.kickUser.mutate({ name });
        }}>
          kick
        </button>
      )}
      {showAdmin && (<input
        type='color'
        value={primaryColor}
        onChange={e => client.setUserState.mutate({
          name,
          primaryColor: e.target.value
        })}
      />)}
      {showAdmin && (<input
        type='color'
        value={secondaryColor}
        onChange={e => client.setUserState.mutate({
          name,
          secondaryColor: e.target.value
        })}
      />)}
      <button onClick={() => {
        // forces a clear
        client.setUserState.mutate({ name, primaryColor: 'black', secondaryColor: 'black' });
        client.setUserState.mutate({ name, primaryColor, secondaryColor });
      }}>clear</button>
      <button onClick={onSaveClicked}>save</button>
    </div>
  );
}

export default LiveView;