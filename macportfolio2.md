# 1. Project Initialization
`pnpm create vite@latest ./ --template react-ts`
`pnpm install`
`pnpm install tailwindcss @tailwindcss/vite gsap @gsap/react dayjs lucide-react`
`pnpm install zustand immer react-draggable`

# 2. Advanced Vite Configuration
`vite.config.ts`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '#components': resolve(fileURLToPath(new URL('./src/components', import.meta.url))),
      '#constants': resolve(fileURLToPath(new URL('./src/constants', import.meta.url))),
      '#store': resolve(fileURLToPath(new URL('./src/store', import.meta.url))),
      '#windows': resolve(fileURLToPath(new URL('./src/windows', import.meta.url))),
    },
  },

```
# 3. Global Types & Constants
`src/constants/index.tsx`
```javascript
export interface WindowData {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  data: any;
  title: string;
  icon: string;
}

export const INITIAL_Z_INDEX = 10;

export const dockApps = [
  { id: "finder", name: "Portfolio", icon: "finder.png", canOpen: true },
  { id: "safari", name: "Articles", icon: "safari.png", canOpen: true },
  { id: "terminal", name: "Skills", icon: "/icons/terminal.png", canOpen: true },
  { id: "contact", name: "Contact", icon: "/icons/contact.png", canOpen: true },
];

export const WORK_LOCATION = {
  id: 1,
  name: "Work",
  children: [
    { id: 5, name: "Nike Ecommerce", icon: "/images/folder.png", kind: "folder" },
    { id: 6, name: "AI Resume Analyzer", icon: "/images/folder.png", kind: "folder" },
  ],
};

export const WINDOW_CONFIG: Record<string, WindowData> = dockApps.reduce((acc, app) => {
  if (app.canOpen) {
    acc[app.id] = {
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: INITIAL_Z_INDEX,
      position: { x: 100, y: 100 },
      data: app.id === "finder" ? WORK_LOCATION : null,
      title: app.name,
      icon: app.icon,
    };
  }
  return acc;
}, {} as Record<string, WindowData>);
```

# 4. The Window Store (Zustand + Immer + Persist)
```javascript
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { persist } from "zustand/middleware"
import { WINDOW_CONFIG, INITIAL_Z_INDEX, WindowData } from "#constants/index.tsx"

interface WindowState {
  windows: Record<string, WindowData>;
  nextZIndex: number;
  openWindow: (key: string) => void;
  closeWindow: (key: string) => void;
  focusWindow: (key: string) => void;
  minimizeWindow: (key: string) => void;
  maximizeWindow: (key: string) => void;
  updatePosition: (key: string, x: number, y: number) => void;
}

const useWindowStore = create<WindowState>()(
  persist(
    immer((set) => ({
      windows: WINDOW_CONFIG,
      nextZIndex: INITIAL_Z_INDEX + 1,

      openWindow: (key) => set((state) => {
        const win = state.windows[key];
        if (win) {
          win.isOpen = true;
          win.isMinimized = false;
          win.zIndex = state.nextZIndex++;
        }
      }),

      focusWindow: (key) => set((state) => {
        state.windows[key].zIndex = state.nextZIndex++;
      }),

      closeWindow: (key) => set((state) => {
        state.windows[key].isOpen = false;
        state.windows[key].isMaximized = false;
      }),

      minimizeWindow: (key) => set((state) => {
        state.windows[key].isMinimized = !state.windows[key].isMinimized;
      }),

      maximizeWindow: (key) => set((state) => {
        state.windows[key].isMaximized = !state.windows[key].isMaximized;
        state.windows[key].zIndex = state.nextZIndex++;
      }),

      updatePosition: (key, x, y) => set((state) => {
        state.windows[key].position = { x, y };
      }),
    })),
    { name: "mac-portfolio-storage" }
  )
);

export default useWindowStore;
```

# 5. The Window UI Component
`src/components/Window.tsx`
```javascript
import Draggable from 'react-draggable';
import useWindowStore from '#store/window';

export const Window = ({ windowKey }: { windowKey: string }) => {
  const win = useWindowStore((s) => s.windows[windowKey]);
  const actions = useWindowStore();

  if (!win?.isOpen || win.isMinimized) return null;

  return (
    <Draggable
      handle=".win-header"
      position={win.isMaximized ? { x: 0, y: 0 } : win.position}
      onStop={(e, data) => actions.updatePosition(windowKey, data.x, data.y)}
      disabled={win.isMaximized}
    >
      <div 
        className="absolute bg-white shadow-xl rounded-lg overflow-hidden flex flex-col"
        style={{ 
          zIndex: win.zIndex,
          width: win.isMaximized ? '100vw' : '650px',
          height: win.isMaximized ? '100vh' : '400px' 
        }}
        onMouseDown={() => actions.focusWindow(windowKey)}
      >
        <div className="win-header bg-gray-200 p-3 flex justify-between cursor-grab active:cursor-grabbing">
          <div className="flex gap-2">
            <button onClick={() => actions.closeWindow(windowKey)} className="w-3 h-3 bg-red-500 rounded-full" />
            <button onClick={() => actions.minimizeWindow(windowKey)} className="w-3 h-3 bg-yellow-500 rounded-full" />
            <button onClick={() => actions.maximizeWindow(windowKey)} className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <span className="text-xs font-bold text-gray-600 uppercase">{win.title}</span>
          <div className="w-10" />
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {windowKey === 'finder' && win.data?.children?.map((child: any) => (
            <div key={child.id} className="p-2 hover:bg-blue-50 rounded">📁 {child.name}</div>
          ))}
        </div>
      </div>
    </Draggable>
  );
};
```

# 6. Main Application Loop
`src/App.tsx`
```javascript
import { Navbar, Welcome, Dock } from '#components';
import { Window } from '#components/Window';
import { useWindowStore } from '#store/window';

const App = () => {
  const windows = useWindowStore((s) => s.windows);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-900">
      <Navbar />
      <Welcome /> 
      {Object.keys(windows).map((key) => (
        <Window key={key} windowKey={key} />
      ))}
      <Dock />
    </main>
  );
};
```

