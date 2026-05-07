import { useState, useCallback, useEffect } from 'react'
import Decimal from 'decimal.js'
import ToolNav from './components/ToolNav'
import GemCalculator from './components/GemCalculator'
import StarStoneCalculator from './components/StarStoneCalculator'
import ColorDustCalculator from './components/ColorDustCalculator'

export default function App() {
  const [activeTool, setActiveTool] = useState('gem-calculator')
  const [cangbaogePrice, setCangbaogePrice] = useState<number | null>(null)
  const [dailyChange, setDailyChange] = useState<number | null>(null)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'price-history.json')
      .then((res) => res.json())
      .then((data: Array<{ date: string; price: number }>) => {
        if (data.length > 0) {
          const last = data[data.length - 1]
          setCangbaogePrice(last.price)
          if (data.length >= 2) {
            const prev = data[data.length - 2]
            setDailyChange(new Decimal(last.price).minus(prev.price).times(3000).toNumber())
          }
        }
      })
      .catch(() => {})
  }, [])

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
        dailyChange={dailyChange}
        onCangbaogePriceChange={handleCangbaogePriceChange}
      />
      <main className="main-content">
        {activeTool === 'gem-calculator' && (
          <GemCalculator cangbaogePrice={cangbaogePrice} />
        )}
        {activeTool === 'star-stone-calculator' && (
          <StarStoneCalculator cangbaogePrice={cangbaogePrice} />
        )}
        {activeTool === 'color-dust-calculator' && (
          <ColorDustCalculator cangbaogePrice={cangbaogePrice} />
        )}
      </main>
    </div>
  )
}
