import { TagIcon } from "@heroicons/react/20/solid";

interface ChatHeaderProps {
    picture: string;
    label: string;
}

export function ChatHeader({ picture, label }: ChatHeaderProps) {
    return (<div className='w-full text-center bg-gray-800 p-2 text-white mb-2 px-4 flex justify-between items-center sticky top-0 z-20'>
        <div className="relative w-10">
            <img
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-2 ring-white"
                src={picture}
                alt=""
            />
        </div>
        <p className="truncate w-64 sm:w-96">{label}</p>
        <div />
    </div>)
}