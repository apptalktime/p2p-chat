import { createContext, useContext, useEffect, useState } from 'react';
import { Identity } from 'orbit-db-identity-provider';
import OrbitController from '@/core/OrbitController';
import Router from 'next/router';
import Image from 'next/image';

interface Auth {
    fromPrivateKey: (privateKey: string) => Promise<string>;
}

interface IdentityContextValues {
    identity: Identity | null;
    auth: Auth;
}

interface IdentityProviderProps {
    children: React.ReactNode
}

export const IdentityContext = createContext({} as IdentityContextValues)

export function IdentityProvider({ children }: IdentityProviderProps) {

    const [identity, setIdentity] = useState<Identity | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const auth = {
        fromPrivateKey: async (privateKey: string) => {
            const _identity = await OrbitController.createIdentity(privateKey);
            setIdentity(_identity);
            return _identity.id;
        }
    }

    const init = async () => {
        if (!identity) {
            await Router.push('/');
        }
        setIsLoading(false);
    }

    useEffect(() => {
        init();
    }, [])

    if (isLoading) {
        return (
            <div className='w-full h-screen flex flex-col space-y-8 justify-center items-center'>
                <Image src="/loading.gif" width={196} height={144} alt="loader" priority={true} />
                <p className="text-gray-600">Loading P2P Chat</p>
            </div>
        );
    }

    return (
        <IdentityContext.Provider
            value={{
                identity,
                auth
            }}
        >
            {children}
        </IdentityContext.Provider>
    )
}

export function useIdentity(): IdentityContextValues {
    const { identity, auth } = useContext(IdentityContext);
    if (!auth) throw new Error('useIdentity must be used within an IdentityProvider');
    return { identity, auth };
}