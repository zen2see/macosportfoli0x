import React from "react";
import useWindowStore from "#store/window";
import { Terminal, Safari, Resume, Finder, Text, Image } from "#windows";

const windowComponents: { [key: string]: React.FC<{ id: string }> } = {
  terminal: Terminal,
  safari: Safari,
  resume: Resume,
  finder: Finder,
  text: Text,
  image: Image,
};

const WindowManager: React.FC = () => {
  const windows = useWindowStore((state) => state.windows);

  return (
    <>
      {Object.entries(windows).map(([id, windowData]) => {
        // console.log("WindowManager: Processing window", id, windowData);
        if (windowData.isOpen) {
          const WindowComponent = windowComponents[id];
          if (WindowComponent) {
            return <WindowComponent key={id} id={id} />;
          }
        }
        return null;
      })}
    </>
  );
};

export default WindowManager;
