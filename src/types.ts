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

export const ICO_SIZES = [16, 32, 64, 128, 256] as const
export const IMG_SIZES = [64, 128, 256, 512, 1024] as const
export const FORMATS_SINGLE = ['svg', 'xml'] as const
