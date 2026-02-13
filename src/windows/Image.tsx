import WindowWrapper from "#hoc/WindowWrapper.tsx"
import WindowControls from "#components/WindowControls.tsx" // Import WindowControls
import useWindowStore from "#store/window.ts"
    
const Image = () => { // Renamed from ImageWindowContent
    const { windows } = useWindowStore()
    const data = windows.image?.data
    if (!data) return null
    const { name, imageUrl } = data
    
    return (
        <>
          <div id="window-header">
            <WindowControls target="image" />
            <h2>{name}</h2>
          </div>
          <div className="p-5 bg-white">
            {imageUrl ? (
                <div className="w-full">
                    <img 
                      src={imageUrl}
                      alt={name} 
                      className="w-full h-auto max-h-[70h] object-contain rounded"
                    />
                </div>
                ) : null
            }
          </div>   
        </>
    )
}

const ImageWindow = WindowWrapper(Image, "image") // Use renamed component
export default ImageWindow