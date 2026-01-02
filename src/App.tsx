// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MessageBox } from "@/components/message-box";

const Header = () => {
    return (
        <div className="flex fixed bg-white w-full h-12 border-b">
            <SidebarTrigger className="ml-2 my-auto size-9" />
            <h2 className="scroll-m-20 text-xl font-semibold tracking-tight ml-5 my-auto">新規チャット</h2>
        </div>
    );
}

export default function App() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full bg-white relative h-screen">
                <Header />
                <div className="absolute px-5 bottom-8 w-full flex justify-center">
                    <MessageBox />
                </div>
                <p className="absolute text-xs text-black bottom-0 right-0 mx-5 my-1">MoriyaUI Ver. 0.0.1-alpha</p>
            </main>
        </SidebarProvider>
    );
}