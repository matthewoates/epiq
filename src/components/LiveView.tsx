import { Button, Flex, Text } from "@radix-ui/themes";
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
    <Flex>
      <Snapshot
        onClick={() => {
          if (watchState.name === name && watchState.live) {
            client.setWatch.mutate({ name: '__' });
          } else {
            client.setWatch.mutate({ name });
          }
        }}
        img={img}
        overlay={<Text>{name}</Text>}
      />
      <Flex direction='column' style={{ width: 48 }} gap='1'>
        {showAdmin && (
          <Button color='gray' onClick={() => {
            client.kickUser.mutate({ name });
          }}>
            kick
          </Button>
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

        <Button color='red' variant='outline' onClick={() => {
          // forces a clear
          client.setUserState.mutate({ name, primaryColor: 'black', secondaryColor: 'black' });
          client.setUserState.mutate({ name, primaryColor, secondaryColor });
        }}>clear</Button>

        <Button color='gray' variant='outline' style={{ flex: 1 }} onClick={onSaveClicked}>
          💾
        </Button>
      </Flex>
    </Flex>
  );
}

export default LiveView;