'use client'

import { useState } from 'react'
import { ExternalLink, Trash2, Copy, Check, Pencil } from 'lucide-react'
import { LinkStats } from '@/types/dashboard'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface LinksManagerTabProps {
    links: LinkStats[]
    onLinksChange: (links: LinkStats[]) => void
    onEditLink: (link: LinkStats) => void
}

export function LinksManagerTab({ links, onLinksChange, onEditLink }: LinksManagerTabProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleDelete = async (linkId: string, linkTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${linkTitle}"? This will also delete all associated click data.`)) {
            return
        }

        try {
            const { error } = await supabase
                .from('links')
                .delete()
                .eq('id', linkId)

            if (error) throw error

            onLinksChange(links.filter(link => link.id !== linkId))
            toast.success('Link deleted successfully')
        } catch (error) {
            console.error('Error deleting link:', error)
            toast.error('Failed to delete link')
        }
    }

    const handleCopy = (id: string) => {
        const url = `${window.location.origin}/l/${id}`
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
        toast.success('Link copied to clipboard')
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">🔗 Your Links</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                App Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Clicks
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Platform Split
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {links.map((link) => {
                            const ios = link.clicks.filter(c => c.platform === 'ios').length
                            const android = link.clicks.filter(c => c.platform === 'android').length
                            const web = link.clicks.filter(c => c.platform === 'web').length
                            const total = link.clicks.length

                            return (
                                <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{link.title}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                            {window.location.origin}/l/{link.id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(link.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{total}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2 text-xs">
                                            <span className="px-2 py-1 bg-black text-white rounded">
                                                iOS: {ios}
                                            </span>
                                            <span className="px-2 py-1 bg-green-700 text-green-100 rounded">
                                                Android: {android}
                                            </span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                Web: {web}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleCopy(link.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Copy link"
                                            >
                                                {copiedId === link.id ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-600" />
                                                )}
                                            </button>
                                            <a
                                                href={`/l/${link.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Open link"
                                            >
                                                <ExternalLink className="w-4 h-4 text-gray-600" />
                                            </a>
                                            <button
                                                onClick={() => onEditLink(link)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Edit link"
                                            >
                                                <Pencil className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(link.id, link.title)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete link"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {links.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No links yet. Create your first QR code!
                    </div>
                )}
            </div>
        </div>
    )
}
