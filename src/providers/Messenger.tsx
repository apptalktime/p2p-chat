import { createContext, useContext, useEffect, useState } from 'react';
import { Message } from '@/types';
import OrbitController from '@/core/OrbitController';
import { Identity } from 'orbit-db-identity-provider';

interface MessegerContextValues {
    from: string;
    to: string;
    database: string;
    messages: Message[];
    isLoading: boolean;
    configure: (identity: Identity, to: string) => void;
    send: (msg: string) => void;
}

interface MessegerProviderProps {
    children: React.ReactNode;
}

const MessegerContext = createContext({} as MessegerContextValues);

const entriesToMessages = (entries: LogEntry<any>[], myIdentityId: string, orbit: OrbitController): Message[] => {
    return entries.map((entry: any) => {
        const value = entry.payload.value;
        const isObject = typeof value === 'object';
        const message = (isObject && typeof value.message === 'string') ? value.message : "*message unsupported";
        const timestamp = (isObject && typeof value.timestamp === 'number') ? value.timestamp : null;
        return {
            id: entry.hash,
            message,
            type: "message",
            timestamp,
            me: entry.identity.id === myIdentityId,
            remove: () => orbit.remove(entry.hash)
        }
    });
}

export function MessegerProvider({ children }: MessegerProviderProps) {

    const [orbit, setOrbit] = useState<OrbitController | undefined>();
    const [database, setDatabase] = useState<string>("");
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const configure = async (identity: Identity, to: string) => {
        if (database) return
        const ipfsApiUrl = process.env.NEXT_PUBLIC_IPFS_API_URL || "http://localhost:5001";
        try {
            setIsLoading(true);
            const orbit = new OrbitController(identity, ipfsApiUrl);
            const store = await orbit.init("talktime", [identity.id, to], 'feed', {
                name: "TalkTime"
            });
            orbit.subscribe((state) => {
                if (state.entries) {
                    const messages = entriesToMessages(state.entries, from, orbit);
                    setMessages(messages);
                }
            });
            const from = store.identity.id;
            const messages = entriesToMessages(orbit.state.entries, from, orbit);
            setOrbit(orbit);
            setTo(to);
            setFrom(from);
            setDatabase(orbit.dbAddress);
            if (messages) setMessages(messages);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const send = async (message: string) => {
        if (!orbit || !database) throw new Error("Database not configured");
        await orbit.add({
            type: "message",
            message,
            timestamp: Date.now(),
            version: 0
        });
    }

    return (
        <MessegerContext.Provider
            value={{
                from,
                to,
                database,
                messages,
                isLoading,
                configure,
                send
            }}
        >
            {children}
        </MessegerContext.Provider>
    )
}

export function useMesseger(identity: Identity, to: string): MessegerContextValues {
    const { from, messages, database, isLoading, configure, send } = useContext(MessegerContext);
    if (!configure) throw new Error('useMesseger must be used within a MessegerProvider');
    useEffect(() => {
        configure(identity, to);
    }, []);
    return { from, to, messages, database, isLoading, configure, send };
}