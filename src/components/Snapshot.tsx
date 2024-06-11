import { type CSSProperties, type ReactNode } from "react";
import Constants from "../Constants";

type SnapshotProps = {
  onClick?: () => void;
  img: string;
  overlay?: ReactNode;
  selected: boolean;
  style?: CSSProperties;
};

const BOX_SHADOW = '0 0 10px 10px #0f09';

function Snapshot({ onClick, img, overlay, selected, style }: SnapshotProps) {
  return (
    <div
      style={{
        ...Constants.imgSize,
        imageRendering: 'pixelated',
        backgroundImage: `url("${img}")`,
        backgroundSize: '100%',
        boxShadow: selected ? BOX_SHADOW : 'none',
        ...style
      }}
      onClick={onClick}
    >
      {overlay ?? null}
    </div>
  );
}

export default Snapshot;