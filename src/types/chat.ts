export interface Message {
    id: string;
    type: string;
    message: string;
    timestamp: number;
    me: boolean;
    remove?: () => void;
}

export type HeroIconType = (props: React.ComponentProps<'svg'> & { title?: string, titleId?: string }) => JSX.Element;