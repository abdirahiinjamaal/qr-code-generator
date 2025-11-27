'use client'

import { Star } from 'lucide-react'
import { LinkData } from '@/types/landing'

interface AppHeaderProps {
    linkData: LinkData
}

export function AppHeader({ linkData }: AppHeaderProps) {
    return (
        <div className="text-center">
            {linkData.logo_url && (
                <div className="mb-6 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={linkData.logo_url}
                        alt={linkData.title}
                        className="w-24 h-24 rounded-2xl shadow-2xl border-4 border-gray-200 object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{linkData.title}</h1>
            <p className="text-gray-600 mb-4">{linkData.description || 'Kala soo Deg Appka Caawiye Playstoreka ama App Storeka'}</p>

            {/* Social Proof */}
            {(linkData.rating > 0 || linkData.review_count > 0) && (
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex items-center text-yellow-400">
                        <span className="text-gray-900 font-bold text-lg mr-1">{linkData.rating || '4.9'}</span>
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{linkData.review_count ? `${linkData.review_count}+ Reviews` : '1k+ Reviews'}</span>
                </div>
            )}
        </div>
    )
}
