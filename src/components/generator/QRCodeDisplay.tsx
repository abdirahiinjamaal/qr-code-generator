'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Link as LinkIcon } from 'lucide-react'
import { CampaignLinks } from './CampaignLinks'
import toast from 'react-hot-toast'

interface QRCodeDisplayProps {
    qrValue: string
    logoPreview: string | null
    activeSource: string | null
    onSourceClick: (source: string) => void
    onResetSource: () => void
}

export function QRCodeDisplay({
    qrValue,
    logoPreview,
    activeSource,
    onSourceClick,
    onResetSource
}: QRCodeDisplayProps) {
    const handleCopyLink = () => {
        navigator.clipboard.writeText(qrValue)
        toast.success('Link copied!')
    }

    return (
        <div className="bg-gray-50 p-8 border-t border-gray-100">
            <div className="flex flex-col items-center space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <QRCodeSVG
                        value={qrValue}
                        size={200}
                        level="H"
                        imageSettings={logoPreview ? {
                            src: logoPreview,
                            x: undefined,
                            y: undefined,
                            height: 40,
                            width: 40,
                            excavate: true,
                        } : undefined}
                    />
                </div>
                <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {activeSource ? `Your ${activeSource.charAt(0).toUpperCase() + activeSource.slice(1)} Link` : 'Your Universal Link'}
                    </label>
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            readOnly
                            value={qrValue}
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 focus:outline-none"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <CampaignLinks
                        activeSource={activeSource}
                        onSourceClick={onSourceClick}
                        onReset={onResetSource}
                    />

                    <div className="flex gap-4 mt-6">
                        <a
                            href={qrValue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#ff6602] hover:text-[#e65a02] font-medium"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Test Link
                        </a>
                        <a
                            href="/dashboard"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"
                        >
                            View Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
