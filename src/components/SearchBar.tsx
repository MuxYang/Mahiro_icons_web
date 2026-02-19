import { useRef, useState, useEffect, useCallback } from 'react'
import './SearchBar.css'

interface SearchBarProps {
    value: string
    onChange: (query: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    const [localValue, setLocalValue] = useState(value)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value
            setLocalValue(val)
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => onChange(val), 150)
        },
        [onChange]
    )

    const handleClear = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        setLocalValue('')
        onChange('')
    }, [onChange])

    return (
        <div className="search-bar">
            <div className="search-bar__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
            </div>
            <input
                id="search-input"
                className="search-bar__input"
                type="text"
                placeholder="Search icons..."
                value={localValue}
                onChange={handleChange}
                aria-label="Search icons"
                autoComplete="off"
            />
            {localValue && (
                <button
                    className="search-bar__clear"
                    onClick={handleClear}
                    aria-label="Clear search"
                    type="button"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    )
}
