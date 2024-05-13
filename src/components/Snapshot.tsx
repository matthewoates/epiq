import { ReactNode } from "react";
import Constants from "../Constants";

type SnapshotProps = {
  onClick?: () => void;
  img: string;
  overlay?: ReactNode;
};

function Snapshot({ onClick, img, overlay }: SnapshotProps) {
  return (
    <div
      style={{
        ...Constants.imgSize,
        backgroundImage: `url("${img}")`
      }}
      onClick={onClick}
    >
      {overlay ?? null}
    </div>
  );
}

export default Snapshot;