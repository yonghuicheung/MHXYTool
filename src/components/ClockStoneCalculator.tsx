import { useState, useMemo } from 'react'
import { calculateCosts } from '../utils/calculate'
import { clockStoneRecipes, MAX_LEVEL } from '../data/clockStoneRecipes'
import ResultTable from './ResultTable'

interface CalculatorProps {
  cangbaogePrice: number | null
}

const staminaPerCraft: Record<number, number> = {}
const fixedSynthesisCosts: Record<number, number> = {}
for (let l = 2; l <= MAX_LEVEL; l++) {
  staminaPerCraft[l] = 10 * (l - 1)
  fixedSynthesisCosts[l] = (l - 1) * (l - 1) * 10000
}

export default function ClockStoneCalculator({ cangbaogePrice }: CalculatorProps) {
  const [stonePrice, setStonePrice] = useState<number | null>(null)

  const rows = useMemo(() => {
    const price = stonePrice != null && stonePrice > 0 ? stonePrice : 0
    const cbPrice = cangbaogePrice != null && cangbaogePrice > 0 ? cangbaogePrice : 0
    return calculateCosts(clockStoneRecipes, MAX_LEVEL, price, cbPrice, fixedSynthesisCosts, staminaPerCraft)
  }, [stonePrice, cangbaogePrice])

  return (
    <section className="tool-section">
      <h2 className="section-title">钟灵石成本计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="stone-price">1级钟灵石价格（两）</label>
          <input
            id="stone-price"
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
        synthesisCosts={{}}
        onSynthesisCostChange={() => {}}
        fixedSynthesisCosts={fixedSynthesisCosts}
      />
    </section>
  )
}
