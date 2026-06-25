export default function AnswerBlock({ block: b }) {
  if (b.type === 'section') return (
    <div className="mb-3">
      <span style={{
        background: '#0d1b2a', color: '#f5c842', fontSize: '0.7rem',
        fontWeight: 700, padding: '2px 9px', borderRadius: 4,
        display: 'inline-block', marginBottom: 5, fontFamily: 'inherit',
      }}>{b.title}</span>
      {b.content && <p style={{ fontSize: '0.88rem', marginBottom: 4 }}>{b.content}</p>}
    </div>
  )

  if (b.type === 'math') return (
    <pre style={{
      background: '#f7f6f0', borderLeft: '3px solid #f5c842',
      borderRadius: '0 5px 5px 0', padding: '8px 13px', margin: '7px 0',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      fontSize: '0.82rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6,
    }}>{b.text}</pre>
  )

  if (b.type === 'result') return (
    <div style={{
      background: '#0d1b2a', color: '#f5c842', borderRadius: 6,
      padding: '5px 13px', fontWeight: 700, fontSize: '0.88rem',
      display: 'inline-block', margin: '5px 0',
    }}>{b.text}</div>
  )

  if (b.type === 'note') return (
    <div style={{
      background: '#fffbe6', border: '0.5px solid #f0d060',
      borderRadius: 6, padding: '6px 10px', fontSize: '0.8rem',
      color: '#665500', margin: '5px 0',
    }}>{b.text}</div>
  )

  if (b.type === 'list') return (
    <ul style={{ paddingLeft: '1.3rem', marginBottom: 6 }}>
      {(b.items || []).map((item, i) => (
        <li key={i} style={{ marginBottom: 3, fontSize: '0.87rem', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  )

  if (b.type === 'table') return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', margin: '8px 0' }}>
      <thead>
        <tr>{(b.headers || []).map((h, i) => (
          <th key={i} style={{
            background: '#f0f0eb', fontWeight: 600, textAlign: 'left',
            padding: '6px 9px', border: '0.5px solid #ddd',
          }}>{h}</th>
        ))}</tr>
      </thead>
      <tbody>
        {(b.rows || []).map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={{
                padding: '5px 9px', border: '0.5px solid #ddd',
                background: i % 2 ? '#fafaf7' : 'white',
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return <p style={{ fontSize: '0.88rem', marginBottom: 5, lineHeight: 1.65 }}>{b.text}</p>
}
