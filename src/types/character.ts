export interface Sticker {
    id: string;
    name: string;
    data: string;
    type: string;
}

export interface Lore {
    id: string;
    name: string;
    activationKeys: string[]; // 1 or 2 keys
    order: number;
    prompt: string;
    alwaysActive: boolean;
    multiKey: boolean; // when true, require all activationKeys to match
    characterId?: number;
    roomId?: string;
}

export interface Character {
    id: string | number
    name: string
    prompt: string
    avatar: string | null
    responseTime: number
    thinkingTime: number
    reactivity: number
    tone: number
    proactiveEnabled: boolean
    messageCountSinceLastSummary: number
    media: string[]
    stickers: Sticker[]
    lorebook?: Lore[]
}

export type Mode = 'create' | 'edit'
