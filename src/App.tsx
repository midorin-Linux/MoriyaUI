import "./App.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MessageBox } from "@/components/message-box";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const Header = () => {
    return (
        <div className="flex fixed bg-white w-full h-12 border-b z-10">
            <SidebarTrigger className="ml-2 my-auto size-9" />
            <h2 className="scroll-m-20 text-xl font-semibold tracking-tight ml-5 my-auto">新規チャット</h2>
        </div>
    );
}

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSendMessage = async (prompt: string) => {
        const userMsg: Message = { role: "user", content: prompt };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const response = await invoke<string>("chat", { userPrompt: prompt });
            const aiMsg: Message = { role: "assistant", content: response };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error("Rust error:", error);
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full bg-white relative h-screen flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-auto pt-16 pb-32 px-5 flex flex-col gap-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap ${msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-100 text-gray-800 self-start"}`}>
                            {msg.content}
                        </div>
                    ))}
                </div>
                <div className="absolute px-5 bottom-8 w-full flex justify-center">
                    <MessageBox onSendMessage={handleSendMessage} />
                </div>
                <p className="absolute text-xs text-black bottom-0 right-0 mx-5 my-1">MoriyaUI Ver. 0.0.1-alpha</p>
            </main>
        </SidebarProvider>
    );
}