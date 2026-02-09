import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { persist } from "zustand/middleware"
import { WINDOW_CONFIG, INITIAL_Z_INDEX } from "#constants/index.tsx"
import type { WindowData } from "#constants/index.tsx" 

/*  By passing the Interface to Zustand, the entire app becomes type-safe.
    If you misspell isMinimized as isMinimzed, TypeScript will catch it immediately. */
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
  persist(
    immer((set, get) => ({
      windows: WINDOW_CONFIG,
      nextZIndex: INITIAL_Z_INDEX + 1,

      openWindow: (windowKey, data = null) =>
        set((state) => {
          const win = state.windows[windowKey];
          if (!win) return;
          /* if (win.isOpen) { // Optimization: Just focus if already open
            state.focusWindow(windowKey); 
            return;
          } */
          win.isOpen = true;
          win.isMinimized = false; // Ensure it's not hidden
          win.zIndex = state.nextZIndex++; // Focus logic moved here directly
          win.data = data ?? win.data;
        }),

      focusWindow: (windowKey) =>
        set((state) => {
          // Reset logic: if zIndex gets too high, normalize the whole stack
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
            // When maximizing, also bring to front
            win.zIndex = state.nextZIndex++;
          }
        }),

      updatePosition: (windowKey, x, y) =>
        set((state) => {
          if (state.windows[windowKey]) {
            state.windows[windowKey].position = { x, y };
          }
        })
    })),
    { name: "window-storage" } // Key for localStorage
  )
);

export default useWindowStore;

// This Zustand store uses Immer for mutations and Persist to save window positions to localStorage.
// import { create } from "zustand"
// import { immer } from "zustand/middleware/immer"
// import { persist } from "zustand/middleware"
// import { WINDOW_CONFIG, INITIAL_Z_INDEX, WindowData } from "#constants/index.tsx"

// interface WindowState {
//   windows: Record<string, WindowData>;
//   nextZIndex: number;
//   openWindow: (key: string) => void;
//   closeWindow: (key: string) => void;
//   focusWindow: (key: string) => void;
//   minimizeWindow: (key: string) => void;
//   maximizeWindow: (key: string) => void;
//   updatePosition: (key: string, x: number, y: number) => void;
// }

// const useWindowStore = create<WindowState>()(
//   persist(
//     immer((set) => ({
//       windows: WINDOW_CONFIG,
//       nextZIndex: INITIAL_Z_INDEX + 1,

//       openWindow: (key) => set((state) => {
//         const win = state.windows[key];
//         if (win) {
//           win.isOpen = true;
//           win.isMinimized = false;
//           win.zIndex = state.nextZIndex++;
//         }
//       }),

//       focusWindow: (key) => set((state) => {
//         state.windows[key].zIndex = state.nextZIndex++;
//       }),

//       closeWindow: (key) => set((state) => {
//         state.windows[key].isOpen = false;
//         state.windows[key].isMaximized = false;
//       }),

//       minimizeWindow: (key) => set((state) => {
//         state.windows[key].isMinimized = !state.windows[key].isMinimized;
//       }),

//       maximizeWindow: (key) => set((state) => {
//         state.windows[key].isMaximized = !state.windows[key].isMaximized;
//         state.windows[key].zIndex = state.nextZIndex++;
//       }),

//       updatePosition: (key, x, y) => set((state) => {
//         state.windows[key].position = { x, y };
//       }),
//     })),
//     { name: "mac-portfolio-storage" }
//   )
// );

// export default useWindowStore;
