import { useState, useCallback, useEffect } from 'react'
import type { IconData } from '../types'
import { useMirror } from '../contexts/MirrorContext'
import { getPreviewUrl } from '../utils/download'
import { DownloadModal } from './DownloadModal'
import './IconCard.css'

interface IconCardProps {
    icon: IconData
}

export function IconCard({ icon }: IconCardProps) {
    const { rawBase } = useMirror()
    const [showModal, setShowModal] = useState(false)
    const [imgError, setImgError] = useState(false)

    const previewUrl = getPreviewUrl(rawBase, icon.folderName)

    // Reset error state when URL changes (e.g. proxy switch)
    useEffect(() => {
        setImgError(false)
    }, [previewUrl])

    const handleDownloadClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setShowModal(true)
    }, [])

    return (
        <>
            <div className="icon-card" id={`icon-${icon.id}`}>
                <div className="icon-card__preview">
                    {imgError ? (
                        <div className="icon-card__placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21,15 16,10 5,21" />
                            </svg>
                        </div>
                    ) : (
                        <img
                            src={previewUrl}
                            alt={icon.displayName}
                            loading="lazy"
                            onError={() => setImgError(true)}
                            className="icon-card__img"
                        />
                    )}
                </div>
                <div className="icon-card__info">
                    <span className="icon-card__name" title={icon.displayName}>
                        {icon.displayName}
                    </span>
                    <button
                        className="icon-card__download-btn"
                        onClick={handleDownloadClick}
                        aria-label={`Download ${icon.displayName}`}
                        title="Download"
                        type="button"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </button>
                </div>
            </div>
            {showModal && (
                <DownloadModal
                    icon={icon}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    )
}
