import { createContext, useContext, useEffect, useState } from 'react';
import { Identity } from 'orbit-db-identity-provider';
import OrbitController from '@/core/OrbitController';
import Router from 'next/router';
import Image from 'next/image';
import useToast from '@/hooks/Toast';

interface Auth {
    fromPrivateKey: (privateKey: string) => Promise<string>;
}

interface IdentityContextValues {
    identity: Identity | null;
    auth: Auth;
    signout: () => void;
}

interface IdentityProviderProps {
    children: React.ReactNode
}

const DB_NAME = "talktime-db";
const IDENTITIES_STORE_NAME = "identities";

export const IdentityContext = createContext({} as IdentityContextValues)

export function IdentityProvider({ children }: IdentityProviderProps) {

    const { showError } = useToast();
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const auth = {
        fromPrivateKey: async (privateKey: string) => {
            const _identity = await OrbitController.createIdentity(privateKey);
            await storeLocalIdentity(_identity.id, privateKey);
            setIdentity(_identity);
            return _identity.id;
        }
    }

    const getObjectStore = async (mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore | null> => {
        return new Promise(async (resolve, reject) => {
            if (indexedDB.databases) {
                // Only available in Chrome
                const dbs = await indexedDB.databases();
                const db = dbs.find(db => db.name === DB_NAME);
                if (!db) return resolve(null);
            }
            const identitiesDB = indexedDB.open(DB_NAME);
            identitiesDB.onsuccess = (event: any) => {
                const db: IDBDatabase = event.target.result;
                if (db.objectStoreNames.contains(IDENTITIES_STORE_NAME)) {
                    const tx = db.transaction(IDENTITIES_STORE_NAME, mode);
                    const store = tx.objectStore(IDENTITIES_STORE_NAME);
                    resolve(store)
                } else {
                    resolve(null)
                }
            }
            identitiesDB.onerror = (event: any) => reject(event.target.error)
        });
    }

    const getLocalIdentity = async (): Promise<Identity | null> => {
        const store = await getObjectStore();
        if (!store) return null;
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = function (event: any) {
                const values: any[] = event.target.result;
                if (values.length) {
                    const { privateKey } = values[0];
                    const identity = OrbitController.createIdentity(privateKey);
                    resolve(identity);
                } else {
                    resolve(null);
                }
            }
            request.onerror = (event: any) => reject(event.target.error)
        })
    }

    const storeLocalIdentity = async (id: string, privateKey: string) => {
        return new Promise(async (resolve, reject) => {
            const identitiesDB = indexedDB.open(DB_NAME);
            identitiesDB.onupgradeneeded = (event: any) => {
                const db: IDBDatabase = event.target.result;
                const objectStore = db.createObjectStore(IDENTITIES_STORE_NAME, { keyPath: 'id' });
                objectStore.createIndex('id', 'id', { unique: true });
                objectStore.createIndex('privateKey', 'privateKey', { unique: true });

                objectStore.transaction.oncomplete = (event) => {
                    // Store values in the newly created objectStore.
                    const store = db.transaction(IDENTITIES_STORE_NAME, 'readwrite').objectStore(IDENTITIES_STORE_NAME);
                    const request = store.put({
                        id,
                        privateKey,
                    });
                    request.onsuccess = (event: any) => {
                        resolve(event.target.result);
                    }
                    request.onerror = (event: any) => reject(event.target.error)
                };
            }
            identitiesDB.onsuccess = (event: any) => {
                const db: IDBDatabase = event.target.result;
                const store = db.transaction(IDENTITIES_STORE_NAME, 'readwrite').objectStore(IDENTITIES_STORE_NAME);
                const request = store.put({
                    id,
                    privateKey,
                });
                request.onsuccess = (event: any) => {
                    resolve(event.target.result);
                }
                request.onerror = (event: any) => reject(event.target.error)
            }
            identitiesDB.onerror = (event: any) => reject(event.target.error)
        });
    }

    const signout = async () => {
        setIsLoading(true);
        const store = await getObjectStore('readwrite');
        if (!store) return null;
        return new Promise((resolve, reject) => {
            const requestKeys = store.getAllKeys();
            requestKeys.onsuccess = (event: any) => {
                const keys: string[] = event.target.result;
                if (keys.length) {
                    const key = keys[0];
                    const requestDelete = store.delete(key);
                    requestDelete.onsuccess = async () => {
                        setIdentity(null);
                        resolve(key);
                        await Router.push("/auth");
                        setIsLoading(false);
                    }
                    requestDelete.onerror = (event: any) => reject(event.target.error)
                } else {
                    reject("No identity found");
                }
            }
            requestKeys.onerror = (event: any) => reject(event.target.error)
        })
    }

    const init = async () => {
        try {
            const localIdentity = await getLocalIdentity();
            if (localIdentity) {
                setIdentity(localIdentity);
            } else {
                await Router.push('/auth');
            }
            setIsLoading(false);
        } catch (error: any) {
            showError(typeof error === 'string' ? error : error.message);
        }
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
                auth,
                signout
            }}
        >
            {children}
        </IdentityContext.Provider>
    )
}

export function useIdentity(): IdentityContextValues {
    const { identity, auth, signout } = useContext(IdentityContext);
    if (!auth) throw new Error('useIdentity must be used within an IdentityProvider');
    return { identity, auth, signout };
}