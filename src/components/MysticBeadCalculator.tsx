import { useState, useMemo } from 'react'
import { calculateCosts } from '../utils/calculate'
import { mysticBeadRecipes, MAX_LEVEL } from '../data/mysticBeadRecipes'
import ResultTable from './ResultTable'

interface CalculatorProps {
  cangbaogePrice: number | null
}

const staminaPerCraft: Record<number, number> = {}
const fixedSynthesisCosts: Record<number, number> = {}
for (let l = 2; l <= MAX_LEVEL; l++) {
  staminaPerCraft[l] = 20 * (l - 1)
  fixedSynthesisCosts[l] = (l - 1) * (l - 1) * 10000
}

export default function MysticBeadCalculator({ cangbaogePrice }: CalculatorProps) {
  const [beadPrice, setBeadPrice] = useState<number | null>(null)

  const rows = useMemo(() => {
    const price = beadPrice != null && beadPrice > 0 ? beadPrice : 0
    const cbPrice = cangbaogePrice != null && cangbaogePrice > 0 ? cangbaogePrice : 0
    return calculateCosts(mysticBeadRecipes, MAX_LEVEL, price, cbPrice, fixedSynthesisCosts, staminaPerCraft)
  }, [beadPrice, cangbaogePrice])

  return (
    <section className="tool-section">
      <h2 className="section-title">玄灵珠成本计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="bead-price">1级玄灵珠价格（两）</label>
          <input
            id="bead-price"
            type="number"
            className="text-input"
            min="0"
            placeholder="例如: 100000"
            value={beadPrice ?? ''}
            onChange={(e) => setBeadPrice(e.target.value === '' ? null : Number(e.target.value))}
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
