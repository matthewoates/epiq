import { Card, Text } from "@radix-ui/themes";
import { useState } from "react";
import { RPCClient } from "../rpc/create-client";
import LiveView from "./LiveView";
import SavedSnapshot from "./SavedSnapshot";

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

  const onSaveLiveViewClicked = () => {
    if (!saved.includes(liveImg)) {
      setSaved([...saved, liveImg]);
    }
  };

  const deleteSnapshot = (img: string) => {
    setSaved(saved.filter(el => el !== img));
  };

  const isBeingWatched = name === watchState.name;

  return (
    <Card style={{ background:  isBeingWatched ? 'rgba(255,255,255,0.1)' : 'transparent' }}>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <Text size='5'>{name}</Text>

      <LiveView
        showAdmin={showAdmin}
        client={client}
        watchState={watchState}
        name={name}
        img={liveImg}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onSaveClicked={onSaveLiveViewClicked}
      />

      {saved.map(img => (
        <SavedSnapshot
          key={img}
          name={name}
          watchState={watchState}
          img={img}
          onDeleteSnapshot={() => deleteSnapshot(img)}
          onShowSnapshot={() => {
            const used = watchState.img === img;

            if (used) client.setWatch.mutate({ name: '__' });
            else client.setWatch.mutate({ name, img });
          }}
        />
      ))}
    </div>
    </Card>
  );
}

export default UserPanel;