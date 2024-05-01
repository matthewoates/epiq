type DrawButtonProps = {
  undo: () => void;
  redo: () => void;
  eraseMode: boolean;
  setEraseMode: (eraseMode: boolean) => void;
  clear: () => void;
};

function DrawPadButtons({ undo, redo, eraseMode, setEraseMode, clear }: DrawButtonProps) {
  return (
    <div>
      <button onClick={undo}>undo</button>

      <button onClick={redo}>redo</button>

      <button
        onClick={() => setEraseMode(false)}
        disabled={!eraseMode}
      >
        pencil
      </button>

      <button
        onClick={() => setEraseMode(true)}
        disabled={eraseMode}
      >
        eraser
      </button>

      <button onClick={() => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Erase everything?')) clear();
      }}>clear</button>
    </div>
  );
}

export default DrawPadButtons;