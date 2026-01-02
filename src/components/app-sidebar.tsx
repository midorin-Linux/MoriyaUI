import {AppWindow, MessageCircle, Plus, ChevronUp } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import {Separator} from "@/components/ui/separator.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="h-12">
                <div className="w-full flex items-center gap-2 px-1.5">
                    <AppWindow size={36} className="flex p-1.5 items-center justify-center my-auto" />
                    <p className="flex text-lg">MoriyaUI</p>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-1.5 mt-2">
                <SidebarGroup className="py-0" />
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="w-full p-1.5 text-black h-auto hover:bg-gray-200">
                                    <a href="#" className="flex items-center justify-center my-auto gap-2">
                                        <Plus className="flex size-6" />
                                        <span className="flex text-base font-normal">新規チャット</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                <Separator />
                    <SidebarGroupLabel className="w-full flex items-center gap-2 p-1.5 text-black h-auto">
                        <MessageCircle />
                        <span className="flex text-base font-normal">Chat History</span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="ml-5 w-auto">
                            <SidebarMenuItem>
                                <p>No content available.</p>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                {/*<SidebarMenu>*/}
                {/*    <SidebarMenuItem>*/}
                {/*        <DropdownMenu>*/}
                {/*            <DropdownMenuTrigger asChild>*/}
                {/*                <SidebarMenuButton>*/}
                {/*                    */}
                {/*                    <ChevronUp className="ml-auto" />*/}
                {/*                </SidebarMenuButton>*/}
                {/*            </DropdownMenuTrigger>*/}
                {/*            <DropdownMenuContent*/}
                {/*                side="top"*/}
                {/*                className="w-auto"*/}
                {/*            >*/}
                {/*                <DropdownMenuItem>*/}
                {/*                    <span>Settings</span>*/}
                {/*                </DropdownMenuItem>*/}
                {/*                <DropdownMenuItem>*/}
                {/*                    <span>About MoriyaUI</span>*/}
                {/*                </DropdownMenuItem>*/}
                {/*                <DropdownMenuItem>*/}
                {/*                    <span>Website</span>*/}
                {/*                </DropdownMenuItem>*/}
                {/*            </DropdownMenuContent>*/}
                {/*        </DropdownMenu>*/}
                {/*    </SidebarMenuItem>*/}
                {/*</SidebarMenu>*/}
            </SidebarFooter>
        </Sidebar>
    )
}