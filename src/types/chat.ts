export interface Message {
    id: string;
    type: string;
    message: string;
    timestamp: number;
    me: boolean;
    remove?: () => void;
}