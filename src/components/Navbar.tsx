import { navLinks, navIcons } from "#constants/index.tsx"
import dayjs from "dayjs"
import useWindowStore from "#store/window.ts"

const Navbar = () => {
  const { openWindow } = useWindowStore()
  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="Logo" className="h-8 w-8" />
        <p className="font-bold">{"ZMorris's portfolio"}</p>
        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => openWindow(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id} onClick={() => openWindow(type)}>
              <img src={img} className="icon-hover" alt={`icon-${id}`} />
              <p>{name}</p>
            </li>
          ))}
        </ul>
        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  )
}
export default Navbar
   