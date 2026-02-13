import React, { useEffect, useState } from "react";
import WindowWrapper from "#hoc/WindowWrapper.tsx";
import WindowControls from "#components/WindowControls"; // Import WindowControls
import useWindowStore from "#store/window.ts"; // Corrected import
    
const Text = () => { // Renamed from TextWindowContent
  const windows = useWindowStore((state) => state.windows); // Corrected usage
  const data = windows.text?.data; // Added optional chaining for safety
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data?.filePath) {
      fetch(data.filePath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((content) => {
          setFileContent(content);
          setError(null);
        })
        .catch((e) => {
          console.error("Error fetching text file:", e);
          setError("Failed to load text file.");
          setFileContent(null);
        });
    } else {
      setFileContent(null);
      setError(null);
    }
  }, [data?.filePath]);

  if (!data) {
    console.log("Text.tsx: data is undefined for text window");
    return null;
  }
    
  return (
    <>
      <div id="window-header">
        <WindowControls target="text" />
        <h2>{data.name}</h2>
      </div>
      <div className="flex flex-col w-full h-full bg-white rounded-b-lg p-4 overflow-auto">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        {data.subtitle && <h2 className="text-lg text-gray-500">{data.subtitle}</h2>}
        {data.image && <img src={data.image} alt={data.name} className="w-32 h-32 my-4" />}
        {error && <p className="text-red-500">{error}</p>}
        {fileContent ? (
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {fileContent}
          </pre>
        ) : (
          data.description?.map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-800 my-2">
              {paragraph}
            </p>
          ))
        )}
      </div>
    </>
  );
};
    
export default WindowWrapper(Text, "text");
