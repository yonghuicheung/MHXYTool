import { useState, useMemo, useCallback } from 'react'
import { calculateCosts } from '../utils/calculate'
import { starStoneRecipes, STAR_STONE_MAX_LEVEL } from '../data/starStoneRecipes'
import ResultTable from './ResultTable'

interface CalculatorProps {
  cangbaogePrice: number | null
}

const staminaPerCraft: Record<number, number> = {}
for (let l = 2; l <= STAR_STONE_MAX_LEVEL; l++) {
  staminaPerCraft[l] = 30 * l
}

export default function StarStoneCalculator({ cangbaogePrice }: CalculatorProps) {
  const [gemPrice, setGemPrice] = useState<number | null>(null)
  const [synthesisCosts, setSynthesisCosts] = useState<Record<number, number>>({})

  const rows = useMemo(() => {
    const price = gemPrice != null && gemPrice > 0 ? gemPrice : 0
    const cbPrice = cangbaogePrice != null && cangbaogePrice > 0 ? cangbaogePrice : 0
    return calculateCosts(starStoneRecipes, STAR_STONE_MAX_LEVEL, price, cbPrice, synthesisCosts, staminaPerCraft)
  }, [gemPrice, cangbaogePrice, synthesisCosts])

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
      <h2 className="section-title">星辉石成本计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="star-stone-price">1级星辉石价格（两）</label>
          <input
            id="star-stone-price"
            type="number"
            className="text-input"
            min="0"
            placeholder="例如: 150000"
            value={gemPrice ?? ''}
            onChange={(e) => setGemPrice(e.target.value === '' ? null : Number(e.target.value))}
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
