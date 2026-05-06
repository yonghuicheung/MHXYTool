import { useState, useCallback } from 'react'
import ToolNav from './components/ToolNav'
import GemCalculator from './components/GemCalculator'

export default function App() {
  const [activeTool, setActiveTool] = useState('gem-calculator')

  const handleSelectTool = useCallback((toolId) => {
    setActiveTool(toolId)
    const el = document.getElementById(toolId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="app">
      <ToolNav activeTool={activeTool} onSelect={handleSelectTool} />
      <main className="main-content">
        <GemCalculator />
      </main>
    </div>
  )
}
