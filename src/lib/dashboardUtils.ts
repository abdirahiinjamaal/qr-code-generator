import { LinkStats } from '@/types/dashboard'

export function calculateTotalClicks(links: LinkStats[]): number {
    return links.reduce((sum, link) => sum + link.clicks.length, 0)
}

export function calculatePlatformStats(links: LinkStats[]) {
    const stats = links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            acc[click.platform] = (acc[click.platform] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>)

    return [
        { name: 'iOS', value: stats['ios'] || 0, color: '#000000' },
        { name: 'Android', value: stats['android'] || 0, color: '#3DDC84' },
        { name: 'Web', value: stats['web'] || 0, color: '#007fff' },
    ].filter(d => d.value > 0)
}

export function calculateSourceStats(links: LinkStats[]) {
    const stats = links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            const source = click.source || 'direct'
            acc[source] = (acc[source] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>)

    return Object.entries(stats)
        .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: getSourceColor(name)
        }))
        .sort((a, b) => b.value - a.value)
}

export function calculateLocationStats(links: LinkStats[]) {
    const stats = links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            const country = click.country || 'Unknown'
            acc[country] = (acc[country] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>)

    return Object.entries(stats)
        .map(([name, value]) => ({
            name,
            value,
            color: '#8884d8'
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
}

export function calculateClicksOverTime(links: LinkStats[]) {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
    }).reverse().map(date => {
        const count = links.reduce((sum, link) => {
            return sum + link.clicks.filter(c => c.created_at.startsWith(date)).length
        }, 0)
        return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            count
        }
    })
}

function getSourceColor(name: string): string {
    const colors: Record<string, string> = {
        tiktok: '#000000',
        facebook: '#1877F2',
        instagram: '#E4405F',
        youtube: '#FF0000',
        whatsapp: '#25D366',
        telegram: '#0088cc'
    }
    return colors[name] || '#888888'
}
