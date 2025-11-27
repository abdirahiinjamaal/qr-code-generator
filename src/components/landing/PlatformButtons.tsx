'use client'

import { Globe } from 'lucide-react'
import { LinkData } from '@/types/landing'

interface PlatformButtonsProps {
    linkData: LinkData
    onPlatformClick: (platform: 'ios' | 'android' | 'web', url: string) => void
}

export function PlatformButtons({ linkData, onPlatformClick }: PlatformButtonsProps) {
    return (
        <div className="space-y-4">
            {linkData.show_ios && linkData.ios_url && (
                <button
                    onClick={() => onPlatformClick('ios', linkData.ios_url)}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all active:scale-95 shadow-lg"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/apple-logo-svgrepo-com.svg" alt="Apple" className="w-6 h-6 brightness-0 invert" />
                    <div className="text-left">
                        <div className="text-xs opacity-80">Download on the</div>
                        <div className="text-lg font-bold leading-none">App Store</div>
                    </div>
                </button>
            )}

            {linkData.show_android && linkData.android_url && (
                <button
                    onClick={() => onPlatformClick('android', linkData.android_url)}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#3DDC84] text-white rounded-xl hover:bg-[#32b36b] transition-all active:scale-95 shadow-lg"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <div className="text-left">
                        <div className="text-xs opacity-90">GET IT ON</div>
                        <div className="text-lg font-bold leading-none">Google Play</div>
                    </div>
                </button>
            )}

            {linkData.show_web && linkData.web_url && (
                <button
                    onClick={() => onPlatformClick('web', linkData.web_url)}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#007fff] text-white rounded-xl hover:bg-[#006ee6] transition-all active:scale-95 shadow-lg"
                >
                    <Globe className="w-6 h-6" />
                    <div className="text-left">
                        <div className="text-xs opacity-80">Visit Website</div>
                        <div className="text-lg font-bold leading-none">Open in Browser</div>
                    </div>
                </button>
            )}
        </div>
    )
}
