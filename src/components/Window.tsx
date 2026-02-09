import Draggable from 'react-draggable';
import useWindowStore from '../store/window';

const Window = ({ windowKey }: { windowKey: string }) => {
  const win = useWindowStore((state) => state.windows[windowKey]);
  const { focusWindow, minimizeWindow, maximizeWindow, closeWindow, updatePosition } = useWindowStore();

  // If the window isn't open at all, don't render it.
  // BUT: We removed "win.isMinimized" from here so we can handle it with CSS.
  if (!win?.isOpen || win.isMinimized) return null;

  const renderFinderContent = () => {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {win.data?.children?.map((item: any) => (
          <div 
            key={item.id} 
            className="flex flex-col items-center cursor-pointer hover:bg-blue-100 p-2 rounded"
            onDoubleClick={() => console.log("Open folder/file:", item.name)}
          >
            <img src={item.icon} alt={item.name} className="w-12 h-12" />
            <span className="text-xs text-center mt-1 break-words">{item.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Draggable
      handle=".window-header"
      // Force position to 0,0 when maximized
      position={win.isMaximized ? { x: 0, y: 0 } : win.position}
      onStop={(e, data) => updatePosition(windowKey, data.x, data.y)}
      disabled={win.isMaximized}
    >
      <div 
        className={`absolute bg-white shadow-2xl overflow-hidden rounded-lg flex flex-col border border-gray-300 ${
          win.isMinimized ? 'hidden' : 'flex'
        }`}
        style={{ 
          zIndex: win.zIndex,
          // When maximized, use fixed viewport units. Otherwise, use pixels.
          width: win.isMaximized ? '100vw' : '700px',
          height: win.isMaximized ? '100vh' : '450px',
          // Ensure it snaps to top-left when maximized
          top: win.isMaximized ? 0 : undefined,
          left: win.isMaximized ? 0 : undefined,
          transition: 'width 0.2s, height 0.2s, top 0.2s, left 0.2s'
        }} 
        onMouseDown={() => focusWindow(windowKey)}
      >
        {/* MacOS Style Header */}
        <div className="window-header bg-gray-100 p-3 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-gray-200">
          <div className="flex gap-2">
            {/* Close */}
            <button onClick={(e) => { e.stopPropagation(); closeWindow(windowKey); }} className="w-3 h-3 bg-red-500 rounded-full hover:brightness-75" />
            {/* Minimize */}
            <button onClick={(e) => { e.stopPropagation(); minimizeWindow(windowKey); }} className="w-3 h-3 bg-yellow-500 rounded-full hover:brightness-75" />
            {/* Maximize */}
            <button onClick={(e) => { e.stopPropagation(); maximizeWindow(windowKey); }} className="w-3 h-3 bg-green-500 rounded-full hover:brightness-75" />
          </div>
          <span className="text-sm font-semibold text-gray-600 select-none">{win.title}</span>
          <div className="w-12" /> 
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-white">
            {windowKey === 'finder' ? renderFinderContent() : (
                <div className="p-10 text-center text-gray-500 italic">
                    {win.title} content loading...
                </div>
            )}
        </div>
      </div>
    </Draggable>
  );
};

export default Window;
