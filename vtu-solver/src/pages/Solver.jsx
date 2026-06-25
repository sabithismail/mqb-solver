import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QCard from '../components/QCard'
import { BRANCHES, EXAM_TYPES, getModuleTopics, parseJSON } from '../lib/utils'

// ─── Input Phase ──────────────────────────────────────────────────────────────

function InputPhase({ onGenerate }) {
  const [branch, setBranch] = useState('AIML')
  const [courseName, setCourseName] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [examType, setExamType] = useState('VTU Final')
  const [error, setError] = useState('')
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  function handleMouseMove(e) {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setTilt({ rotateX: y * -11, rotateY: x * 11 })
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  function submit() {
    if (!courseName.trim() || !courseCode.trim()) {
      setError('Enter course name and code.')
      return
    }
    setError('')
    onGenerate({ branch, courseName: courseName.trim(), courseCode: courseCode.trim().toUpperCase(), examType })
  }

  const inputCls = `w-full bg-white/5 border border-gold/20 rounded-lg px-3.5 py-2.5
    text-cream text-sm outline-none transition-colors duration-200
    focus:border-gold/60 placeholder-slate-500`

  const labelCls = 'block font-mono text-[10px] tracking-[0.18em] text-gold/70 mb-1.5 uppercase'

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6 py-12">
      <motion.p
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="font-mono text-[10px] tracking-[0.22em] text-gold/60 mb-2 text-center"
      >
        YENEPOYA INSTITUTE OF TECHNOLOGY · AIML
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="font-display text-4xl sm:text-5xl font-semibold text-cream mb-3 text-center"
      >
        VTU AI Solver
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
        className="text-slate-400 text-sm mb-10 text-center max-w-xs"
      >
        Enter your course — get a fully solved paper, module by module.
      </motion.p>

      {/* 3D tilt card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
        style={{
          rotateX: tilt.rotateX, rotateY: tilt.rotateY,
          transformStyle: 'preserve-3d', perspective: 900,
          transition: 'transform 0.08s linear',
          width: '100%', maxWidth: 420,
        }}
      >
        <div
          className="bg-navy-card border border-gold/20 rounded-2xl p-8 w-full"
          style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.55)' }}
        >
          {/* Stack effect layers */}
          <div className="absolute inset-0 translate-x-2 translate-y-2 bg-navy-light/30 -z-10 rounded-2xl" />
          <div className="absolute inset-0 translate-x-4 translate-y-4 bg-navy-light/15 -z-20 rounded-2xl" />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className={labelCls}>Branch</label>
              <select value={branch} onChange={e => setBranch(e.target.value)}
                className={inputCls} style={{ cursor: 'pointer' }}>
                {BRANCHES.map(b => <option key={b} value={b} style={{ background: '#1B2A4A' }}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Exam Type</label>
              <select value={examType} onChange={e => setExamType(e.target.value)}
                className={inputCls} style={{ cursor: 'pointer' }}>
                {EXAM_TYPES.map(t => <option key={t} value={t} style={{ background: '#1B2A4A' }}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className={labelCls}>Course Name</label>
            <input
              type="text"
              placeholder="e.g. Quantum Physics and Applications"
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              className={inputCls}
            />
          </div>

          <div className="mb-5">
            <label className={labelCls}>Course Code</label>
            <input
              type="text"
              placeholder="e.g. 1BPHYS102"
              value={courseCode}
              onChange={e => setCourseCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              className={`${inputCls} font-mono`}
            />
          </div>

          {error && <p className="text-red-400 text-xs font-mono mb-3">{error}</p>}

          <button
            onClick={submit}
            className="w-full bg-gold text-navy font-semibold rounded-lg py-3 text-sm
              hover:bg-gold/90 active:scale-[0.98] transition-all duration-150 tracking-wide"
          >
            Generate Solved Paper →
          </button>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="font-mono text-[10px] text-slate-500/50 mt-8 text-center tracking-widest"
      >
        AI-POWERED · VTU 2025–26 SCHEME
      </motion.p>
    </div>
  )
}

// ─── Paper Phase ──────────────────────────────────────────────────────────────

function ModuleContent({ meta, modNum, data, onRetry }) {
  if (!data) return (
    <div className="flex items-center justify-center py-20">
      <p className="font-mono text-sm tracking-[0.15em] text-[#0d1b2a] animate-pulse">
        GENERATING MODULE {modNum + 1}…
      </p>
    </div>
  )

  if (data.error) return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <div style={{
        background: '#fff0f0', border: '1px solid #fcc',
        borderRadius: 8, padding: 16, color: '#c00', fontSize: '0.87rem',
      }}>
        {data.error}
        <button onClick={onRetry} style={{
          marginLeft: 10, background: '#0d1b2a', color: '#f5c842',
          border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer',
        }}>Retry</button>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-5 py-6"
    >
      <div style={{
        fontSize: '1.05rem', fontWeight: 700, color: '#0d1b2a',
        borderLeft: '4px solid #f5c842', paddingLeft: 12, marginBottom: 22,
        fontFamily: "'Spectral', serif",
      }}>
        {data.moduleTitle || `Module ${modNum + 1}`}
      </div>

      {(data.qsets || []).map((qs, qi) => (
        <div key={qi} style={{ marginBottom: 28 }}>
          <p style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: '#888', marginBottom: 10,
          }}>{qs.label}</p>

          {(qs.questions || []).map(q => <QCard key={q.id} q={q} />)}

          {qi < (data.qsets.length - 1) && (
            <div style={{
              textAlign: 'center', color: '#bbb', fontSize: '0.78rem',
              fontWeight: 700, margin: '18px 0', letterSpacing: '2px',
            }}>— OR —</div>
          )}
        </div>
      ))}
    </motion.div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Solver() {
  const [phase, setPhase] = useState('input')
  const [meta, setMeta] = useState(null)
  const [modules, setModules] = useState({})
  const [activeMod, setActiveMod] = useState(0)

  async function loadModule(modNum, m) {
    if (modules[modNum] && !modules[modNum].error) return
    setModules(prev => ({ ...prev, [modNum]: null })) // null = loading

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...m, modNum }),
      })

      const json = await res.json()

      if (json.error) {
        setModules(prev => ({ ...prev, [modNum]: { error: json.error } }))
        return
      }

      const parsed = parseJSON(json.text)
      setModules(prev => ({
        ...prev,
        [modNum]: parsed || { error: 'Could not parse response. Please retry.' },
      }))
    } catch (err) {
      setModules(prev => ({ ...prev, [modNum]: { error: err.message || 'Network error.' } }))
    }
  }

  function handleGenerate(m) {
    setMeta(m)
    setModules({})
    setActiveMod(0)
    setPhase('paper')
    loadModule(0, m)
  }

  function handleModClick(i) {
    setActiveMod(i)
    if (modules[i] === undefined && meta) loadModule(i, meta)
  }

  function handleRetry(i) {
    if (!meta) return
    setModules(prev => { const n = { ...prev }; delete n[i]; return n })
    loadModule(i, meta)
  }

  if (phase === 'input') return <InputPhase onGenerate={handleGenerate} />

  const topics = getModuleTopics(meta.courseName)
  const modData = modules[activeMod]

  return (
    <div style={{ minHeight: '100vh', background: '#f4f4f0', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ background: '#0d1b2a', color: '#f5c842', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: "'Spectral', serif", fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            {meta.courseName} — {meta.courseCode}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#d4b84a', margin: '3px 0 0' }}>
            {meta.branch} · VTU {meta.examType} · AI Solved Paper
          </p>
        </div>
        <button
          onClick={() => setPhase('input')}
          style={{
            background: 'none', border: '1px solid rgba(212,175,55,0.35)',
            color: '#f5c842', borderRadius: 6, padding: '5px 12px',
            cursor: 'pointer', fontSize: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ← New
        </button>
      </div>

      {/* Module nav */}
      <div style={{ background: '#162032', display: 'flex', gap: 4, padding: '8px 16px', flexWrap: 'wrap' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <button key={i} onClick={() => handleModClick(i)} style={{
            background: activeMod === i ? '#f5c842' : 'transparent',
            border: '1px solid', borderColor: activeMod === i ? '#f5c842' : '#2a3a50',
            color: activeMod === i ? '#0d1b2a' : '#8aaed4',
            padding: '5px 13px', borderRadius: 6, cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: activeMod === i ? 700 : 400,
            transition: 'all 0.15s',
          }}>
            Mod {i + 1} — {topics[i].split(' ')[0]}
            {modules[i] && !modules[i]?.error && ' ✓'}
          </button>
        ))}
      </div>

      <ModuleContent
        meta={meta}
        modNum={activeMod}
        data={modData}
        onRetry={() => handleRetry(activeMod)}
      />

      <footer style={{ maxWidth: 780, margin: '0 auto', padding: '0 20px 20px', borderTop: '0.5px solid #ddd', marginTop: 8 }}>
        <p style={{ fontSize: '0.72rem', color: '#aaa', paddingTop: 12, fontFamily: "'JetBrains Mono', monospace" }}>
          Built by Sabith · Yenepoya Institute of Technology · VTU 2025–26
        </p>
      </footer>
    </div>
  )
}
