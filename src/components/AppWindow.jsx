import { useState, useRef, useEffect, useCallback, memo } from 'react'

// Single global drag handler — avoids N window mousemove listeners
let _dragHandler = null
window.addEventListener('mousemove', (e) => _dragHandler?.(e), { passive: true })
window.addEventListener('mouseup', () => { _dragHandler = null })

function useDraggable(initialPos) {
  const [pos, setPos] = useState(initialPos)
  const posRef = useRef(initialPos)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    offset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y }
    _dragHandler = (moveE) => {
      const newPos = { x: moveE.clientX - offset.current.x, y: moveE.clientY - offset.current.y }
      posRef.current = newPos
      setPos(newPos)
    }
    e.preventDefault()
  }, [])

  return { pos, onMouseDown }
}

const AppWindow = memo(function AppWindow({ project, zIndex, onFocus, onClose, onMinimize, onMaximize, isMaximized }) {
  const initX = useRef(100 + Math.random() * 180).current
  const initY = useRef(60 + Math.random() * 80).current
  const { pos, onMouseDown } = useDraggable({ x: initX, y: initY })
  const [closing, setClosing] = useState(false)
  const [opening, setOpening] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setOpening(false), 300)
    return () => clearTimeout(t)
  }, [])

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => onClose(project.id), 250)
  }, [onClose, project.id])

  const handleMinimize = useCallback(() => onMinimize(project.id), [onMinimize, project.id])
  const handleMaximize = useCallback(() => onMaximize(project.id), [onMaximize, project.id])
  const handleFocus = useCallback(() => onFocus(project.id), [onFocus, project.id])

  const windowStyle = isMaximized
    ? { position: 'fixed', top: 28, left: 0, width: '100vw', height: 'calc(100vh - 28px)', borderRadius: 0 }
    : { position: 'fixed', top: pos.y, left: pos.x, width: 700, minHeight: 480, borderRadius: 12 }

  const isAnimating = opening || closing

  return (
    <div
      style={{
        ...windowStyle,
        background: 'rgba(28, 28, 40, 0.97)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        zIndex, overflow: 'hidden',
        color: '#e8e8ed',
        opacity: isAnimating ? (closing ? 0 : 0) : 1,
        transform: isAnimating ? (opening ? 'scale(0.85)' : 'scale(0.9)') : 'scale(1)',
        transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: isAnimating ? 'transform, opacity' : 'auto',
      }}
      onMouseDown={handleFocus}
    >
      {/* ── Title bar ── */}
      <div
        onMouseDown={isMaximized ? undefined : onMouseDown}
        style={{
          height: 46, display: 'flex', alignItems: 'center', padding: '0 16px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          cursor: isMaximized ? 'default' : 'grab',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { color: '#ff5f57', action: handleClose },
            { color: '#febc2e', action: handleMinimize },
            { color: '#28c840', action: handleMaximize },
          ].map((btn, i) => (
            <div key={i} onClick={btn.action} style={{
              width: 12, height: 12, borderRadius: '50%',
              background: btn.color, cursor: 'pointer',
              border: '0.5px solid rgba(0,0,0,0.2)',
              transition: 'transform 0.1s',
            }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.15)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 500, opacity: 0.55 }}>
          {project.name}
        </div>
        <div style={{ width: 56 }} />
      </div>

      {/* ── Content ── */}
      <div style={{ padding: 28, overflowY: 'auto', maxHeight: isMaximized ? 'calc(100vh - 74px)' : 434 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
            background: `linear-gradient(135deg, ${project.color}, ${project.colorSecondary})`,
            boxShadow: `0 6px 20px ${project.color}40`,
          }}>
            {project.icon}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {project.name}
            </h2>
            <span style={{ fontSize: 13, opacity: 0.45 }}>{project.category}</span>
          </div>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.75, opacity: 0.72, margin: '0 0 22px 0' }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {project.tech.map((t) => (
            <span key={t} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              background: `${project.color}15`, color: project.color,
              border: `1px solid ${project.color}28`,
            }}>{t}</span>
          ))}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.025)', borderRadius: 10, padding: 18,
          border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{
            fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
            opacity: 0.35, marginBottom: 12, fontWeight: 600,
          }}>
            Fonctionnalités
          </div>
          {project.features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              marginBottom: i < project.features.length - 1 ? 10 : 0,
              fontSize: 13, lineHeight: 1.5, opacity: 0.65,
            }}>
              <span style={{ color: project.color, flexShrink: 0, marginTop: 1 }}>▸</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: `${project.color}18`, color: project.color,
              border: `1px solid ${project.color}30`, textDecoration: 'none',
              transition: 'background 0.15s ease, transform 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${project.color}30`; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${project.color}18`; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            ⌘ Voir sur GitHub
          </a>
        </div>
      </div>
    </div>
  )
})

export default AppWindow
