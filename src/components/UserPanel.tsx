import { useState } from "react";
import { RPCClient } from "../rpc/create-client";
import LiveView from "./LiveView";
import Snapshot from "./Snapshot";

type UserPanelProps = {
  showAdmin: boolean;
  client: RPCClient;
  watchState: { name: string, img?: string, live: boolean };
  name: string;
  liveImg: string;
  primaryColor: string;
  secondaryColor: string;
}

function UserPanel({
  showAdmin,
  client,
  watchState,
  name,
  liveImg,
  primaryColor,
  secondaryColor
}: UserPanelProps) {
  const [saved, setSaved] = useState<string[]>([]);

  const onSaveClicked = () => {
    if (!saved.includes(liveImg)) {
      setSaved([...saved, liveImg]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <LiveView
        showAdmin={showAdmin}
        client={client}
        watchState={watchState}
        name={name}
        img={liveImg}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onSaveClicked={onSaveClicked}
      />

      {saved.map(img => (
        <Snapshot
          key={img}
          img={img}
          onClick={() => {
            const used = watchState.img === img;

            if (used) client.setWatch.mutate({ name: '__' });
            else client.setWatch.mutate({ name, img });
          }}
        />
      ))}
    </div>
  );
}

export default UserPanel;