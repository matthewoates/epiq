import { Button, Flex } from "@radix-ui/themes";
import Snapshot from "./Snapshot";

type SavedSnapshotProps = {
  watchState: { name: string, img?: string, live: boolean };
  name: string;
  img: string;
  onShowSnapshot: () => void;
  onDeleteSnapshot: () => void;
};

function SavedSnapshot({ watchState, onShowSnapshot, name, img, onDeleteSnapshot }: SavedSnapshotProps) {
  return (
    <Flex>
      <Snapshot
        img={img}
        onClick={onShowSnapshot}
      />
      <Flex direction='column' style={{ width: 48 }}>
        <Button
          style={{ flex: 1 }}
          onClick={onDeleteSnapshot}
        >
          X
        </Button>
      </Flex>
    </Flex>
  );
}

export default SavedSnapshot;