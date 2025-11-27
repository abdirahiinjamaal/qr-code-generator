'use client'

import { Loader2, AlertCircle } from 'lucide-react'
import { useLandingPage } from '@/hooks/useLandingPage'
import { AppScreenshots } from '@/components/landing/AppScreenshots'
import { AppHeader } from '@/components/landing/AppHeader'
import { PlatformButtons } from '@/components/landing/PlatformButtons'

export default function RedirectPage() {
    const { linkData, loading, error, handlePlatformClick } = useLandingPage()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff6602]" />
            </div>
        )
    }

    if (error || !linkData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
                    <p className="text-gray-600">{error || 'Something went wrong'}</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <AppScreenshots screenshots={linkData.screenshots} />

                <AppHeader linkData={linkData} />

                <PlatformButtons
                    linkData={linkData}
                    onPlatformClick={handlePlatformClick}
                />

                <div className="text-center text-sm text-gray-400 mt-8">
                    Powered by Caawiye.com
                </div>
            </div>
        </main>
    )
}
