function getModTopics(course) {
  const c = course.toLowerCase()
  if (c.includes('physics')) return ['Quantum Mechanics & Wave Functions','Electron Theory of Metals','Superconductivity','Lasers & Optical Fibers','Quantum Computing']
  if (c.includes('math')) return ['Calculus & Differential Equations','Linear Algebra','Numerical Methods','Probability & Statistics','Complex Analysis']
  if (c.includes('c program') || c.includes('programming in c')) return ['Intro to C & Operators','Control Flow & Functions','Arrays & Strings','Pointers & Structures','File Handling & Miscellaneous']
  if (c.includes('mech')) return ['Engineering Materials','Stress & Strain Analysis','Machine Elements','Thermodynamic Systems','Manufacturing Processes']
  if (c.includes('kannada')) return ['ಗದ್ಯ ಭಾಗ','ಪದ್ಯ ಭಾಗ','ವ್ಯಾಕರಣ','ಪ್ರಬಂಧ ಲೇಖನ','ಸಾಹಿತ್ಯ ಇತಿಹಾಸ']
  return ['Fundamentals & Core Concepts','Advanced Theory & Analysis','Design Methods & Applications','Systems & Implementation','Emerging Trends & Case Studies']
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { branch, courseName, courseCode, examType, modNum } = req.body || {}

  if (!branch || !courseName || !courseCode || !examType || modNum === undefined) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in Vercel environment variables.' })
  }

  const topics = getModTopics(courseName)
  const t = topics[modNum] || `Module ${modNum + 1}`
  const q1 = modNum * 2 + 1
  const q2 = modNum * 2 + 2

  const prompt = `Generate a solved VTU ${examType} paper for:
Branch: ${branch}, Course: ${courseName} (${courseCode}), Module ${modNum + 1}: ${t}

Return ONLY valid JSON, no markdown, no explanation:
{"moduleTitle":"Module ${modNum + 1} — ${t}","qsets":[{"label":"Q${q1} — Main","questions":[{"id":"Q${q1}a","text":"[real 8M VTU question on ${t}]","marks":"8M","answer":[{"type":"section","title":"Concept","content":""},{"type":"text","text":"explanation"},{"type":"math","text":"key formula = derivation"},{"type":"result","text":"✓ Final answer"}]},{"id":"Q${q1}b","text":"[another 8M question]","marks":"8M","answer":[{"type":"list","items":["Point 1","Point 2","Point 3","Point 4"]}]}]},{"label":"Q${q2} — Alternate (OR)","questions":[{"id":"Q${q2}a","text":"[alternate 8M question]","marks":"8M","answer":[{"type":"section","title":"Solution","content":""},{"type":"math","text":"working steps"},{"type":"result","text":"✓ Answer"}]},{"id":"Q${q2}b","text":"[4M numerical]","marks":"4M","answer":[{"type":"math","text":"given + calculation"},{"type":"result","text":"✓ Answer"}]}]}]}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: 'You are a VTU exam solver. Return ONLY valid JSON — no markdown, no text before or after the JSON object.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    if (!response.ok || data.error) {
      return res.status(500).json({ error: data.error?.message || 'Anthropic API error' })
    }

    const text = data.content?.find(b => b.type === 'text')?.text || ''
    return res.status(200).json({ text })

  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` })
  }
}
