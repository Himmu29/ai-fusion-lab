"use client"
import { useSearchParams } from "next/navigation";
import ChatInputBox from "./ChatInputBox";

export default function ChatInputBoxWrapper() {
  const params = useSearchParams();
  
  return <ChatInputBox params={params} />;
}
