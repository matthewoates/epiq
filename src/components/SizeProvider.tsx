import { ReactNode, createContext, useMemo } from 'react';
import { useResizeDetector } from 'react-resize-detector';

type SizeProviderProps = {
  children?: ReactNode;
  waitForSize?: boolean;
}

export const SizeContext = createContext({ width: 0, height: 0 });

function SizeProvider({ waitForSize, children }: SizeProviderProps) {
  const { width, height, ref } = useResizeDetector();
  const size = useMemo(() => ({ width: width ?? 0, height: height ?? 0 }), [width, height]);

  return (
    <SizeContext.Provider value={size}>
      <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {(!waitForSize || width || height) ? children : null}
      </div>
    </SizeContext.Provider>
  )
}

export default SizeProvider;