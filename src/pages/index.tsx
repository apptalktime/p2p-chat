import { useIdentity } from "@/providers/Identity";
import { ArrowRightOnRectangleIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import makeBlockie from "ethereum-blockies-base64";
import Router from "next/router";
import { useForm } from "react-hook-form";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from "react";

export default function Home() {
    const { identity, signout } = useIdentity();
    const [copied, setCopied] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async ({ destination }: any) => {
        await Router.push(`/chat/${destination}`);
    }

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <main className="w-full flex flex-col items-center justify-center px-4 text-center max-w-2xl">
                <div className="w-96 max-w-full flex flex-col items-center justify-center space-y-1 space-x-2">
                    <img src={makeBlockie(identity?.id as string)} className="w-12 h-12 rounded-full" />
                    <p className="text-sm font-medium">
                        {identity?.id}
                    </p>
                    <div className="w-full flex justify-center space-x-8">
                        <CopyToClipboard
                            text={identity?.id as string}
                            onCopy={() => setCopied(true)}
                        >
                            <div className="flex space-x-1 w-20 text-sm font-semibold text-sky-500 hover:text-sky-700 cursor-pointer">
                                {
                                    copied ? (
                                        <>
                                            <ClipboardDocumentCheckIcon className="w-5 h-5" />
                                            <span>Copied!</span>
                                        </>

                                    ) : (
                                        <>
                                            <ClipboardDocumentIcon className="w-5 h-5" />
                                            <span>Copy</span>
                                        </>
                                    )
                                }
                            </div>
                        </CopyToClipboard>
                        <button
                            onClick={() => signout()}
                            className="flex space-x-1 text-sm font-semibold text-red-500 hover:text-red-700"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            <span>SignOut</span>
                        </button>
                    </div>
                </div>
                <form className="mt-8 space-y-4 w-96 max-w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="destination" className="sr-only">
                            Destination Key
                        </label>
                        <input
                            id="destination"
                            type="text"
                            autoComplete="destination"
                            required
                            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            placeholder="Destination Key"
                            {...register("destination", {
                                required: true,
                                minLength: 42,
                                maxLength: 42,
                                pattern: /^0x[a-fA-F0-9]{40}$/,
                                validate: (value) => value !== identity?.id
                            })}
                        />
                        <div className='ml-1'>
                            {
                                errors.destination
                                    ? errors.destination.type === "required"
                                        ? <span className='text-xs'>This is required</span>
                                        : errors.destination.type === 'validate'
                                            ? <span className='text-xs'>You cannot send message to yourself</span>
                                            : <span className='text-xs'>Invalid destination address</span>
                                    : null
                            }
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-sky-400 group-hover:text-sky-400" aria-hidden="true" />
                            </span>
                            Talk Now
                        </button>
                    </div>
                </form>
            </main >
        </div >
    )
}