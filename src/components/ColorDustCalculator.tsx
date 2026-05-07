import { useState, useMemo, useCallback } from 'react'
import { calculateCosts } from '../utils/calculate'
import { colorDustRecipes, COLOR_DUST_MAX_LEVEL } from '../data/colorDustRecipes'
import ResultTable from './ResultTable'

interface CalculatorProps {
  cangbaogePrice: number | null
}

const staminaPerCraft: Record<number, number> = {}
for (let l = 2; l <= COLOR_DUST_MAX_LEVEL; l++) {
  staminaPerCraft[l] = 30 * l
}

export default function ColorDustCalculator({ cangbaogePrice }: CalculatorProps) {
  const [gemPrice, setGemPrice] = useState<number | null>(null)
  const [synthesisCosts, setSynthesisCosts] = useState<Record<number, number>>({})

  const rows = useMemo(() => {
    const price = gemPrice != null && gemPrice > 0 ? gemPrice : 0
    const cbPrice = cangbaogePrice != null && cangbaogePrice > 0 ? cangbaogePrice : 0
    return calculateCosts(colorDustRecipes, COLOR_DUST_MAX_LEVEL, price, cbPrice, synthesisCosts, staminaPerCraft)
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
      <h2 className="section-title">五色灵尘成本计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="dust-price">1级五色灵尘价格（两）</label>
          <input
            id="dust-price"
            type="number"
            className="text-input"
            min="0"
            placeholder="例如: 400000"
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
