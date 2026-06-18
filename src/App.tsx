import { useState, useCallback, useEffect } from 'react'
import Decimal from 'decimal.js'
import ToolNav from './components/ToolNav'
import GemCalculator from './components/GemCalculator'
import StarStoneCalculator from './components/StarStoneCalculator'
import ColorDustCalculator from './components/ColorDustCalculator'
import ClockStoneCalculator from './components/ClockStoneCalculator'
import SpiritStoneCalculator from './components/SpiritStoneCalculator'
import MysticBeadCalculator from './components/MysticBeadCalculator'
import PetCultivationCalculator from './components/PetCultivationCalculator'
import CharacterCultivationCalculator from './components/CharacterCultivationCalculator'
import PriceComparisonCalculator from './components/PriceComparisonCalculator'
import GuideViewer from './components/GuideViewer'

// 攻略列表：id / label / markdown文件路径
const guides: Record<string, string> = {
  'guide-pantaoyan': 'guides/蟠桃宴.md',
  'guide-qingqiu': 'guides/青丘迷雾.md',
}

export default function App() {
  const [activeTool, setActiveTool] = useState('gem-calculator')
  const [cangbaogePrice, setCangbaogePrice] = useState<number | null>(null)
  const [dailyChange, setDailyChange] = useState<number | null>(null)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'price-history.json')
      .then((res) => res.json())
      .then((data: Array<{ date: string; prices: Array<{ time: string; value: number }> }>) => {
        if (data.length > 0) {
          const lastPrices = data[data.length - 1].prices
          const lastPrice = lastPrices[lastPrices.length - 1].value
          setCangbaogePrice(lastPrice)
          if (data.length >= 2) {
            const prevPrices = data[data.length - 2].prices
            const prevPrice = prevPrices[prevPrices.length - 1].value
            setDailyChange(new Decimal(lastPrice).minus(prevPrice).times(3000).toNumber())
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
        {activeTool === 'clock-stone-calculator' && (
          <ClockStoneCalculator cangbaogePrice={cangbaogePrice} />
        )}
        {activeTool === 'spirit-stone-calculator' && (
          <SpiritStoneCalculator cangbaogePrice={cangbaogePrice} />
        )}
        {activeTool === 'mystic-bead-calculator' && (
          <MysticBeadCalculator cangbaogePrice={cangbaogePrice} />
        )}
        {activeTool === 'pet-cultivation-calculator' && (
          <PetCultivationCalculator />
        )}
        {activeTool === 'character-cultivation-calculator' && (
          <CharacterCultivationCalculator />
        )}
        {activeTool === 'price-comparison-calculator' && (
          <PriceComparisonCalculator cangbaogePrice={cangbaogePrice} />
        )}
        {guides[activeTool] && (
          <GuideViewer guidePath={guides[activeTool]} />
        )}
      </main>
    </div>
  )
}
