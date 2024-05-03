type SnapshotProps = {
  onClick?: () => void;
  img: string;
};

function Snapshot({ onClick, img }: SnapshotProps) {
  return (
    <img
      onClick={onClick}
      alt=''
      src={img}
    />
  );
}

export default Snapshot;