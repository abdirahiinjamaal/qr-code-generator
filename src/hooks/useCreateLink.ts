'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GeneratorFormData } from '@/types/generator'
import toast from 'react-hot-toast'

export function useCreateLink() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<GeneratorFormData>({
        title: '',
        description: '',
        iosUrl: '',
        androidUrl: '',
        webUrl: '',
        showIos: true,
        showAndroid: true,
        showWeb: true,
        logoFile: null,
        logoPreview: null
    })

    const updateFormData = (updates: Partial<GeneratorFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }))
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
            if (formData.logoFile) {
                const fileExt = formData.logoFile.name.split('.').pop()
                const fileName = `${user.id}/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('logos')
                    .upload(fileName, formData.logoFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('logos')
                    .getPublicUrl(fileName)

                logo_url = publicUrl
            }

            const { error } = await supabase
                .from('links')
                .insert({
                    user_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    ios_url: formData.iosUrl,
                    android_url: formData.androidUrl,
                    web_url: formData.webUrl,
                    show_ios: formData.showIos,
                    show_android: formData.showAndroid,
                    show_web: formData.showWeb,
                    logo_url
                })

            if (error) throw error

            toast.success('Link created successfully!')
            router.push('/dashboard')
        } catch (error: any) {
            console.error('Error creating link:', error)
            toast.error('Failed to create link: ' + (error.message || 'Unknown error'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        formData,
        isSubmitting,
        updateFormData,
        handleSubmit
    }
}
