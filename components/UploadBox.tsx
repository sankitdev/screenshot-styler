"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Progress } from "@/components/ui/progress" 
import Image from "next/image"


interface UploadBoxProps {
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
}

export default function UploadBox({file, setFile}: UploadBoxProps) {
  const [progress, setProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
     useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData) {
        const items = e.clipboardData.items;
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const pastedFile = item.getAsFile();
            if (pastedFile) {
              setFile(pastedFile);
            }
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [setFile]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0]
      setFile(selected)
      setProgress(0)
      setIsUploading(true)

      // Fake upload progress (2s)
      let p = 0
      const interval = setInterval(() => {
        p += 10
        setProgress(p)
        if (p >= 30) {
          clearInterval(interval)
          setIsUploading(false)
        }
      }, 50)
    }
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
  } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
    maxSize: 1 * 1024 * 1024, // 5MB
    onDrop,
  })

  return (
    <section className="w-[400px] mx-auto">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="relative">
            <Image
              src={URL.createObjectURL(file)}
              alt="preview"
              width={300}
              height={200}
              className="mx-auto rounded-lg object-contain"
            />
          </div>
        ) : (
          <p>
            {isDragActive
              ? "Drop it here..."
              : "Drag & drop a screenshot, or click to upload"}
            <br />
            <em>(Only JPEG/PNG, max 1MB)</em>
          </p>
        )}
      </div>

      {isUploading && (
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-1">Uploading… {progress}%</p>
        </div>
      )}

      {fileRejections.length > 0 && (
        <ul className="mt-2 text-red-500 text-sm">
          {fileRejections.map(({ file, errors }) => (
            <li key={file.name}>
              {file.name}
              <ul>
                {errors.map((e) => (
                  <li key={e.code}>{e.message}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
