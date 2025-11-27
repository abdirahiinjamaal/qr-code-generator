'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGenerator } from '@/hooks/useGenerator'
import { GeneratorHeader } from '@/components/generator/GeneratorHeader'
import { GeneratorForm } from '@/components/generator/GeneratorForm'
import { QRCodeDisplay } from '@/components/generator/QRCodeDisplay'
import { Loader2, ShieldAlert } from 'lucide-react'

export default function Home() {
    const router = useRouter()
    const {
        user,
        isAdmin,
        loading,
        formData,
        updateFormData,
        qrValue,
        setQrValue,
        activeSource,
        setActiveSource,
        handleSubmit,
        handleLogout
    } = useGenerator()

    // Redirect non-admins
    useEffect(() => {
        if (user && !isAdmin && !loading) {
            router.push('/login')
        }
    }, [user, isAdmin, loading, router])

    const handleSourceClick = (source: string) => {
        if (!qrValue) return
        const baseLink = qrValue.split('?')[0]
        const newLink = `${baseLink}?s=${source}`
        setQrValue(newLink)
        setActiveSource(source)
        navigator.clipboard.writeText(newLink)
    }

    const handleResetSource = () => {
        if (!qrValue) return
        const baseLink = qrValue.split('?')[0]
        setQrValue(baseLink)
        setActiveSource(null)
    }

    // Show loading state while checking auth
    if (!user || loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff6602] mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </main>
        )
    }

    // Show access denied if not admin
    if (!isAdmin) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-2">
                        This QR code generator is restricted to administrators only.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        If you believe this is an error, contact your system administrator.
                    </p>
                    <button
                        onClick={async () => {
                            await handleLogout()
                            router.push('/login')
                        }}
                        className="px-6 py-3 bg-[#ff6602] text-white rounded-lg hover:bg-[#e65a02] transition-colors"
                    >
                        Logout & Return to Login
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <GeneratorHeader
                    user={user}
                    isAdmin={isAdmin}
                    onLogout={handleLogout}
                />

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Universal App QR Code Generator
                    </h1>
                    <p className="text-lg text-gray-600">
                        One QR code for all platforms. Track clicks and optimize your downloads.
                    </p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="p-8">
                        <GeneratorForm
                            formData={formData}
                            loading={loading}
                            onUpdate={updateFormData}
                            onSubmit={handleSubmit}
                        />
                    </div>

                    {qrValue && (
                        <QRCodeDisplay
                            qrValue={qrValue}
                            logoPreview={formData.logoPreview}
                            activeSource={activeSource}
                            onSourceClick={handleSourceClick}
                            onResetSource={handleResetSource}
                        />
                    )}
                </div>
            </div>
        </main>
    )
}
