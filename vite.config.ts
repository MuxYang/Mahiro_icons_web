import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

const REPO_OWNER = 'MuxYang'
const REPO_NAME = 'Mahiro_icons'
const VIRTUAL_MODULE_ID = 'virtual:icons-data'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

function iconsDataPlugin(): Plugin {
  let iconsJson = '[]'

  return {
    name: 'vite-plugin-icons-data',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export default ${iconsJson};`
      }
    },

    async buildStart() {
      const token = process.env.GITHUB_TOKEN || ''
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.raw+json',
        'User-Agent': 'MahiroIconsBuilder',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const rawBase = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`

      try {
        // 1. Fetch .converted file
        const convertedRes = await fetch(`${rawBase}/icons/.converted`, { headers })
        if (!convertedRes.ok) throw new Error(`Failed to fetch .converted: ${convertedRes.status}`)
        const convertedText = await convertedRes.text()
        const iconFolders = convertedText.trim().split('\n').filter(Boolean)

        // 2. Fetch name.ini for each icon in parallel
        const icons = await Promise.all(
          iconFolders.map(async (folder) => {
            const folderTrimmed = folder.trim()
            try {
              const nameRes = await fetch(`${rawBase}/icons/${encodeURIComponent(folderTrimmed)}/name.ini`, { headers })
              const nameText = nameRes.ok ? await nameRes.text() : folderTrimmed
              const aliases = nameText.trim().split('\n').map(s => s.trim()).filter(Boolean)

              // Display name: capitalize each word of the folder name
              const displayName = folderTrimmed
                .split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')

              return {
                id: folderTrimmed,
                folderName: folderTrimmed,
                displayName,
                aliases,
              }
            } catch {
              return {
                id: folderTrimmed,
                folderName: folderTrimmed,
                displayName: folderTrimmed.charAt(0).toUpperCase() + folderTrimmed.slice(1),
                aliases: [folderTrimmed],
              }
            }
          })
        )

        iconsJson = JSON.stringify(icons)
        console.log(`[icons-data] Loaded ${icons.length} icons from GitHub`)
      } catch (err) {
        console.error('[icons-data] Failed to fetch icon data:', err)
        iconsJson = '[]'
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), iconsDataPlugin()],
  server: {
    host: true,
  },
})
