import Snapshot from "./Snapshot";

type WatchViewProps = {
  img: string | null;
};

function WatchView({ img }: WatchViewProps) {
  return (
    <div>
      {img
        ? <Snapshot img={img} selected={false}/>
        : null
      }
    </div>
  );
}

export default WatchView;