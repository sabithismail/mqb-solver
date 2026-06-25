export const BRANCHES = ['AIML', 'CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'CHEM', 'BT']
export const EXAM_TYPES = ['VTU Final', 'Mid-Term 1', 'Mid-Term 2', 'Model Exam']

export function getModuleTopics(courseName) {
  const c = courseName.toLowerCase()
  if (c.includes('physics'))
    return ['Quantum Mechanics & Wave Functions', 'Electron Theory of Metals', 'Superconductivity', 'Lasers & Optical Fibers', 'Quantum Computing']
  if (c.includes('math'))
    return ['Calculus & Differential Equations', 'Linear Algebra', 'Numerical Methods', 'Probability & Statistics', 'Complex Analysis']
  if (c.includes('c program') || c.includes('programming in c'))
    return ['Intro to C & Operators', 'Control Flow & Functions', 'Arrays & Strings', 'Pointers & Structures', 'File Handling & Miscellaneous']
  if (c.includes('mech'))
    return ['Engineering Materials', 'Stress & Strain Analysis', 'Machine Elements', 'Thermodynamic Systems', 'Manufacturing Processes']
  if (c.includes('circuit') || c.includes('network'))
    return ['Circuit Theorems', 'AC Circuits', 'Resonance & Filters', 'Transient Analysis', 'Two-Port Networks']
  if (c.includes('kannada'))
    return ['ಗದ್ಯ ಭಾಗ', 'ಪದ್ಯ ಭಾಗ', 'ವ್ಯಾಕರಣ', 'ಪ್ರಬಂಧ ಲೇಖನ', 'ಸಾಹಿತ್ಯ ಇತಿಹಾಸ']
  return [
    'Fundamentals & Core Concepts',
    'Advanced Theory & Analysis',
    'Design Methods & Applications',
    'Systems & Implementation',
    'Emerging Trends & Case Studies',
  ]
}

export function parseJSON(text) {
  try {
    const clean = text.replace(/```json\n?|```\n?/g, '').trim()
    const s = clean.indexOf('{')
    const e = clean.lastIndexOf('}')
    return JSON.parse(s >= 0 ? clean.slice(s, e + 1) : clean)
  } catch {
    return null
  }
}
