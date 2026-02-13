import WindowControls from "#components/WindowControls"
import { Search } from "lucide-react"
import WindowWrapper from "#hoc/WindowWrapper.tsx"
import { locations } from "#constants/index.tsx"
import useLocationStore from "#store/location.ts"
import clsx from "clsx"
import useWindowStore from "#store/window.ts"

const Finder = () => {
  const { openWindow } = useWindowStore()
  const { activeLocation, setActiveLocation } = useLocationStore()
  const openItem = (item) => {
    console.log("Finder.tsx: Initial item.fileType =", item.fileType); // New log
    console.log("Finder.tsx: openItem called with item =", item);
    if(item.fileType === 'pdf') {
      console.log("Finder.tsx: Opening PDF, calling openWindow('resume')");
      return openWindow("resume");
    }
    if(item.fileType === 'txt') {
      const textData = { name: item.name, subtitle: item.subtitle, image: item.image, description: item.description, filePath: item.filePath };
      console.log("Finder.tsx: Opening TXT, calling openWindow('text',", textData, ")");
      return openWindow("text", textData);
    }
    if (item.fileType === "img") {
      console.log(
        "Finder.tsx: Opening IMG, calling openWindow('image',",
        item,
        ")"
      );
      return openWindow("image", item);
    }
    if (item.kind === "folder") {
      console.log("Finder.tsx: Opening folder, calling setActiveLocation(", item, ")");
      return setActiveLocation(item);
    }
    if (['fig', 'url'].includes(item.fileType) && item.href) {
      console.log("Finder.tsx: Opening fig/url, calling window.open(", item.href, ")");
      return window.open(item.href, "_blank");
    }
    console.log("Finder.tsx: Opening generic window, calling openWindow(", `${item.fileType}${item.kind}`, ",", item, ")");
    openWindow(`${item.fileType}${item.kind}`, item);
  }
  const renderList = (name, items) => (
    <div>
      <h3>{name}</h3>
      <ul>
        {items.map((item) => (
          <li 
            key={item.id} 
            onClick={() => setActiveLocation(item)} 
            className={clsx(item.id === activeLocation?.id ? "active" : "not-active")}
          > 
            <img src={item.icon} className="w-4" alt={item.name} />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" />
        <Search className="icon" />
      </div>
      <div className="bg-white flex h-full">
        <div className="sidebar">
          <ul>{renderList('Favorites', Object.values(locations))}</ul>
          <ul>{renderList('Work', locations.work.children)}</ul>
        </div>
        <ul className="content">
          {activeLocation?.children.map((item) => {
            console.log("Finder map item:", item);
            return (
            <li 
              key={item.id} 
              className={item.position} 
              onClick={() => openItem(item)}
            >
              <img src={item.icon} alt={item.name} />
              <p>{item.name}</p>
            </li>
            );
          })}
        </ul>
      </div>
    </>
  )
}
const FinderWindow = WindowWrapper(Finder, "finder")
export default FinderWindow