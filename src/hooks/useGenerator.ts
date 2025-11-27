'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase, isUserAdmin } from '@/lib/supabase'
import { GeneratorFormData } from '@/types/generator'
import toast from 'react-hot-toast'

export function useGenerator() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [generatedLink, setGeneratedLink] = useState<string | null>(null)
    const [qrValue, setQrValue] = useState<string | null>(null)
    const [activeSource, setActiveSource] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<GeneratorFormData>({
        title: '',
        description: 'Kala soo Deg Appka Caawiye Playstoreka ama App Storeka',
        iosUrl: '',
        androidUrl: '',
        webUrl: '',
        showIos: true,
        showAndroid: true,
        showWeb: true,
        logoFile: null,
        logoPreview: null
    })

    useEffect(() => {
        if (generatedLink) {
            setQrValue(generatedLink)
            setActiveSource(null)
        }
    }, [generatedLink])

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                const adminStatus = await isUserAdmin()
                setIsAdmin(adminStatus)
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                const adminStatus = await isUserAdmin()
                setIsAdmin(adminStatus)
            } else {
                setIsAdmin(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const updateFormData = (updates: Partial<GeneratorFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }))
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setGeneratedLink(null)
        setQrValue(null)
        setActiveSource(null)
        toast.success('Logged out successfully')
    }

    const isSafeUrl = (url: string): boolean => {
        if (!url) return true
        try {
            const parsed = new URL(url)
            return ['http:', 'https:'].includes(parsed.protocol)
        } catch {
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            router.push('/login')
            return
        }

        if (!isAdmin) {
            toast.error('⛔ Access Denied: Only administrators can create QR codes.')
            return
        }

        if (!isSafeUrl(formData.iosUrl) || !isSafeUrl(formData.androidUrl) || !isSafeUrl(formData.webUrl)) {
            toast.error('⚠️ Invalid URL: Only HTTP and HTTPS URLs are allowed.')
            return
        }

        setLoading(true)

        try {
            let logoUrl = ''

            if (formData.logoFile) {
                const fileExt = formData.logoFile.name.split('.').pop()
                const fileName = `${user.id}-${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('logos')
                    .upload(fileName, formData.logoFile, {
                        cacheControl: '3600',
                        upsert: false
                    })

                if (uploadError) throw uploadError

                const { data: urlData } = supabase.storage
                    .from('logos')
                    .getPublicUrl(fileName)

                logoUrl = urlData.publicUrl
            }

            const { data, error } = await supabase
                .from('links')
                .insert({
                    user_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    ios_url: formData.iosUrl,
                    android_url: formData.androidUrl,
                    web_url: formData.webUrl,
                    logo_url: logoUrl,
                    show_ios: formData.showIos,
                    show_android: formData.showAndroid,
                    show_web: formData.showWeb,
                })
                .select()
                .single()

            if (error) throw error

            const link = `${window.location.origin}/l/${data.id}`
            setGeneratedLink(link)
            toast.success('QR Code generated successfully!')
        } catch (error: any) {
            console.error('Error creating link:', error)
            toast.error('Error creating link: ' + (error.message || 'Unknown error'))
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        isAdmin,
        loading,
        formData,
        updateFormData,
        generatedLink,
        qrValue,
        setQrValue,
        activeSource,
        setActiveSource,
        handleSubmit,
        handleLogout
    }
}
