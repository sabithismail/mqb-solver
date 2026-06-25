export const config = { runtime: 'edge' }

function getModTopics(course) {
  const c = course.toLowerCase()
  if (c.includes('physics')) return ['Quantum Mechanics & Wave Functions','Electron Theory of Metals','Superconductivity','Lasers & Optical Fibers','Quantum Computing']
  if (c.includes('math')) return ['Calculus & Differential Equations','Linear Algebra','Numerical Methods','Probability & Statistics','Complex Analysis']
  if (c.includes('c program') || c.includes('programming in c')) return ['Intro to C & Operators','Control Flow & Functions','Arrays & Strings','Pointers & Structures','File Handling & Miscellaneous']
  if (c.includes('mech')) return ['Engineering Materials','Stress & Strain Analysis','Machine Elements','Thermodynamic Systems','Manufacturing Processes']
  if (c.includes('circuit') || c.includes('network')) return ['Circuit Theorems','AC Circuits','Resonance & Filters','Transient Analysis','Two-Port Networks']
  if (c.includes('kannada')) return ['ಗದ್ಯ ಭಾಗ','ಪದ್ಯ ಭಾಗ','ವ್ಯಾಕರಣ','ಪ್ರಬಂಧ ಲೇಖನ','ಸಾಹಿತ್ಯ ಇತಿಹಾಸ']
  return ['Fundamentals & Core Concepts','Advanced Theory & Analysis','Design Methods & Applications','Systems & Implementation','Emerging Trends & Case Studies']
}

function buildPrompt(branch, courseName, courseCode, examType, modNum) {
  const topics = getModTopics(courseName)
  const t = topics[modNum]
  const q1 = modNum * 2 + 1
  const q2 = modNum * 2 + 2

  return `Generate a solved VTU ${examType} paper module for:
Branch: ${branch}
Course: ${courseName} (${courseCode})
Module ${modNum + 1}: ${t}

Return ONLY this JSON structure, nothing else — no markdown, no explanation:
{
  "moduleTitle": "Module ${modNum + 1} — ${t}",
  "qsets": [
    {
      "label": "Q${q1} — Main",
      "questions": [
        {
          "id": "Q${q1}a",
          "text": "<a real 8-mark VTU question on ${t}>",
          "marks": "8M",
          "answer": [
            { "type": "section", "title": "<section name>", "content": "" },
            { "type": "text", "text": "<explanation>" },
            { "type": "math", "text": "<formula or derivation step by step>" },
            { "type": "result", "text": "✓ <final answer>" }
          ]
        },
        {
          "id": "Q${q1}b",
          "text": "<another real 8-mark question on ${t}>",
          "marks": "8M",
          "answer": [
            { "type": "section", "title": "<section>", "content": "" },
            { "type": "list", "items": ["<detailed point 1>", "<detailed point 2>", "<detailed point 3>", "<detailed point 4>"] }
          ]
        }
      ]
    },
    {
      "label": "Q${q2} — Alternate (OR)",
      "questions": [
        {
          "id": "Q${q2}a",
          "text": "<alternate 8-mark question on ${t}>",
          "marks": "8M",
          "answer": [
            { "type": "section", "title": "<section>", "content": "" },
            { "type": "math", "text": "<step-by-step working>" },
            { "type": "result", "text": "✓ <answer>" }
          ]
        },
        {
          "id": "Q${q2}b",
          "text": "<4-mark numerical or short question on ${t}>",
          "marks": "4M",
          "answer": [
            { "type": "math", "text": "<given values and calculation>" },
            { "type": "result", "text": "✓ <numerical result>" }
          ]
        }
      ]
    }
  ]
}`
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
  }

  const { branch, courseName, courseCode, examType, modNum } = body

  if (!branch || !courseName || !courseCode || !examType || modNum === undefined) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server not configured — add ANTHROPIC_API_KEY to Vercel env vars' }), { status: 500 })
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: 'You are a VTU exam paper solver. Generate realistic, accurate solved exam questions. Return ONLY valid JSON — no markdown fences, no explanation, no text before or after the JSON object.',
      messages: [{ role: 'user', content: buildPrompt(branch, courseName, courseCode, examType, modNum) }],
    }),
  })

  const data = await anthropicRes.json()

  if (data.error) {
    return new Response(JSON.stringify({ error: data.error.message }), { status: 500 })
  }

  const rawText = data.content?.find(b => b.type === 'text')?.text || ''

  return new Response(JSON.stringify({ text: rawText }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
