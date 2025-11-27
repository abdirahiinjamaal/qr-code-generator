export interface ClickData {
    platform: string
    source: string
    country?: string
    city?: string
    created_at: string
}

export interface LinkStats {
    id: string
    title: string
    description: string
    ios_url: string
    android_url: string
    web_url: string
    created_at: string
    show_ios: boolean
    show_android: boolean
    show_web: boolean
    logo_url: string | null
    screenshots: string[]
    rating: number
    review_count: number
    clicks: ClickData[]
}

export type TabType = 'overview' | 'audience' | 'sources' | 'links'
