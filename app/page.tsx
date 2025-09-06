"use client"
import EditArea from "@/components/EditArea";
import UploadBox from "@/components/UploadBox";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <main className="flex h-screen items-center justify-center">
      {file === null ? (
        <UploadBox file={file} setFile={setFile} />
      ) : (
        <EditArea file={file} setFile={setFile} />
      )}
    </main>
  );
}
