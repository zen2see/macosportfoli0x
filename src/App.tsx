import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { Navbar, Welcome, Dock } from '#components'
import { Terminal, Safari, Resume } from '#windows'

gsap.registerPlugin(Draggable)

const App = () => {
  return (    
    <>
     <Navbar />
     <Welcome /> {/* Comment out Welcome */}   
     <Dock />
     <Terminal />
     <Safari />
     <Resume />
    </>
  )
}
export default App
