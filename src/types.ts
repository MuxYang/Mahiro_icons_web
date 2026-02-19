export interface IconData {
    id: string
    folderName: string
    displayName: string
    aliases: string[]
}

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface DownloadOption {
    format: string
    size?: number
}

export const SIZES = [64, 128, 256, 512, 1024] as const
export const FORMATS_WITH_SIZES = ['ico', 'jpg', 'png'] as const
export const FORMATS_SINGLE = ['svg', 'xml'] as const
