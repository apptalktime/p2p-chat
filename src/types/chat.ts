export interface Message {
    id: string;
    type: string;
    message: string;
    timestamp: number;
    you: boolean;
}