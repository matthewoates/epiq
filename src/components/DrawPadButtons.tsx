import { Button, Flex, Text } from "@radix-ui/themes";
import { IconArrowBackUp, IconArrowForwardUp, IconSquareX } from "@tabler/icons-react";
import { useRef, type ReactNode } from "react";

const BG_COLOR = '#26A1B0';

type DrawButtonProps = {
  children: ReactNode;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  undo: (() => void) | null;
  redo: (() => void) | null;
  eraseMode: boolean;
  setEraseMode: (eraseMode: boolean) => void;
  clear: () => void;
};

function DrawPadButtons({
  children,
  name,
  primaryColor,
  secondaryColor,
  undo,
  redo,
  eraseMode,
  setEraseMode,
  clear,
}: DrawButtonProps) {
  const epqClicks = useRef<number[]>([]);
  let primaryBorder = 'none';
  let secondaryBorder = `20px solid ${BG_COLOR}`;

  if (eraseMode) [primaryBorder, secondaryBorder] = [secondaryBorder, primaryBorder];

  const clickEPQ = () => {
    const arr = epqClicks.current;

    arr.push(Date.now());

    if (arr.length > 7) arr.shift();

    if (Date.now() - arr[0] < 3_000 && arr.length === 7) {
      const name = prompt('Choose a name:');

      if (name) {
        localStorage.setItem('name', name.trim());
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    }
  };

  return (
    <div style={{
      background: '#26A1B0',
      flex: 1,
      width: '100%',
      display: 'flex',
    }}>
      {/* <div style={{ padding: '1em', flex: 1, display: 'flex', flexDirection: 'column', alignContent: 'stretch' }}> */}
      <Flex style={{ padding: '1em', flex: 1, gap: '1em' }} direction='column'>
        <Button disabled={!undo} style={{ flex: 2 }} color='gray' onClick={undo ?? undefined}><IconArrowBackUp size={64} /></Button>
        <Button disabled={!redo} style={{ flex: 2 }} color='gray' onClick={redo ?? undefined}><IconArrowForwardUp size={64} /></Button>

        <Button style={{ flex: 1 }} color='red' onClick={() => {
          // eslint-disable-next-line no-restricted-globals
          if (confirm('Erase everything?')) clear();
        }}>
          <IconSquareX size={64} />
        </Button>
      </Flex>

      {children}

      <Flex style={{ padding: '1em', flex: 1, gap: '1em' }} direction='column'>
        {/* <div style={{ padding: '1em', flex: 1, display: 'flex', flexDirection: 'column' }}> */}
        <Button
          style={{ flex: 2, background: primaryColor, border: primaryBorder }}
          onClick={() => setEraseMode(false)}
          disabled={!eraseMode}
        />

        <Button
          style={{ flex: 2, background: secondaryColor, border: secondaryBorder }}
          onClick={() => setEraseMode(true)}
          disabled={eraseMode}
        />

        <Flex style={{ flex: 1 }} justify='between' direction='column' align='end'>
          <Text size='7' style={{ fontFamily: 'norwester' }}>{name}</Text>
          <Text onClick={clickEPQ} size='7' style={{ fontFamily: 'norwester' }}>EPQ</Text>
        </Flex>
      </Flex>
    </div >
  );
}

export default DrawPadButtons;