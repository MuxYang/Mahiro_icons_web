import { useCallback, useEffect, useState } from 'react'
import type { IconData } from '../types'
import { ICO_SIZES, IMG_SIZES, FORMATS_SINGLE } from '../types'
import { useMirror } from '../contexts/MirrorContext'
import { triggerDownload } from '../utils/download'
import './DownloadModal.css'

interface DownloadModalProps {
    icon: IconData
    onClose: () => void
}

export function DownloadModal({ icon, onClose }: DownloadModalProps) {
    const { rawBase } = useMirror()
    const [downloading, setDownloading] = useState<string | null>(null)

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const handleDownload = useCallback(async (format: string, size?: number) => {
        const key = `${format}-${size ?? 'single'}`
        setDownloading(key)
        try {
            await triggerDownload(rawBase, icon.folderName, format, size)
        } finally {
            setDownloading(null)
        }
    }, [rawBase, icon.folderName])

    const FORMAT_GROUPS: { format: string; sizes: readonly number[] }[] = [
        { format: 'ico', sizes: ICO_SIZES },
        { format: 'jpg', sizes: IMG_SIZES },
        { format: 'png', sizes: IMG_SIZES },
    ]

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Download ${icon.displayName}`}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Download {icon.displayName} Icon</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {FORMAT_GROUPS.map(({ format, sizes }) => (
                        <div key={format} className="format-group">
                            <div className="format-group__label">{format.toUpperCase()}</div>
                            <div className="format-group__sizes">
                                {sizes.map(size => {
                                    const key = `${format}-${size}`
                                    return (
                                        <button
                                            key={key}
                                            className={`size-btn ${downloading === key ? 'size-btn--loading' : ''}`}
                                            onClick={() => handleDownload(format, size)}
                                            disabled={downloading !== null}
                                            type="button"
                                        >
                                            {size}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {FORMATS_SINGLE.map(format => {
                        const key = `${format}-single`
                        return (
                            <div key={format} className="format-group">
                                <div className="format-group__label">{format.toUpperCase()}</div>
                                <div className="format-group__sizes">
                                    <button
                                        className={`size-btn size-btn--wide ${downloading === key ? 'size-btn--loading' : ''}`}
                                        onClick={() => handleDownload(format)}
                                        disabled={downloading !== null}
                                        type="button"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
