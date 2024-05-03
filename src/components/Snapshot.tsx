import Constants from "../Constants";

type SnapshotProps = {
  onClick?: () => void;
  img: string;
};

function Snapshot({ onClick, img }: SnapshotProps) {
  return (
    <img
      style={Constants.imgSize}
      onClick={onClick}
      alt=''
      src={img}
    />
  );
}

export default Snapshot;