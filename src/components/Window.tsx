import Draggable from 'react-draggable';
import useWindowStore from '../store/window';
import clsx from 'clsx';
import React from 'react';

interface WindowProps {
  windowKey: string;
  children: React.ReactNode;
}

const Window = ({ windowKey, children }: WindowProps) => {
  const win = useWindowStore((state) => state.windows[windowKey]);
  const { focusWindow, updatePosition } = useWindowStore();

  if (!win?.isOpen) return null;

  return (
    <Draggable
      handle=".window-header"
      position={win.isMaximized ? { x: 0, y: 0 } : win.position}
      onStop={(e, data) => updatePosition(windowKey, data.x, data.y)}
      disabled={win.isMaximized}
    >
      <div
        className={clsx(
          `absolute bg-white shadow-2xl overflow-hidden rounded-lg flex flex-col border border-gray-300`,
          {
            'hidden': win.isMinimized,
            'flex': !win.isMinimized
          }
        )}
        style={{
          zIndex: win.zIndex,
          // When maximized, use fixed viewport units. Otherwise, use pixels.
          width: win.isMaximized ? '100vw' : '700px',
          height: win.isMaximized ? '100vh' : '450px',
          top: win.isMaximized ? 0 : win.position.y,
          left: win.isMaximized ? 0 : win.position.x,
          transition: 'width 0.2s, height 0.2s, top 0.2s, left 0.2s'
        }}
        onMouseDown={() => focusWindow(windowKey)}
      >
        {/* The actual header with buttons will be provided by the children (e.g., from WindowWrapper or individual components) */}
        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default Window;