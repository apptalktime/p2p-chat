import { ChatHeader } from "./ChatHeader";
import { ChatInputBox } from "./ChatInputBox";
import { Messages } from "./Messages";
import { Message } from '@/types'
import Image from "next/image";

interface ChatProps {
    contact: {
        label: string;
        picture: string;
    },
    messages: Message[];
    initialMsg?: string;
    onSend?: (msg: string) => void;
    isLoading?: boolean;
}

export default function Chat({ contact, messages, initialMsg, onSend, isLoading }: ChatProps) {
    return (

        <div className="flex flex-col justify-between h-full overflow-hidden bg-white">
            <ChatHeader label={contact.label} picture={contact.picture} />
            {
                isLoading
                    ? <div className='w-full h-full flex flex-col space-y-8 justify-center items-center'>
                        <Image src="/loading.gif" width={196} height={144} alt="loader" priority={true} />
                        <p className="text-gray-700 animate-pulse">Loading P2P Messages</p>
                    </div>
                    : <Messages messages={messages} />
            }
            <ChatInputBox initialMsg={initialMsg || ''} onSend={(msg) => onSend && onSend(msg)} />
        </div>
    )
}