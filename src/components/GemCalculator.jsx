import { useState, useMemo, useCallback } from 'react'
import { calculateCosts } from '../utils/calculate'
import ResultTable from './ResultTable'

export default function GemCalculator({ cangbaogePrice }) {
  const [gemPrice, setGemPrice] = useState(null)
  const [synthesisCosts, setSynthesisCosts] = useState({})

  const rows = useMemo(() => {
    const price = gemPrice != null && gemPrice > 0 ? gemPrice : 0
    const cbPrice = cangbaogePrice != null && cangbaogePrice > 0 ? cangbaogePrice : 0
    return calculateCosts(price, cbPrice, synthesisCosts)
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
            placeholder="例如: 80000"
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
