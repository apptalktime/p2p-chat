import { classNames } from '@/utils'
import { Message } from '@/types'
import TimeAgo from 'timeago-react'
import * as timeago from 'timeago.js';
import pt_BR from 'timeago.js/lib/lang/pt_BR';
import { MsgBalloon } from './MsgBalloon';
import MessageOptions from './MessageOptions';
import { ClipboardIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

timeago.register('pt_BR', pt_BR);

interface MessagesProps {
    messages: Message[];
}

export function Messages({ messages }: MessagesProps) {

    const [selectedMsg, setSelectedMsg] = useState<number | null>(null);

    const createOptions = (msg: Message) => {
        const options = [];
        options.push({
            name: 'Copy',
            description: 'Copy the message to clipboard',
            icon: ClipboardIcon,
            onSelect: () => {
                navigator.clipboard.writeText(msg.message);
                setSelectedMsg(null);
            }
        });
        if (msg.remove && typeof msg.remove === 'function') {
            options.push({
                name: 'Delete',
                description: "Delete message from this chat",
                icon: TrashIcon,
                onSelect: () => {
                    msg.remove && msg.remove();
                    setSelectedMsg(null);
                }
            });
        }
        return options;
    }

    return (
        <div className={classNames(
            selectedMsg === null ? 'overflow-y-auto' : 'overflow-y-hidden',
            'h-full overflow-x-hidden flex flex-col-reverse mb-4'
        )}
        >
            <ul role="list">
                {messages.map((msg, index) => (
                    <li key={msg.id} className={classNames(
                        'w-full flex px-2',
                        msg.me ? 'justify-end' : 'justify-start',
                        (index === 0 || (messages[index - 1].me && msg.me) || (!messages[index - 1].me && !msg.me)) ? 'mt-1' : 'mt-3',
                        (selectedMsg !== null && selectedMsg !== index) ? 'blur-md' : '',
                    )}
                    >
                        <MessageOptions
                            options={createOptions(msg)}
                            align={msg.me ? 'right' : 'left'}
                            onOpen={() => setSelectedMsg(index)}
                            onClose={() => setSelectedMsg(null)}
                        >
                            <MsgBalloon
                                isOwn={msg.me}
                                className={"text-white rounded px-2 py-1"}>
                                {msg.type === 'message' ? (
                                    <div className="text-sm text-gray-50">
                                        <div>{msg.message}</div>
                                        <div className="text-xs text-gray-300 text-right">
                                            {
                                                msg.timestamp !== null
                                                    ? <TimeAgo
                                                        datetime={msg.timestamp}
                                                        locale='en_US'
                                                    />
                                                    : 'Unknown Time'
                                            }
                                        </div>
                                    </div>
                                ) : null}
                            </MsgBalloon>
                        </MessageOptions>
                        {/* {
                            index === 0 && (
                                <div className="fixed -mt-2 -mr-2">
                                    <div className='w-64 h-64 bg-red-500'>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {msg.type === 'message' ? 'Message' : 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            )
                        } */}
                    </li>
                ))}
            </ul>
        </div >
    )
}