'use client'

import { Smartphone, Globe } from 'lucide-react'

interface CampaignLinksProps {
    activeSource: string | null
    onSourceClick: (source: string) => void
    onReset: () => void
}

export function CampaignLinks({ activeSource, onSourceClick, onReset }: CampaignLinksProps) {
    return (
        <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Campaign Links</h3>
                {activeSource && (
                    <button
                        onClick={onReset}
                        className="text-xs text-[#ff6602] hover:text-[#e65a02] font-medium"
                    >
                        Reset to Universal
                    </button>
                )}
            </div>
            <p className="text-xs text-gray-500 mb-4">Click a platform to generate a specific QR code & link:</p>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onSourceClick('tiktok')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'tiktok' ? 'bg-black text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-black/90 text-white hover:bg-black'}`}
                >
                    <Smartphone className="w-4 h-4" /> TikTok
                </button>
                <button
                    onClick={() => onSourceClick('facebook')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'facebook' ? 'bg-[#1877F2] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#1877F2]/90 text-white hover:bg-[#1877F2]'}`}
                >
                    <Globe className="w-4 h-4" /> Facebook
                </button>
                <button
                    onClick={() => onSourceClick('instagram')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'instagram' ? 'bg-[#E4405F] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#E4405F]/90 text-white hover:bg-[#E4405F]'}`}
                >
                    <Smartphone className="w-4 h-4" /> Instagram
                </button>
                <button
                    onClick={() => onSourceClick('youtube')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'youtube' ? 'bg-[#FF0000] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#FF0000]/90 text-white hover:bg-[#FF0000]'}`}
                >
                    <Globe className="w-4 h-4" /> YouTube
                </button>
                <button
                    onClick={() => onSourceClick('whatsapp')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'whatsapp' ? 'bg-[#25D366] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#25D366]/90 text-white hover:bg-[#25D366]'}`}
                >
                    <Smartphone className="w-4 h-4" /> WhatsApp
                </button>
                <button
                    onClick={() => onSourceClick('telegram')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'telegram' ? 'bg-[#0088cc] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#0088cc]/90 text-white hover:bg-[#0088cc]'}`}
                >
                    <Smartphone className="w-4 h-4" /> Telegram
                </button>
            </div>
        </div>
    )
}
