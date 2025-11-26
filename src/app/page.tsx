'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { supabase, isUserAdmin } from '@/lib/supabase'
import { Loader2, Smartphone, Globe, Link as LinkIcon, LogOut, ShieldAlert } from 'lucide-react'

export default function Home() {
  const [iosUrl, setIosUrl] = useState('')
  const [androidUrl, setAndroidUrl] = useState('')
  const [webUrl, setWebUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('Kala soo Deg Appka Caawiye Playstoreka ama App Storeka')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [qrValue, setQrValue] = useState<string | null>(null)
  const [activeSource, setActiveSource] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showIos, setShowIos] = useState(true)
  const [showAndroid, setShowAndroid] = useState(true)
  const [showWeb, setShowWeb] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (generatedLink) {
      setQrValue(generatedLink)
      setActiveSource(null)
    }
  }, [generatedLink])

  // ... (keep existing useEffect for auth)
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const adminStatus = await isUserAdmin()
        setIsAdmin(adminStatus)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

  // ... (keep existing helper functions)
  const isSafeUrl = (url: string): boolean => {
    if (!url) return true // Allow empty URLs
    try {
      const parsed = new URL(url)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo must be less than 2MB')
        return
      }
      setLogoFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push('/login')
      return
    }

    if (!isAdmin) {
      alert('⛔ Access Denied: Only administrators can create QR codes.')
      return
    }

    // Validate URLs
    if (!isSafeUrl(iosUrl) || !isSafeUrl(androidUrl) || !isSafeUrl(webUrl)) {
      alert('⚠️ Invalid URL: Only HTTP and HTTPS URLs are allowed.')
      return
    }

    setLoading(true)

    try {
      let logoUrl = ''

      // Upload logo if provided
      if (logoFile) {
        console.log('Uploading logo...', logoFile.name)
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, logoFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          alert('Failed to upload logo: ' + uploadError.message + '\n\nPlease make sure the "logos" bucket exists in Supabase Storage.')
          setLoading(false)
          return
        }

        console.log('Upload successful:', uploadData)

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('logos')
          .getPublicUrl(filePath)

        logoUrl = urlData.publicUrl
        console.log('Public URL:', logoUrl)
      }

      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          title,
          description,
          ios_url: iosUrl,
          android_url: androidUrl,
          web_url: webUrl,
          logo_url: logoUrl,
          show_ios: showIos,
          show_android: showAndroid,
          show_web: showWeb,
        })
        .select()
        .single()

      if (error) throw error

      const link = `${window.location.origin}/l/${data.id}`
      setGeneratedLink(link)
    } catch (error: any) {
      console.error('Error creating link:', error)
      alert('Error creating link: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setGeneratedLink(null)
    setQrValue(null)
    setActiveSource(null)
  }

  const handleSourceClick = (source: string) => {
    if (!generatedLink) return
    const newLink = `${generatedLink}?s=${source}`
    setQrValue(newLink)
    setActiveSource(source)
    navigator.clipboard.writeText(newLink)
  }

  const handleResetSource = () => {
    if (!generatedLink) return
    setQrValue(generatedLink)
    setActiveSource(null)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.email}</span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#ff6602]/10 text-[#ff6602] text-xs font-medium rounded-full">
                    <ShieldAlert className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-[#ff6602] text-white rounded-lg hover:bg-[#e65a02] transition-colors"
            >
              Login
            </button>
          )}
        </div>

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900"
                  placeholder="My Awesome App"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description / Subtitle
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ff6602] file:text-white hover:file:bg-[#e65a02]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload your app logo (PNG, JPG, max 2MB)</p>
                  </div>
                  {logoPreview && (
                    <div className="flex-shrink-0">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-16 h-16 rounded-lg object-cover border-2 border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Platform Visibility
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> iOS App
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showIos}
                        onChange={(e) => setShowIos(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#007fff]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6602]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> Android App
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showAndroid}
                        onChange={(e) => setShowAndroid(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#007fff]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3DDC84]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Website
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showWeb}
                        onChange={(e) => setShowWeb(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#007fff]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007fff]"></div>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Toggle which platform buttons appear on the scanner page</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> iOS App Store
                  </label>
                  <input
                    type="url"
                    value={iosUrl}
                    onChange={(e) => setIosUrl(e.target.value)}
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
                    value={androidUrl}
                    onChange={(e) => setAndroidUrl(e.target.value)}
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
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
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
          </div>

          {qrValue && (
            <div className="bg-gray-50 p-8 border-t border-gray-100">
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <QRCodeSVG
                    value={qrValue}
                    size={200}
                    level="H"
                    imageSettings={logoPreview ? {
                      src: logoPreview,
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    } : undefined}
                  />
                </div>
                <div className="w-full max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeSource ? `Your ${activeSource.charAt(0).toUpperCase() + activeSource.slice(1)} Link` : 'Your Universal Link'}
                  </label>
                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      readOnly
                      value={qrValue}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(qrValue)
                        alert('Link copied!')
                      }}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-900">Campaign Links</h3>
                      {activeSource && (
                        <button
                          onClick={handleResetSource}
                          className="text-xs text-[#ff6602] hover:text-[#e65a02] font-medium"
                        >
                          Reset to Universal
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Click a platform to generate a specific QR code & link:</p>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSourceClick('tiktok')}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'tiktok' ? 'bg-black text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-black/90 text-white hover:bg-black'}`}
                      >
                        <Smartphone className="w-4 h-4" /> TikTok
                      </button>
                      <button
                        onClick={() => handleSourceClick('facebook')}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'facebook' ? 'bg-[#1877F2] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#1877F2]/90 text-white hover:bg-[#1877F2]'}`}
                      >
                        <Globe className="w-4 h-4" /> Facebook
                      </button>
                      <button
                        onClick={() => handleSourceClick('instagram')}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'instagram' ? 'bg-[#E4405F] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#E4405F]/90 text-white hover:bg-[#E4405F]'}`}
                      >
                        <Smartphone className="w-4 h-4" /> Instagram
                      </button>
                      <button
                        onClick={() => handleSourceClick('youtube')}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'youtube' ? 'bg-[#FF0000] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#FF0000]/90 text-white hover:bg-[#FF0000]'}`}
                      >
                        <Globe className="w-4 h-4" /> YouTube
                      </button>
                      <button
                        onClick={() => handleSourceClick('whatsapp')}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'whatsapp' ? 'bg-[#25D366] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#25D366]/90 text-white hover:bg-[#25D366]'}`}
                      >
                        <Smartphone className="w-4 h-4" /> WhatsApp
                      </button>
                      <button
                        onClick={() => handleSourceClick('telegram')}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${activeSource === 'telegram' ? 'bg-[#0088cc] text-white ring-2 ring-[#ff6602] ring-offset-2' : 'bg-[#0088cc]/90 text-white hover:bg-[#0088cc]'}`}
                      >
                        <Smartphone className="w-4 h-4" /> Telegram
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <a
                    href={qrValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#ff6602] hover:text-[#e65a02] font-medium"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Test Link
                  </a>
                  <a
                    href="/dashboard"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"
                  >
                    View Dashboard
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
        </div >
      </div >
    </main >
  )
}
