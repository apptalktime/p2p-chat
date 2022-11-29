import { Fragment, useRef, useState } from 'react'
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { Listbox, Transition } from '@headlessui/react'
import { classNames } from '@/utils'
import TextareaAutosize from 'react-textarea-autosize';
import { send } from 'process'


const MAX_TEXTAREA_ROWS = 5;

const moods = [
  { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
  { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
  { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
  { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
  { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
  { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
]

interface ChatInputBoxProps {
  initialMsg?: string;
  onMsgChange?: (msg: string) => void;
  onSend?: (msg: string) => void;
}

export function ChatInputBox({ initialMsg, onMsgChange, onSend }: ChatInputBoxProps) {
  const [msg, setMsg] = useState(initialMsg || '');

  const send = (msg: string) => {
    setMsg('');
    onSend && onSend(msg);
  }

  return (
    <div className="w-full bg-gray-100 border-t border-x border-gray-200">
      <form action="#" className="relative">
        <div className="flex justify-between items-center py-2 space-x-2 sm:space-x-4 lg:space-x-8">

          <div />

          <div className="flex items-center">
            <button
              type="button"
              className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
            >
              <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Attach a file</span>
            </button>
          </div>

          <div className="w-full flex items-end overflow-hidden pr-1 rounded-lg bg-gray-300 text-gray-900 border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <TextareaAutosize
              minRows={1}
              maxRows={MAX_TEXTAREA_ROWS}
              maxLength={1000}
              name='message'
              id='message'
              placeholder=''
              className="block w-full resize-none border-0 py-1 focus:ring-0 sm:text-sm bg-transparent"
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
                onMsgChange && onMsgChange(e.target.value);
              }}
              style={{
                lineHeight: '24px',
              }}
            />
            <div className="w-6 flex items-center" style={{
              height: '28px'
            }}>
              <Emojis />
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              type="button"
              className={
                classNames(
                    "inline-flex items-center rounded-full border border-transparent bg-sky-600 px-1 py-1 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    msg.length === 0 && 'opacity-50 cursor-not-allowed'
                )
              }
              disabled={msg.length === 0}
              onClick={() => send(msg)}
            >
              <PaperAirplaneIcon className='text-white w-6 h-6 pl-1' />
            </button>
          </div>

          <div />

        </div>
      </form>
    </div>
  )
}

export function Emojis() {
  const [selected, setSelected] = useState(moods[5]);
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only"> Your mood </Listbox.Label>
          <div className="relative">
            <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
              <span className="flex items-center justify-center">
                {selected.value === null ? (
                  <span>
                    <FaceSmileIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only"> Add your mood </span>
                  </span>
                ) : (
                  <span>
                    <span
                      className={classNames(
                        selected.bgColor,
                        'flex h-6 w-6 items-center justify-center rounded-full'
                      )}
                    >
                      <selected.icon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{selected.name}</span>
                  </span>
                )}
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="fixed right-1 bottom-2 sm:right-auto z-10 text-gray-600 mt-1 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                {moods.map((mood) => (
                  <Listbox.Option
                    key={mood.value}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-gray-100' : 'bg-white',
                        'relative cursor-default select-none py-2 px-3'
                      )
                    }
                    value={mood}
                  >
                    <div className="flex items-center">
                      <div
                        className={classNames(
                          mood.bgColor,
                          'w-8 h-8 rounded-full flex items-center justify-center'
                        )}
                      >
                        <mood.icon
                          className={classNames(mood.iconColor, 'flex-shrink-0 h-5 w-5')}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="ml-3 block truncate font-medium">{mood.name}</span>
                    </div>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}