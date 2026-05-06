import { useState, useCallback } from 'react'
import ToolNav from './components/ToolNav'
import GemCalculator from './components/GemCalculator'

export default function App() {
  const [activeTool, setActiveTool] = useState('gem-calculator')
  const [cangbaogePrice, setCangbaogePrice] = useState(null)

  const handleSelectTool = useCallback((toolId) => {
    setActiveTool(toolId)
  }, [])

  const handleCangbaogePriceChange = useCallback((value) => {
    setCangbaogePrice(value)
  }, [])

  return (
    <div className="app">
      <ToolNav
        activeTool={activeTool}
        onSelect={handleSelectTool}
        cangbaogePrice={cangbaogePrice}
        onCangbaogePriceChange={handleCangbaogePriceChange}
      />
      <main className="main-content">
        {activeTool === 'gem-calculator' && (
          <GemCalculator cangbaogePrice={cangbaogePrice} />
        )}
      </main>
    </div>
  )
}
