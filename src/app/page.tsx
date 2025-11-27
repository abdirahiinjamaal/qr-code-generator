'use client'

import { useGenerator } from '@/hooks/useGenerator'
import { GeneratorHeader } from '@/components/generator/GeneratorHeader'
import { GeneratorForm } from '@/components/generator/GeneratorForm'
import { QRCodeDisplay } from '@/components/generator/QRCodeDisplay'

export default function Home() {
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

    const handleSourceClick = (source: string) => {
        if (!qrValue) return
        // Base link is the one without query params
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
