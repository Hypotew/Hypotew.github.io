import { useState, useRef, useCallback, memo } from 'react'

const DockIcon = memo(function DockIcon({ project, isOpen, mouseX, onOpen }) {
  const iconRef = useRef(null)
  const [hovering, setHovering] = useState(false)

  let scale = 1
  if (mouseX !== null && iconRef.current) {
    const rect = iconRef.current.getBoundingClientRect()
    const iconCenter = rect.left + rect.width / 2
    const distance = Math.abs(mouseX - iconCenter)
    if (distance < 120) scale = 1 + 0.5 * (1 - distance / 120)
  }
  const translateY = -(scale - 1) * 26

  const handleOpen = useCallback(() => onOpen(project.id), [onOpen, project.id])

  return (
    <div
      ref={iconRef}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', cursor: 'pointer',
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleOpen}
    >
      {/* Tooltip */}
      {hovering && (
        <div style={{
          position: 'absolute', top: -50,
          background: 'rgba(15, 15, 25, 0.9)',
          color: '#fff', padding: '4px 10px', borderRadius: 6,
          fontSize: 11, whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          transform: `translateY(${translateY}px)`,
          transition: 'transform 0.15s ease',
        }}>
          {project.name}
        </div>
      )}

      {/* Icon */}
      <div style={{
        width: 50, height: 50, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
        background: `linear-gradient(135deg, ${project.color}, ${project.colorSecondary})`,
        boxShadow: hovering
          ? `0 8px 25px ${project.color}55, 0 0 15px ${project.color}33`
          : '0 2px 8px rgba(0,0,0,0.4)',
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transition: 'box-shadow 0.2s ease',
        willChange: 'transform',
      }}>
        {project.icon}
      </div>

      {/* Open indicator dot */}
      {isOpen && (
        <div style={{
          width: 4, height: 4, borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          marginTop: 3,
          transform: `translateY(${translateY}px)`,
        }} />
      )}
    </div>
  )
})

export default function Dock({ projects, openWindows, onOpen }) {
  const [mouseX, setMouseX] = useState(null)
  const rafRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const x = e.clientX
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      setMouseX(x)
      rafRef.current = null
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    setMouseX(null)
  }, [])

  return (
    <div
      style={{
        position: 'fixed', bottom: 6, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'flex-end', gap: 10,
        padding: '6px 14px 8px',
        background: 'rgba(30, 30, 45, 0.55)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.1)',
        zIndex: 9998,
        pointerEvents: 'auto',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {projects.map((p) => (
        <DockIcon
          key={p.id}
          project={p}
          isOpen={openWindows.includes(p.id)}
          mouseX={mouseX}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}
