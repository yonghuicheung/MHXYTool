import { useState, useMemo, useCallback } from 'react'
import { calculateCosts } from '../utils/calculate'
import { spiritStoneRecipes, MAX_LEVEL } from '../data/spiritStoneRecipes'
import ResultTable from './ResultTable'

interface CalculatorProps {
  cangbaogePrice: number | null
}

const staminaPerCraft: Record<number, number> = {
  2: 20, 3: 30, 4: 40, 5: 50, 6: 60, 7: 70, 8: 80, 9: 80, 10: 80,
}

export default function SpiritStoneCalculator({ cangbaogePrice }: CalculatorProps) {
  const [stonePrice, setStonePrice] = useState<number | null>(null)
  const [synthesisCosts, setSynthesisCosts] = useState<Record<number, number>>({})

  const rows = useMemo(() => {
    const price = stonePrice != null && stonePrice > 0 ? stonePrice : 0
    const cbPrice = cangbaogePrice != null && cangbaogePrice > 0 ? cangbaogePrice : 0
    return calculateCosts(spiritStoneRecipes, MAX_LEVEL, price, cbPrice, synthesisCosts, staminaPerCraft)
  }, [stonePrice, cangbaogePrice, synthesisCosts])

  const handleSynthesisCostChange = useCallback((level: number, value: number | null) => {
    setSynthesisCosts((prev) => {
      const next = { ...prev }
      if (value === null || value < 0) {
        delete next[level]
      } else {
        next[level] = value
      }
      return next
    })
  }, [])

  return (
    <section className="tool-section">
      <h2 className="section-title">精魄灵石成本计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="spirit-stone-price">1级精魄灵石价格（两）</label>
          <input
            id="spirit-stone-price"
            type="number"
            className="text-input"
            min="0"
            placeholder="例如: 100000"
            value={stonePrice ?? ''}
            onChange={(e) => setStonePrice(e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>
      </div>

      <ResultTable
        rows={rows}
        synthesisCosts={synthesisCosts}
        onSynthesisCostChange={handleSynthesisCostChange}
      />
    </section>
  )
}
