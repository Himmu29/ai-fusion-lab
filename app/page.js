"use client";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Image from "next/image";
import ChatInputBoxWrapper from "./_components/ChatInputBoxWrapper";

export default function Home() {
  const {setTheme} = useTheme();
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatInputBoxWrapper/>
      </Suspense>
    </div>
  );
}
