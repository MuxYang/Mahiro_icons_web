import { useState, useMemo, useCallback } from 'react'
import iconsData from 'virtual:icons-data'
import type { IconData } from './types'
import { ThemeToggle } from './components/ThemeToggle'
import { SearchBar } from './components/SearchBar'
import { IconGrid } from './components/IconGrid'
import logoUrl from './assets/Logo.png'
import './App.css'

function App() {
  const [query, setQuery] = useState('')

  const icons: IconData[] = iconsData

  const filteredIcons = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return icons
    return icons.filter(icon =>
      icon.folderName.toLowerCase().includes(q) ||
      icon.displayName.toLowerCase().includes(q) ||
      icon.aliases.some(alias => alias.toLowerCase().includes(q))
    )
  }, [icons, query])

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
  }, [])

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__spacer" />
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="app-hero">
        <img
          src={logoUrl}
          alt="Mahiro Icons"
          className="app-hero__logo"
        />
        <div className="app-hero__search">
          <SearchBar value={query} onChange={handleSearch} />
        </div>
        <p className="app-hero__count">
          {filteredIcons.length === icons.length
            ? `${icons.length} icons available`
            : `${filteredIcons.length} of ${icons.length} icons`}
        </p>
      </section>

      {/* Main Content */}
      <main className="app-main">
        <IconGrid icons={filteredIcons} query={query} />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          <a href="https://github.com/MuxYang/Mahiro_icons" target="_blank" rel="noopener noreferrer">
            Mahiro Icons
          </a>
          {' · '}Desktop app icons in Mahiro theme
        </p>
      </footer>
    </div>
  )
}

export default App
