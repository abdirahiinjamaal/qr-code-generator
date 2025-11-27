'use client'

import { useState } from 'react'
import { X, Loader2, Trash2 } from 'lucide-react'
import { LinkStats } from '@/types/dashboard'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface EditLinkModalProps {
    link: LinkStats
    onClose: () => void
    onUpdate: (updatedLink: LinkStats) => void
}

export function EditLinkModal({ link, onClose, onUpdate }: EditLinkModalProps) {
    const [editingLink, setEditingLink] = useState<LinkStats>(link)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) return

        const files = Array.from(e.target.files)
        const newScreenshots = [...(editingLink.screenshots || [])]
        setIsSubmitting(true)

        try {
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${editingLink.id}/${Math.random()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('screenshots')
                    .upload(fileName, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('screenshots')
                    .getPublicUrl(fileName)

                newScreenshots.push(publicUrl)
            }

            setEditingLink({ ...editingLink, screenshots: newScreenshots })
            toast.success('Screenshots uploaded')
        } catch (error) {
            console.error('Error uploading screenshot:', error)
            toast.error('Failed to upload screenshot')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRemoveScreenshot = (indexToRemove: number) => {
        const newScreenshots = editingLink.screenshots.filter((_, index) => index !== indexToRemove)
        setEditingLink({ ...editingLink, screenshots: newScreenshots })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('links')
                .update({
                    title: editingLink.title,
                    description: editingLink.description,
                    ios_url: editingLink.ios_url,
                    android_url: editingLink.android_url,
                    web_url: editingLink.web_url,
                    show_ios: editingLink.show_ios,
                    show_android: editingLink.show_android,
                    show_web: editingLink.show_web,
                    screenshots: editingLink.screenshots,
                    rating: editingLink.rating,
                    review_count: editingLink.review_count,
                })
                .eq('id', editingLink.id)

            if (error) throw error

            onUpdate(editingLink)
            toast.success('Link updated successfully!')
            onClose()
        } catch (error) {
            console.error('Error updating link:', error)
            toast.error('Failed to update link')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Edit Link</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            App Title
                        </label>
                        <input
                            type="text"
                            value={editingLink.title}
                            onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={editingLink.description}
                            onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <input
                                    type="checkbox"
                                    checked={editingLink.show_ios}
                                    onChange={(e) => setEditingLink({ ...editingLink, show_ios: e.target.checked })}
                                    className="rounded"
                                />
                                iOS URL
                            </label>
                            <input
                                type="url"
                                value={editingLink.ios_url}
                                onChange={(e) => setEditingLink({ ...editingLink, ios_url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                                disabled={!editingLink.show_ios}
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <input
                                    type="checkbox"
                                    checked={editingLink.show_android}
                                    onChange={(e) => setEditingLink({ ...editingLink, show_android: e.target.checked })}
                                    className="rounded"
                                />
                                Android URL
                            </label>
                            <input
                                type="url"
                                value={editingLink.android_url}
                                onChange={(e) => setEditingLink({ ...editingLink, android_url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                                disabled={!editingLink.show_android}
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <input
                                    type="checkbox"
                                    checked={editingLink.show_web}
                                    onChange={(e) => setEditingLink({ ...editingLink, show_web: e.target.checked })}
                                    className="rounded"
                                />
                                Web URL
                            </label>
                            <input
                                type="url"
                                value={editingLink.web_url}
                                onChange={(e) => setEditingLink({ ...editingLink, web_url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                                disabled={!editingLink.show_web}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Screenshots
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleScreenshotUpload}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                        />
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {editingLink.screenshots.map((url, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Screenshot ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveScreenshot(idx)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={editingLink.rating}
                                onChange={(e) => setEditingLink({ ...editingLink, rating: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Review Count
                            </label>
                            <input
                                type="number"
                                value={editingLink.review_count}
                                onChange={(e) => setEditingLink({ ...editingLink, review_count: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-[#ff6602] text-white rounded-xl hover:bg-[#e65a02] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
