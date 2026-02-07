import useWindowStore from '#store/window.ts'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from '@gsap/react'

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, zIndex } = windows[windowKey] || { isOpen: false, zIndex: 0 };
    const ref = useRef(null);
    // useGSAP(() => {
    //   const el = ref.current
    //   if (!el || !isOpen) return;
    //   el.style.display = "block";
    //   gsap.fromTo(el, { scale: 0.8, opacity: 0, y: 40 }, 
    //   { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
    // }, [isOpen]);
   
    // useLayoutEffect(() => {
    //   const el = ref.current
    //   if (!el) return;
    //   el.style.display = isOpen ? "block" : "none";
    // }, [isOpen]);

    return (
      <section id={windowKey} ref={ref} style={{ zIndex }} className="absolute" >
        <Component {...props} />
      </section>  
    )
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName ||
    Component.name || "Component"})`

  return Wrapped;
};
 
export default WindowWrapper