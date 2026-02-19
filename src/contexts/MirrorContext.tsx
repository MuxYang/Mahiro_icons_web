import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface MirrorContextValue {
    /** Whether to use a GitHub proxy mirror */
    useMirror: boolean
    /** Resolved raw base URL */
    rawBase: string
}

const REPO_OWNER = 'MuxYang'
const REPO_NAME = 'Mahiro_icons'
const DIRECT_RAW = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`
const MIRROR_RAW = `https://gh-proxy.com/https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`

const MirrorContext = createContext<MirrorContextValue>({
    useMirror: true,
    rawBase: MIRROR_RAW,
})

export function MirrorProvider({ children }: { children: ReactNode }) {
    // Default to using the proxy for acceleration
    const [useMirror, setUseMirror] = useState(true)

    useEffect(() => {
        // Check if user is outside China — if so, direct access is faster
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const chinaTimezones = ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Harbin', 'Asia/Urumqi', 'Asia/Kashgar']

        if (!chinaTimezones.includes(tz)) {
            // Non-China timezone: try direct access, fall back to proxy
            const controller = new AbortController()
            const timer = setTimeout(() => controller.abort(), 3000)

            fetch(`${DIRECT_RAW}/icons/.converted`, {
                signal: controller.signal,
                method: 'HEAD',
            })
                .then(res => {
                    if (res.ok) setUseMirror(false)
                })
                .catch(() => {
                    // Direct access failed or timed out, keep using proxy
                })
                .finally(() => clearTimeout(timer))

            return () => {
                controller.abort()
                clearTimeout(timer)
            }
        }
    }, [])

    const rawBase = useMirror ? MIRROR_RAW : DIRECT_RAW

    return (
        <MirrorContext.Provider value={{ useMirror, rawBase }}>
            {children}
        </MirrorContext.Provider>
    )
}

export function useMirror(): MirrorContextValue {
    return useContext(MirrorContext)
}
