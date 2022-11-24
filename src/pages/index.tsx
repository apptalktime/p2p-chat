import { useIdentity } from "@/providers/Identity";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/20/solid";
import makeBlockie from "ethereum-blockies-base64";
import Router from "next/router";
import { useForm } from "react-hook-form";

export default function Home() {
    const { identity, signout } = useIdentity();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async ({ destination }: any) => {
        await Router.push(`/chat/${destination}`);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center max-w-2xl">
                <div className="flex items-center space-x-2">
                    <img src={makeBlockie(identity?.id as string)} className="w-8 h-8 rounded-full" />
                    <p className="text-sm font-semibold">
                        {identity?.id}
                    </p>
                    <button className="text-sm font-semibold text-blue-500 hover:text-blue-700">
                        Copy
                    </button>
                    <button
                        onClick={() => signout()}
                        className="text-sm font-semibold text-red-500 hover:text-red-700"
                    >
                        SignOut
                    </button>
                </div>
                <form className="mt-8 space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
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