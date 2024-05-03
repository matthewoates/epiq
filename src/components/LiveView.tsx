import type { RPCClient } from "../rpc/create-client";
import Snapshot from "./Snapshot";

type LiveViewProps = {
  client: RPCClient;
  name: string;
  img: string;
  primaryColor: string;
  secondaryColor: string;
};

function LiveView({ client, name, img, primaryColor, secondaryColor }: LiveViewProps) {
  return (
    <div>
      <p>Name: {name}</p>
      <Snapshot img={img}/>
      <input
        type='color'
        value={primaryColor}
        onChange={e => client.setUserState.mutate({
          name,
          primaryColor: e.target.value
        })}
      />
      <input
        type='color'
        value={secondaryColor}
        onChange={e => client.setUserState.mutate({
          name,
          secondaryColor: e.target.value
        })}
      />
      <button onClick={() => {
        // forces a clear
        client.setUserState.mutate({ name, primaryColor: 'black', secondaryColor: 'black' });
        client.setUserState.mutate({ name, primaryColor, secondaryColor });
      }}>clear</button>
      <button>save</button>
    </div>
  );
}

export default LiveView;