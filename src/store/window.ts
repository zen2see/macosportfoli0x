import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { WINDOW_CONFIG, INITIAL_Z_INDEX } from "#constants/index.tsx"
import type { WindowData } from "#constants/index.tsx" 

interface WindowState {
  windows: Record<string, WindowData>;
  nextZIndex: number;
  openWindow: (key: string, data?: any) => void;
  focusWindow: (key: string) => void;
  closeWindow: (key: string) => void;
  minimizeWindow: (key: string) => void;
  maximizeWindow: (key: string) => void;
  updatePosition: (key: string, x: number, y: number) => void;
}

const useWindowStore = create<WindowState>()(
  immer((set, get) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) {
          console.warn(`Window with key "${windowKey}" not found.`);
          return;
        }
        win.isOpen = true;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex++;
        win.data = data ?? win.data;
      }),

    focusWindow: (windowKey) =>
      set((state) => {
        if (state.nextZIndex > INITIAL_Z_INDEX + 1000) {
          const sorted = Object.keys(state.windows).sort((a, b) => 
            state.windows[a].zIndex - state.windows[b].zIndex);
          sorted.forEach((key, i) => { state.windows[key].zIndex = INITIAL_Z_INDEX + i; });
          state.nextZIndex = INITIAL_Z_INDEX + sorted.length;
        }
        state.windows[windowKey].zIndex = state.nextZIndex++;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),

    minimizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (win) win.isMinimized = !win.isMinimized;
      }),

    maximizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (win) {
          win.isMaximized = !win.isMaximized;
          win.zIndex = state.nextZIndex++;
        }
      }),

    updatePosition: (windowKey, x, y) =>
      set((state) => {
        if (state.windows[windowKey]) {
          state.windows[windowKey].position = { x, y };
        }
      })
  }))
);

export default useWindowStore;