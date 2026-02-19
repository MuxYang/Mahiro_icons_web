import type { IconData } from '../types'
import { IconCard } from './IconCard'
import './IconGrid.css'

interface IconGridProps {
    icons: IconData[]
    query: string
}

export function IconGrid({ icons, query }: IconGridProps) {
    if (icons.length === 0) {
        return (
            <div className="icon-grid__empty">
                <div className="icon-grid__empty-icon">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                        <path d="M8 11h6" />
                    </svg>
                </div>
                <p className="icon-grid__empty-text">
                    No icons found for "<strong>{query}</strong>"
                </p>
            </div>
        )
    }

    return (
        <div className="icon-grid">
            {icons.map(icon => (
                <IconCard key={icon.id} icon={icon} />
            ))}
        </div>
    )
}
