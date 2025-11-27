'use client'

interface AppScreenshotsProps {
    screenshots: string[]
}

export function AppScreenshots({ screenshots }: AppScreenshotsProps) {
    if (!screenshots || screenshots.length === 0) return null

    return (
        <div className="mb-6 w-full overflow-hidden relative mask-linear-fade">
            {/* Duplicate the array 4 times to ensure smooth infinite scrolling even with few images */}
            <div className="flex gap-3 w-max animate-scroll">
                {[...screenshots, ...screenshots, ...screenshots, ...screenshots].map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Screenshot ${index + 1}`}
                        className="w-24 h-auto rounded-lg shadow-sm border border-gray-100 flex-shrink-0"
                    />
                ))}
            </div>
        </div>
    )
}
