import React, { useState, useEffect } from 'react'

export default function MenuBar({ activeApp }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(i)
  }, [])

  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 28,
      background: 'rgba(20, 20, 30, 0.75)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', zIndex: 9999,
      fontSize: 13, color: '#e8e8ed',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      pointerEvents: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ fontSize: 14 }}>&#63743;</span>
        <span style={{ fontWeight: 600 }}>{activeApp || 'Finder'}</span>
        <span style={{ opacity: 0.5 }}>Fichier</span>
        <span style={{ opacity: 0.5 }}>Édition</span>
        <span style={{ opacity: 0.5 }}>Présentation</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: 0.75, fontSize: 12 }}>
        <span>🔋 100%</span>
        <span>📶</span>
        <span>{dateStr}</span>
        <span style={{ fontWeight: 500 }}>{timeStr}</span>
      </div>
    </div>
  )
}
