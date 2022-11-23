import { classNames } from '@/utils'
import { Message } from '@/types'
import TimeAgo from 'timeago-react'
import * as timeago from 'timeago.js';
import pt_BR from 'timeago.js/lib/lang/pt_BR';
import { MsgBalloon } from './MsgBalloon';

timeago.register('pt_BR', pt_BR);

interface MessagesProps {
    messages: Message[];
}

export function Messages({ messages }: MessagesProps) {
    return (
        <div className='h-full overflow-y-auto flex flex-col-reverse mb-4'>
            <ul role="list">
                {messages.map((msg, index) => (
                    <li key={msg.id} className={classNames(
                        'w-full flex',
                        msg.me ? 'justify-end' : 'justify-start',
                        (index === 0 || (messages[index - 1].me && msg.me) || (!messages[index - 1].me && !msg.me)) ? 'mt-1' : 'mt-3'
                    )}>
                        <MsgBalloon isOwn={msg.me} className="text-white rounded px-2 py-1">
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
                    </li>
                ))}
            </ul>
        </div >
    )
}