import { Fragment, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { classNames } from '@/utils';
import { HeroIconType } from '@/types';
import Link from 'next/link';

interface Option {
    name: string;
    description: string;
    icon: HeroIconType;
    onSelect?: () => void;
}

interface PopoverListButtonProps {
    children: React.ReactNode;
    options: Option[];
    align?: 'left' | 'right';
    onOpen?: () => void;
    onClose?: () => void;
}

export default function MessageOptions({ children, options, align, onOpen, onClose }: PopoverListButtonProps) {

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        isOpen ? (onOpen && onOpen()) : (onClose && onClose())
    }, [isOpen])

    return (
        <Popover className="relative" as="nav">
            {({ open, close }) => (
                <>

                {
                    setIsOpen(open)
                }

                    <Popover.Overlay
                        className="fixed inset-0 bg-black opacity-60"
                    />

                    <Popover.Button
                        className={classNames(
                            open ? 'text-gray-900' : 'text-gray-500',
                            'group flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none'
                        )}
                    >
                        {
                            children
                        }
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className={classNames(
                            align === 'left' ? 'left-1' : 'right-1',
                            "absolute z-10 mt-1 w-64 sm:px-0")}>
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="relative divide-y divide-gray-200 bg-white sm:gap-8">
                                    {options.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                item.onSelect && item.onSelect();
                                                close();
                                            }}
                                            className="flex items-start px-3 py-2 transition duration-150 ease-in-out hover:bg-gray-200 cursor-pointer"
                                        >
                                            <item.icon className="h-6 w-6 flex-shrink-0 text-gray-600" aria-hidden="true" />
                                            <div className="ml-4">
                                                <p className="text-base font-medium text-gray-700">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}