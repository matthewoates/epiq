import { Button, Flex } from "@radix-ui/themes";
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
  onSaveClicked: (() => void) | null;
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
  const selected = watchState.name === name && watchState.live;

  return (
    <Flex>
      <Snapshot
        selected={selected}
        onClick={() => {
          if (watchState.name === name && watchState.live) {
            client.setWatch.mutate({ name: '__' });
          } else {
            client.setWatch.mutate({ name });
          }
        }}
        img={img}
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

        <Button className='btn-clear' color='red' variant='outline' onClick={() => {
          // forces a clear
          client.setUserState.mutate({ name, primaryColor: 'black', secondaryColor: 'black' });
          client.setUserState.mutate({ name, primaryColor, secondaryColor });
        }}>clear</Button>

        <Button
          className='btn-save'
          color='gray'
          variant='outline'
          style={{ flex: 1 }}
          onClick={onSaveClicked ?? undefined}
          disabled={!onSaveClicked}
        >
          💾
        </Button>
      </Flex>
    </Flex>
  );
}

export default LiveView;