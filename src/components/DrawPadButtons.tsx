import { Button } from "@radix-ui/themes";
import { IconArrowBackUp, IconArrowForwardUp, IconSquareX } from "@tabler/icons-react";

type DrawButtonProps = {
  primaryColor: string;
  secondaryColor: string;
  undo: () => void;
  redo: () => void;
  eraseMode: boolean;
  setEraseMode: (eraseMode: boolean) => void;
  clear: () => void;
};

function DrawPadButtons({
  primaryColor,
  secondaryColor,
  undo,
  redo,
  eraseMode,
  setEraseMode,
  clear
}: DrawButtonProps) {
  return (
    <div style={{
      background: '#26A1B0',
      gap: '0.5em',
      padding: '0.5em',
      flex: 1,
      display: 'grid',
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr'
    }}>
      <Button color='gray' style={{ height: '100%' }} onClick={undo}><IconArrowBackUp size={64} /></Button>
      <Button color='gray' style={{ height: '100%' }} onClick={redo}><IconArrowForwardUp size={64} /></Button>

      <Button
        style={{ height: '100%', background: primaryColor }}
        onClick={() => setEraseMode(false)}
        disabled={!eraseMode}
      >
        pencil
      </Button>

      <Button
        style={{ height: '100%', background: secondaryColor }}
        onClick={() => setEraseMode(true)}
        disabled={eraseMode}
      />

      <Button style={{ height: '100%' }} color='red' onClick={() => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Erase everything?')) clear();
      }}>
        <IconSquareX size={64} />
      </Button>
    </div >
  );
}

export default DrawPadButtons;