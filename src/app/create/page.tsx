'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useCreateLink } from '@/hooks/useCreateLink'
import { GeneratorForm } from '@/components/generator/GeneratorForm'

export default function CreateLink() {
    const router = useRouter()
    const { formData, isSubmitting, updateFormData, handleSubmit } = useCreateLink()

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

                    <div className="p-8">
                        <GeneratorForm
                            formData={formData}
                            loading={isSubmitting}
                            onUpdate={updateFormData}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
