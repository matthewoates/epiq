import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import UserPanel from "../components/UserPanel";
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

          <Flex align='center' gap='2'>
            <Button variant={showAdmin ? 'solid' : 'outline'} onClick={() => setShowAdmin(!showAdmin)}>
              {showAdmin ? 'Hide Admin' : 'Show Admin'}
            </Button>
            <a href='/watch' target='_blank'>
              <Button>TV View</Button>
            </a>
          </Flex>
        </Flex>
      </Card>

      <Flex gap={'2'}>
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