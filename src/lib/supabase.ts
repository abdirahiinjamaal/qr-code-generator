import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)

// Helper function to check if user is admin
export async function isUserAdmin(): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return false

        // Try to get user role
        let { data, error } = await supabase
            .from('user_roles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        // If user_roles entry doesn't exist, check if there are ANY admins
        if (error && error.code === 'PGRST116') {
            // No entry exists - check if this is the first user (should be admin)
            const { data: roleCount } = await supabase
                .from('user_roles')
                .select('id', { count: 'exact', head: true })

            // If no admins exist at all, make this user an admin automatically
            const isFirstUser = roleCount === null || (roleCount as any) === 0

            // Create user_roles entry
            const { error: insertError } = await supabase
                .from('user_roles')
                .insert({ id: user.id, is_admin: isFirstUser })

            if (insertError) {
                console.error('Error creating user_roles entry:', insertError)
                return false
            }

            return isFirstUser
        }

        if (error || !data) return false
        return data.is_admin === true
    } catch (error) {
        console.error('Error checking admin status:', error)
        return false
    }
}
