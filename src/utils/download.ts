export function getPreviewUrl(rawBase: string, folderName: string): string {
    return `${rawBase}/icons/${encodeURIComponent(folderName)}/png/${encodeURIComponent(folderName)}_128.png`
}

export function getDownloadUrl(rawBase: string, folderName: string, format: string, size?: number): string {
    const encodedFolder = encodeURIComponent(folderName)
    if (format === 'svg' || format === 'xml') {
        return `${rawBase}/icons/${encodedFolder}/${encodedFolder}.${format}`
    }
    return `${rawBase}/icons/${encodedFolder}/${format}/${encodedFolder}_${size}.${format}`
}

export async function triggerDownload(rawBase: string, folderName: string, format: string, size?: number): Promise<void> {
    const url = getDownloadUrl(rawBase, folderName, format, size)
    const fileName = format === 'svg' || format === 'xml'
        ? `${folderName}.${format}`
        : `${folderName}_${size}.${format}`

    try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 15000)

        const res = await fetch(url, { signal: controller.signal })
        clearTimeout(timer)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = fileName
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()

        setTimeout(() => {
            document.body.removeChild(a)
            URL.revokeObjectURL(blobUrl)
        }, 150)
    } catch {
        // Fallback: open URL directly
        const a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
}
