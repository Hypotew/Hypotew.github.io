import React, { useState, useCallback, useMemo } from 'react'
import MenuBar from './components/MenuBar'
import Dock from './components/Dock'
import AppWindow from './components/AppWindow'
import { PROJECTS } from './data/projects'

export default function App() {
  const [openWindows, setOpenWindows] = useState([])
  const [windowOrder, setWindowOrder] = useState([])
  const [maximized, setMaximized] = useState({})

  const openApp = useCallback((id) => {
    setOpenWindows((prev) => prev.includes(id) ? prev : [...prev, id])
    setWindowOrder((prev) => [...prev.filter((w) => w !== id), id])
  }, [])

  const closeApp = useCallback((id) => {
    setOpenWindows((prev) => prev.filter((w) => w !== id))
    setWindowOrder((prev) => prev.filter((w) => w !== id))
    setMaximized((prev) => { const n = { ...prev }; delete n[id]; return n })
  }, [])

  const focusApp = useCallback((id) => {
    setWindowOrder((prev) => {
      if (prev[prev.length - 1] === id) return prev
      return [...prev.filter((w) => w !== id), id]
    })
  }, [])

  const minimizeApp = useCallback((id) => {
    setOpenWindows((prev) => prev.filter((w) => w !== id))
    setWindowOrder((prev) => prev.filter((w) => w !== id))
  }, [])

  const toggleMaximize = useCallback((id) => {
    setMaximized((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const topApp = useMemo(() =>
    windowOrder.length > 0
      ? PROJECTS.find((p) => p.id === windowOrder[windowOrder.length - 1])?.name
      : null,
    [windowOrder]
  )

  return (
    <div style={{
      width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden',
      backgroundImage: 'url(/macos-tahoe-26-5120x2880-22674.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        <MenuBar activeApp={topApp} />

        {openWindows.length === 0 && (
          <div style={{
            position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)',
            fontSize: 13, opacity: 0.4, color: '#e8e8ed',
            background: 'rgba(0,0,0,0.35)', padding: '6px 16px', borderRadius: 8,
            backdropFilter: 'blur(10px)', pointerEvents: 'none',
          }}>
            Cliquez sur une application dans le Dock
          </div>
        )}

        <div style={{ pointerEvents: 'auto' }}>
          {openWindows.map((id) => {
            const project = PROJECTS.find((p) => p.id === id)
            const zIndex = 100 + windowOrder.indexOf(id)
            return (
              <AppWindow
                key={id}
                project={project}
                zIndex={zIndex}
                onFocus={focusApp}
                onClose={closeApp}
                onMinimize={minimizeApp}
                onMaximize={toggleMaximize}
                isMaximized={!!maximized[id]}
              />
            )
          })}
        </div>

        <Dock projects={PROJECTS} openWindows={openWindows} onOpen={openApp} />
      </div>
    </div>
  )
}
