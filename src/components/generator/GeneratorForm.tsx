'use client'

import { Smartphone, Globe, Loader2 } from 'lucide-react'
import { GeneratorFormData } from '@/types/generator'
import { PlatformVisibility } from './PlatformVisibility'
import toast from 'react-hot-toast'

interface GeneratorFormProps {
    formData: GeneratorFormData
    loading: boolean
    onUpdate: (updates: Partial<GeneratorFormData>) => void
    onSubmit: (e: React.FormEvent) => void
}

export function GeneratorForm({ formData, loading, onUpdate, onSubmit }: GeneratorFormProps) {
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file')
                return
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Logo must be less than 2MB')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                onUpdate({
                    logoFile: file,
                    logoPreview: reader.result as string
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePlatformVisibilityChange = (platform: 'ios' | 'android' | 'web', value: boolean) => {
        if (platform === 'ios') onUpdate({ showIos: value })
        if (platform === 'android') onUpdate({ showAndroid: value })
        if (platform === 'web') onUpdate({ showWeb: value })
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Name / Title
                </label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900"
                    placeholder="My Awesome App"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description / Subtitle
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900"
                    placeholder="Kala soo Deg Appka Caawiye Playstoreka ama App Storeka"
                    rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">Text shown below the app name on scanner page</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Logo (Optional)
                </label>
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ff6602] file:text-white hover:file:bg-[#e65a02] file:w-full sm:file:w-auto mb-2 sm:mb-0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload your app logo (PNG, JPG, max 2MB)</p>
                    </div>
                    {formData.logoPreview && (
                        <div className="flex-shrink-0">
                            <img
                                src={formData.logoPreview}
                                alt="Logo preview"
                                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-300"
                            />
                        </div>
                    )}
                </div>
            </div>

            <PlatformVisibility
                showIos={formData.showIos}
                showAndroid={formData.showAndroid}
                showWeb={formData.showWeb}
                onChange={handlePlatformVisibilityChange}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Smartphone className="w-4 h-4" /> iOS App Store
                    </label>
                    <input
                        type="url"
                        value={formData.iosUrl}
                        onChange={(e) => onUpdate({ iosUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900"
                        placeholder="https://apps.apple.com/..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Smartphone className="w-4 h-4" /> Google Play Store
                    </label>
                    <input
                        type="url"
                        value={formData.androidUrl}
                        onChange={(e) => onUpdate({ androidUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900"
                        placeholder="https://play.google.com/..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Website
                    </label>
                    <input
                        type="url"
                        value={formData.webUrl}
                        onChange={(e) => onUpdate({ webUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900"
                        placeholder="https://example.com"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#ff6602] hover:bg-[#e65a02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007fff] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    'Generate QR Code'
                )}
            </button>
        </form>
    )
}
