import { type CSSProperties } from "react";

type WatchViewProps = {
  img: string | null;
  style?: CSSProperties;
};

const IMG_STYLE: CSSProperties = {
  objectFit: 'contain',
  width: '100vw',
  height: '100vh',
  background: '#ddd'
};

function WatchView({ img, style }: WatchViewProps) {
  return (
    <div>
      {img
        ? <img src={img} style={{ ...IMG_STYLE, ...style }} alt='' />
        : <div style={{ ...IMG_STYLE, ...style }} />
      }
      {/* {img
        ? (
          <Snapshot
            img={img}
            selected={false}
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100vw',
              height: '100vh',
            }}
          />
        ) : null
      } */}
    </div>
  );
}

export default WatchView;