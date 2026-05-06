import { useState, useMemo, useCallback } from 'react'
import { calculateCosts, get3000wanPrice } from '../utils/calculate'
import ResultTable from './ResultTable'

export default function GemCalculator() {
  const [gemPrice, setGemPrice] = useState(null)
  const [cangbaogePrice, setCangbaogePrice] = useState(null)
  const [synthesisCosts, setSynthesisCosts] = useState({})

  const rows = useMemo(() => {
    if (gemPrice == null || cangbaogePrice == null || gemPrice <= 0 || cangbaogePrice <= 0) {
      return []
    }
    return calculateCosts(gemPrice, cangbaogePrice, synthesisCosts)
  }, [gemPrice, cangbaogePrice, synthesisCosts])

  const handleSynthesisCostChange = useCallback((level, value) => {
    setSynthesisCosts((prev) => {
      const next = { ...prev }
      if (value === null || value === '' || value < 0) {
        delete next[level]
      } else {
        next[level] = value
      }
      return next
    })
  }, [])

  const sanQianWanPrice = cangbaogePrice != null && cangbaogePrice > 0
    ? get3000wanPrice(cangbaogePrice)
    : null

  return (
    <section id="gem-calculator" className="tool-section">
      <h2 className="section-title">宝石成本计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="gem-price">1级宝石价格（两）</label>
          <input
            id="gem-price"
            type="number"
            className="text-input"
            min="0"
            placeholder="例如: 80000"
            value={gemPrice ?? ''}
            onChange={(e) => setGemPrice(e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="cangbaoge-price">藏宝阁价格（元/万两）</label>
          <input
            id="cangbaoge-price"
            type="number"
            className="text-input"
            min="0"
            step="0.01"
            placeholder="例如: 12.5"
            value={cangbaogePrice ?? ''}
            onChange={(e) => setCangbaogePrice(e.target.value === '' ? null : Number(e.target.value))}
          />
          {sanQianWanPrice != null && (
            <span className="conversion-hint">
              ≈ {sanQianWanPrice.toFixed(2)} 元/3000万两
            </span>
          )}
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
