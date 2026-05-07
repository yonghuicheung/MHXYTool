import { useState, useMemo, useCallback } from 'react'
import { calculateCosts } from '../utils/calculate'
import { gemRecipes, MAX_LEVEL } from '../data/gemRecipes'
import ResultTable from './ResultTable'

interface CalculatorProps {
  cangbaogePrice: number | null
}

export default function GemCalculator({ cangbaogePrice }: CalculatorProps) {
  const [gemPrice, setGemPrice] = useState<number | null>(null)
  const [synthesisCosts, setSynthesisCosts] = useState<Record<number, number>>({})

  const rows = useMemo(() => {
    const price = gemPrice != null && gemPrice > 0 ? gemPrice : 0
    const cbPrice = cangbaogePrice != null && cangbaogePrice > 0 ? cangbaogePrice : 0
    return calculateCosts(gemRecipes, MAX_LEVEL, price, cbPrice, synthesisCosts)
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
      <h2 className="section-title">宝石成本计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="gem-price">1级宝石价格（两）</label>
          <input
            id="gem-price"
            type="number"
            className="text-input"
            min="0"
            placeholder="例如: 100000"
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
