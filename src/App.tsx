import { useState, useCallback } from 'react'
import ToolNav from './components/ToolNav'
import GemCalculator from './components/GemCalculator'
import StarStoneCalculator from './components/StarStoneCalculator'

export default function App() {
  const [activeTool, setActiveTool] = useState('gem-calculator')
  const [cangbaogePrice, setCangbaogePrice] = useState<number | null>(null)

  const handleSelectTool = useCallback((toolId: string) => {
    setActiveTool(toolId)
  }, [])

  const handleCangbaogePriceChange = useCallback((value: number | null) => {
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
        {activeTool === 'star-stone-calculator' && (
          <StarStoneCalculator cangbaogePrice={cangbaogePrice} />
        )}
      </main>
    </div>
  )
}
