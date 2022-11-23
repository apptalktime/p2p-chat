import { Wallet } from 'ethers';
import OrbitDB from 'orbit-db';
import Identities, { Identity } from 'orbit-db-identity-provider';
import Store from 'orbit-db-store';
import BaseController, { BaseConfig, BaseState } from './BaseController';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

interface OrbitState extends BaseState {
    entries: LogEntry<any>[];
}

interface OrbitConfig extends BaseConfig {
}

class OrbitController extends BaseController<OrbitConfig, OrbitState> {

    override name = 'OrbitController';

    private identity: Identity;
    private ipfs: IPFSHTTPClient;
    private db: OrbitDB | undefined;
    private store: Store | undefined;

    defaultState: OrbitState = {
        entries: [],
    };

    defaultConfig: OrbitConfig = {};

    constructor(identity: Identity, ipfsApiUrl: string) {
        super();
        this.identity = identity;
        this.ipfs = create({ url: ipfsApiUrl });
        this.initialize();
    }

    static async createIdentity(privateKey: string): Promise<Identity> {
        const wallet = new Wallet(privateKey);
        return await Identities.createIdentity({
            type: "ethereum",
            wallet,
        });
    }

    public async init(name: string, writers: string[], type: TStoreType, meta?: Record<any, any>): Promise<Store> {

        if (this.store) {
            throw new Error("Store already initialized");
        }

        this.db = await OrbitDB.createInstance(this.ipfs, { identity: this.identity });

        // Order writers to ensure the database address is the same for all
        const orderedWriters = writers.sort();

        this.store = await this.db.open(name, {
            create: true,
            overwrite: false,
            replicate: true,
            localOnly: false,
            type,
            accessController: {
                write: orderedWriters
            },
            meta
        } as any);

        await this.store.load();

        this.store.events.on('peer', (peer) => {
            console.log("new peer connected: " + peer)
        })

        this.store.events.on('peer.exchanged', (peer, address, heads) => {
            console.log("Peer Exchanged: ", peer, address, heads)
        });

        this.store.events.on("write", (e) => {
            console.log("write event", e);
            this.sync();
        });

        this.store.events.on("replicated", async (e, a, c) => {
            console.log("replicated", e, a, c)
            this.sync();
        });

        console.log("Orbit database connected:", this.store.address.toString());

        this.sync();

        return this.store;
    }

    public get dbAddress() {
        if (!this.store) {
            throw new Error("Store not initialized");
        }
        return this.store.address.toString()
    }

    public get dbType() {
        if (!this.store) {
            throw new Error("Store not initialized");
        }
        return this.store.type
    }

    public get entries(): LogEntry<any>[] {
        return this.state.entries;
    }

    public async add(content: any) {
        if (!this.db) {
            throw new Error("DB not initialized");
        }
        return await (this.store as any).add(content);
    }

    public async collect(limit = -1): Promise<any[]> {
        if (!this.db) {
            throw new Error("DB not initialized");
        }
        return (this.store as any).iterator({ limit }).collect();
    }

    public async sync() {
        if (!this.db) {
            throw new Error("DB not initialized");
        }
        const entries = await this.collect();
        if (entries !== this.state.entries) {
            this.update({ entries });
        }
    }

    public async collectFrom(hash: string) {
        if (!this.db) {
            throw new Error("DB not initialized");
        }
        return (this.store as any).iterator({ limit: -1, gt: hash }).collect()
    }

}

export default OrbitController;