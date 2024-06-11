import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import UserPanel from "../components/UserPanel";
import WatchView from "../components/WatchView";
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
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTV, setShowTV] = useState(false);

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
      <Card>
        <Flex align='center' justify='between'>
          <Text size='7'>EPiQ Draw</Text>

          <Flex align='center' gap='4'>
            <Flex align='center' gap='2'>
              <Button color='green'>save all</Button>
              <Button color='pink'>clear all</Button>
            </Flex>

            <Flex align='center' gap='2'>
              <Button variant={showTV ? 'solid' : 'outline'} onClick={() => setShowTV(!showTV)}>
                {showTV ? 'Hide TV' : 'Show TV'}
              </Button>
              <Button variant={showAdmin ? 'solid' : 'outline'} onClick={() => setShowAdmin(!showAdmin)}>
                {showAdmin ? 'Hide Admin' : 'Show Admin'}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>

      {showTV
        ? <WatchView img={watchState.img ?? null}/>
        : null
      }

      <Flex gap='2'>
        {entries.map(([name, userData]) => (
          <UserPanel
            showAdmin={showAdmin}
            watchState={watchState}
            client={client}
            name={name}
            liveImg={userData.img}
            primaryColor={userData.primaryColor}
            secondaryColor={userData.secondaryColor}
          />
        ))}
      </Flex>
    </div>
  );
}

export default Control;