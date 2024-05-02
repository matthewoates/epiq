type SnapshotProps = {
  img: string;
};

function Snapshot({ img }: SnapshotProps) {
  return <img alt='' src={img}/>;
}

export default Snapshot;