import useToast from '@/hooks/Toast';
import { useIdentity } from '@/providers/Identity';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid';
import Router from 'next/router';
import { useForm } from 'react-hook-form';

export default function Auth() {

    const { identity, auth } = useIdentity();
    const { showError } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async ({ privateKey, destination }: any) => {
        try {
            await auth.fromPrivateKey(privateKey);
        } catch (error: any) {
            showError(error.message);
        }
    }

    if (identity) {
        Router.push('/');
        return <></>
    }
    
    return (
        <>
            <div className="h-full bg-gray-50" style={{
                height: '100vh'
            }}>
                <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <img
                                className="mx-auto h-12 w-auto"
                                src="https://cdn-icons-png.flaticon.com/512/5050/5050072.png"
                                alt="Your Company"
                            />
                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-700">
                                TalkTime
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Peer-to-Peer & End-to-End encrypted chat
                            </p>
                        </div>
                        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-2 rounded-md shadow-sm">
                                <div>
                                    <label htmlFor="private-key" className="sr-only">
                                        Your Private Key
                                    </label>
                                    <input
                                        id="private-key"
                                        type="text"
                                        autoComplete="private-key"
                                        required
                                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        placeholder="Your Private Key"
                                        {...register("privateKey", {
                                            required: true,
                                            minLength: 64,
                                            maxLength: 66,
                                            pattern: /^(0x|)[a-fA-F0-9]{64}$/
                                        })}
                                    />
                                    <div className='ml-1'>
                                        {
                                            errors.privateKey
                                                ? errors.privateKey.type === "required"
                                                    ? <span className='text-xs'>This is required</span>
                                                    : <span className='text-xs'>Invalid private key</span>
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                >
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <ArrowLeftOnRectangleIcon className="h-5 w-5 text-sky-400 group-hover:text-sky-400" aria-hidden="true" />
                                    </span>
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
