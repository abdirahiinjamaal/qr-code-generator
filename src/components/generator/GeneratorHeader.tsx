'use client'

import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { LayoutDashboard, LogOut, ShieldAlert } from 'lucide-react'

interface GeneratorHeaderProps {
    user: User | null
    isAdmin: boolean
    onLogout: () => void
}

export function GeneratorHeader({ user, isAdmin, onLogout }: GeneratorHeaderProps) {
    const router = useRouter()

    return (
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
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#ff6602] bg-[#ff6602]/10 rounded-lg hover:bg-[#ff6602]/20 transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </button>
                    <button
                        onClick={onLogout}
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
    )
}
