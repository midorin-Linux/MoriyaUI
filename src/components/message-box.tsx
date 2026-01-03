import { useEffect, useRef } from "react";
import { Send, Settings2, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputGroupButton } from "@/components/ui/input-group"
import {Switch} from "@/components/ui/switch";

const formSchema = z.object({
    userPrompt: z.string().min(1, {
        message: "Message must be at least 1 characters.",
    }),
})

interface MessageBoxProps {
    onSendMessage: (message: string) => void;
}

export function MessageBox({ onSendMessage }: MessageBoxProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userPrompt: "",
        },
    })

    const promptValue = form.watch("userPrompt");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [promptValue]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        onSendMessage(values.userPrompt);
        form.reset();
    }

    return (
        <div className="rounded-xl border p-2 text-sm w-full shadow-lg bg-white hover:border-gray-300">
            <Form {...form}>
                <form className="flex flex-col gap-1 justify-between" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="userPrompt" render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Ask Anything..."
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && e.shiftKey) {
                                            e.preventDefault();
                                            form.handleSubmit(onSubmit)();
                                        }
                                    }}
                                    ref={(e) => {
                                        field.ref(e);
                                        textareaRef.current = e;
                                    }}
                                    className="border-none shadow-none focus-visible:ring-0 pb-0 resize-none min-h-10 max-h-50 overflow-y-auto"
                                />
                            </FormControl>
                            <FormMessage className="px-3" />
                        </FormItem>
                    )} />
                    <div className="flex justify-between">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <InputGroupButton variant="outline" size="sm" className="flex size-9 p-0"><Settings2 /></InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="[--radius:0.95rem] p-1.5 gap-1 flex flex-col items-start"
                            >
                                <DropdownMenuItem className="flex w-60 items-center justify-between p-1.5 focus:bg-white" onSelect={(e) => e.preventDefault()}>
                                    <div className="flex items-center gap-2">
                                        <Search className="size-5" />
                                        <div className="flex flex-col">
                                            <span className="text-base">Search</span>
                                            <span className="text-xs text-gray-600">Disable to don't search</span>
                                        </div>
                                    </div>
                                    <Switch />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <InputGroupButton variant="outline" className="h-9 w-auto hover:bg-gray-200">Auto</InputGroupButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    align="end"
                                    className="[--radius:0.95rem] p-1.5 gap-1 flex flex-col items-start"
                                >
                                    <DropdownMenuItem className="focus:bg-gray-200 p-1.5 gap-1 flex flex-col items-start w-60">
                                        <span className="font-base">Auto</span>
                                        <span className="text-gray-600 font-sm">Automatically select model</span>
                                    </DropdownMenuItem>
                                    <Separator />
                                    <DropdownMenuItem className="focus:bg-gray-200 p-1.5 gap-1 flex flex-col items-start w-60">
                                        <span className="font-base">V2</span>
                                        <span className="text-gray-600 font-sm">Flagship model</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-gray-200 p-1.5 gap-1 flex flex-col items-start w-60">
                                        <span className="font-base">V2-Flash</span>
                                        <span className="text-gray-600 font-sm">Highly cost-effective model</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-gray-200 p-1.5 gap-1 flex flex-col items-start w-60">
                                        <span className="font-base">V1.5</span>
                                        <span className="text-gray-600 font-sm">Excellent knowledge model</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Separator orientation="vertical" className="mx-3" />
                            <Button className="size-9" type="submit"><Send /></Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}