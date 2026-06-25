import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AnswerBlock from './AnswerBlock'

export default function QCard({ q }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      background: '#fff', border: '0.5px solid #ddd',
      borderRadius: 10, marginBottom: 10, overflow: 'hidden',
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 15px', cursor: 'pointer', userSelect: 'none',
          background: open ? '#fafaf7' : '#fff', transition: 'background 0.15s',
        }}
      >
        <span style={{
          background: '#0d1b2a', color: '#f5c842',
          fontSize: '0.68rem', fontWeight: 700,
          padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap',
        }}>{q.id}</span>
        <p style={{ flex: 1, fontSize: '0.87rem', color: '#1a1a1a', margin: 0, lineHeight: 1.5 }}>{q.text}</p>
        <span style={{
          background: '#f0f0eb', color: '#555', fontSize: '0.68rem',
          padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap',
        }}>{q.marks || '8M'}</span>
        <span style={{
          color: '#aaa', fontSize: 12,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.22s',
        }}>▼</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '13px 17px', borderTop: '0.5px solid #eee', color: '#1a1a1a' }}>
              {(q.answer || []).map((b, i) => (
                <AnswerBlock key={i} block={b} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
