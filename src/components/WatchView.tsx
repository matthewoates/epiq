import Constants from "../Constants";
import Snapshot from "./Snapshot";

type WatchViewProps = {
  img: string | null;
};

function WatchView({ img }: WatchViewProps) {
  return (
    <div>
      {img
        ? <Snapshot img={img} selected={false} style={{ width: Constants.imgSize.width * 2, height: Constants.imgSize.height * 2 }}/>
        : null
      }
    </div>
  );
}

export default WatchView;