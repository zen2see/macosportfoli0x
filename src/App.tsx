import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { Navbar, Welcome, Dock, WindowManager } from '#components'

gsap.registerPlugin(Draggable)

const App = () => {
  return (    
    <>
     <Navbar />
     <Welcome /> {/* Comment out Welcome */}   
     <Dock />
     <WindowManager />
    </>
  )
}
export default App
