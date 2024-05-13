import { ReactNode } from "react";
import Constants from "../Constants";

type SnapshotProps = {
  onClick?: () => void;
  img: string;
  overlay?: ReactNode;
  selected: boolean;
};

const BOX_SHADOW = '0 0 10px 10px #0f09';

function Snapshot({ onClick, img, overlay, selected }: SnapshotProps) {
  return (
    <div
      style={{
        ...Constants.imgSize,
        backgroundImage: `url("${img}")`,
        boxShadow: selected ? BOX_SHADOW : 'none'
      }}
      onClick={onClick}
    >
      {overlay ?? null}
    </div>
  );
}

export default Snapshot;