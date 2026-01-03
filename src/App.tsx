import "./App.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MessageBox } from "@/components/message-box";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type Store = {
    chat_id: string;
    title: string;
    created_at: string;
    updated_at: string;
    messages: Message[];
};

const Header = () => {
    return (
        <div className="flex fixed bg-white w-full h-12 border-b z-10">
            <SidebarTrigger className="ml-2 my-auto size-9" />
            <h2 className="scroll-m-20 text-xl font-semibold tracking-tight ml-5 my-auto">新規チャット</h2>
        </div>
    );
}

const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const navigate = useNavigate();
    const { chatId } = useParams();
    const location = useLocation();
    const processingPrompt = useRef<string | null>(null);

    const handleSendMessage = useCallback(async (prompt: string) => {
        if (!chatId) {
            try {
                const newChat = await invoke<Store>("create_new_chat_conversation");
                navigate(`/chat/${newChat.chat_id}`, { state: { prompt } });
            } catch (error) {
                console.error("Failed to create chat:", error);
            }
            return;
        }

        const userMsg: Message = { role: "user", content: prompt };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const response = await invoke<string>("chat", { chatConversationUuid: chatId, userPrompt: prompt });
            const aiMsg: Message = { role: "assistant", content: response };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error("Rust error:", error);
        }
    }, [chatId, navigate]);

    useEffect(() => {
        if (location.state && typeof location.state === 'object' && 'prompt' in location.state && chatId) {
            const state = location.state as { prompt: string };
            const prompt = state.prompt;
            
            if (processingPrompt.current === prompt) return;
            processingPrompt.current = prompt;

            navigate(location.pathname, { replace: true, state: {} });

            handleSendMessage(prompt);
        }
    }, [location, chatId, navigate, handleSendMessage]);

    return (
        <main className="w-full bg-white relative h-screen flex flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto pt-16 pb-40 px-5 flex flex-col gap-4">
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
    );
};

const ChatRoute = () => {
    const { chatId } = useParams();
    return <ChatInterface key={chatId} />;
};

export default function App() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <Routes>
                <Route path="/" element={<ChatInterface />} />
                <Route path="/chat/:chatId" element={<ChatRoute />} />
            </Routes>
        </SidebarProvider>
    );
}