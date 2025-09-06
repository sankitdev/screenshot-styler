import Image from "next/image";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import Header from "./Header";
import gradients from "@/data/gradient";
import { toPng } from "html-to-image";

interface EditAreaProps {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function EditArea({ file, setFile }: EditAreaProps) {
  const [selectedGradient, setSelectedGradient] = useState(
    gradients[Math.floor(Math.random() * gradients.length)]
  );
  const [imageScale, setImageScale] = useState(1); // 1 = 100%
  const [bgScale, setBgScale] = useState(1.1); // 1 = 100%
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (containerRef.current) {
      const dataUrl = await toPng(containerRef.current);
      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = dataUrl;
      link.click();
    }
  };
  return (
    <>
      <Header />
      <div className="flex justify-between size-4/5">
        {/* Main image area */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center min-h-[400px] bg-transparent"
        >
          <div
            className="relative rounded-lg overflow-hidden shadow-lg flex items-center justify-center"
            style={{
              width: 500,
              height: 350,
            }}
          >
            {/* Gradient background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: selectedGradient,
                transform: `scale(${bgScale})`,
                transformOrigin: "center",
                transition: "transform 0.2s",
              }}
            />

            {/* Image */}
            <div
              style={{
                position: "relative",
                transform: `scale(${imageScale})`,
                transition: "transform 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Uploaded"
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with controls */}
        <aside className="w-64 p-4 border-2 flex flex-col items-center gap-4">
          <Button onClick={() => setFile(null)} className="w-full">
            Back to upload
          </Button>
          <Button onClick={handleDownload} className="w-full">
            Download
          </Button>
          {/* Gradient selector */}
          <div className="w-full">
            <h3 className="mb-2 font-bold text-sm">Gradients</h3>
            <div className="flex flex-wrap gap-2">
              {gradients.map((g, i) => (
                <Button
                  key={i}
                  className="w-10 h-10 rounded border-2"
                  style={{
                    background: g,
                    borderColor:
                      selectedGradient === g ? "#333" : "transparent",
                  }}
                  onClick={() => setSelectedGradient(g)}
                />
              ))}
            </div>
          </div>

          {/* Image scale */}
          <div className="w-full">
            <label className="block text-xs mb-1">Image Size</label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.01}
              value={imageScale}
              onChange={(e) => setImageScale(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Background scale */}
          <div className="w-full">
            <label className="block text-xs mb-1">Background Size</label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.01}
              value={bgScale}
              onChange={(e) => setBgScale(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </aside>
      </div>
    </>
  );
}
