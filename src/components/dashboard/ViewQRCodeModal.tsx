'use client'

import { useState, useRef } from 'react'
import { X, Download, Copy, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { LinkStats } from '@/types/dashboard'
import toast from 'react-hot-toast'

interface ViewQRCodeModalProps {
    link: LinkStats
    onClose: () => void
}

export function ViewQRCodeModal({ link, onClose }: ViewQRCodeModalProps) {
    const [selectedSource, setSelectedSource] = useState<string>('direct')
    const [customSource, setCustomSource] = useState<string>('')
    const [copied, setCopied] = useState(false)
    const qrRef = useRef<HTMLDivElement>(null)

    const sources = [
        { value: 'direct', label: 'Direct (No Source)' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'telegram', label: 'Telegram' },
        { value: 'twitter', label: 'Twitter/X' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'snapchat', label: 'Snapchat' },
        { value: 'email', label: 'Email Campaign' },
        { value: 'sms', label: 'SMS Campaign' },
        { value: 'print', label: 'Print Materials' },
        { value: 'billboard', label: 'Billboard/Outdoor' },
        { value: 'custom', label: 'Custom Source' },
    ]

    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/l/${link.id}` : ''
    const campaignUrl = selectedSource === 'direct'
        ? baseUrl
        : selectedSource === 'custom'
            ? customSource ? `${baseUrl}?s=${customSource}` : baseUrl
            : `${baseUrl}?s=${selectedSource}`

    const handleCopyLink = () => {
        navigator.clipboard.writeText(campaignUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Link copied to clipboard!')
    }

    const handleDownloadQR = () => {
        const svg = qrRef.current?.querySelector('svg')
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        canvas.width = 1000
        canvas.height = 1000

        img.onload = () => {
            if (ctx) {
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        const sourceSuffix = selectedSource !== 'direct' ? `-${selectedSource}` : ''
                        a.download = `qr-${link.title.toLowerCase().replace(/\s+/g, '-')}${sourceSuffix}.png`
                        a.click()
                        URL.revokeObjectURL(url)
                        toast.success('QR Code downloaded!')
                    }
                })
            }
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">QR Code & Campaign Links</h2>
                        <p className="text-sm text-gray-500 mt-1">{link.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* QR Code Display */}
                    <div className="flex flex-col items-center">
                        <div ref={qrRef} className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100">
                            <QRCodeSVG
                                value={campaignUrl}
                                size={300}
                                level="H"
                                imageSettings={link.logo_url ? {
                                    src: link.logo_url,
                                    x: undefined,
                                    y: undefined,
                                    height: 60,
                                    width: 60,
                                    excavate: true,
                                } : undefined}
                            />
                        </div>
                        {selectedSource !== 'direct' && (
                            <div className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                Campaign: {sources.find(s => s.value === selectedSource)?.label || customSource}
                            </div>
                        )}
                    </div>

                    {/* Source Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Campaign Source
                        </label>
                        <select
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                        >
                            {sources.map(source => (
                                <option key={source.value} value={source.value}>
                                    {source.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Different sources help you track which platform drives the most clicks
                        </p>
                    </div>

                    {/* Custom Source Input */}
                    {selectedSource === 'custom' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Source Name
                            </label>
                            <input
                                type="text"
                                value={customSource}
                                onChange={(e) => setCustomSource(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                placeholder="e.g., radio-ad, event-booth"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Use lowercase and hyphens (e.g., "radio-ad", "event-booth")
                            </p>
                        </div>
                    )}

                    {/* Generated Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Generated Campaign Link
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={campaignUrl}
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-600 focus:outline-none text-sm"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleDownloadQR}
                            className="flex-1 px-4 py-3 bg-[#ff6602] text-white rounded-xl hover:bg-[#e65a02] transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Download QR Code
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>

                    {/* Info Panel */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">💡 How to use:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Select a source to generate a campaign-specific QR code</li>
                            <li>• Download the QR code and use it in your marketing materials</li>
                            <li>• Track which sources drive the most clicks in your dashboard</li>
                            <li>• Use different QR codes for different platforms to optimize your strategy</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
