'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, ArrowLeft, Smartphone, Globe, Layout, Upload, X } from 'lucide-react'

export default function CreateLink() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ios_url: '',
        android_url: '',
        web_url: '',
        show_ios: true,
        show_android: true,
        show_web: true
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size must be less than 5MB')
                return
            }
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setLogoFile(null)
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview)
            setLogoPreview(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            let logo_url = null
            if (logoFile) {
                const fileExt = logoFile.name.split('.').pop()
                const fileName = `${user.id}/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('logos')
                    .upload(fileName, logoFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('logos')
                    .getPublicUrl(fileName)

                logo_url = publicUrl
            }

            const { error } = await supabase
                .from('links')
                .insert({
                    ...formData,
                    user_id: user.id,
                    logo_url
                })

            if (error) throw error

            router.push('/dashboard')
        } catch (error) {
            console.error('Error creating link:', error)
            alert('Failed to create link. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Link</h1>
                        <p className="text-gray-500 mt-1">Create a smart link that directs users to the right app store.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Layout className="w-5 h-5 text-gray-400" />
                                Basic Information
                            </h2>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">App Logo</label>
                                <div className="flex items-center gap-6">
                                    {logoPreview ? (
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                            <Upload className="w-6 h-6 mb-1" />
                                            <span className="text-xs">Upload</span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-orange-50 file:text-[#ff6602]
                                                hover:file:bg-orange-100
                                                transition-colors"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        App Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-[#ff6602] transition-all outline-none"
                                        placeholder="e.g. My Awesome App"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6602] focus:border-[#ff6602] transition-all outline-none"
                                        rows={3}
                                        placeholder="Brief description of your app..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Platform URLs */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-gray-400" />
                                Platform Destinations
                            </h2>

                            <div className="space-y-4">
                                {/* iOS */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all focus-within:border-[#ff6602] focus-within:ring-1 focus-within:ring-[#ff6602]">
                                    <div className="flex items-start gap-4">
                                        <div className="pt-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.show_ios}
                                                onChange={e => setFormData({ ...formData, show_ios: e.target.checked })}
                                                className="w-5 h-5 text-[#ff6602] rounded focus:ring-[#ff6602] cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                                iOS App Store
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.ios_url}
                                                onChange={e => setFormData({ ...formData, ios_url: e.target.value })}
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#ff6602]"
                                                placeholder="https://apps.apple.com/app/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Android */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all focus-within:border-[#ff6602] focus-within:ring-1 focus-within:ring-[#ff6602]">
                                    <div className="flex items-start gap-4">
                                        <div className="pt-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.show_android}
                                                onChange={e => setFormData({ ...formData, show_android: e.target.checked })}
                                                className="w-5 h-5 text-[#ff6602] rounded focus:ring-[#ff6602] cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                                Google Play Store
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.android_url}
                                                onChange={e => setFormData({ ...formData, android_url: e.target.value })}
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#ff6602]"
                                                placeholder="https://play.google.com/store/apps/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Web */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all focus-within:border-[#ff6602] focus-within:ring-1 focus-within:ring-[#ff6602]">
                                    <div className="flex items-start gap-4">
                                        <div className="pt-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.show_web}
                                                onChange={e => setFormData({ ...formData, show_web: e.target.checked })}
                                                className="w-5 h-5 text-[#ff6602] rounded focus:ring-[#ff6602] cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                                Website URL
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.web_url}
                                                onChange={e => setFormData({ ...formData, web_url: e.target.value })}
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#ff6602]"
                                                placeholder="https://your-website.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-[#ff6602] text-white font-medium rounded-xl hover:bg-[#e65a02] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-200"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Create Link
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
