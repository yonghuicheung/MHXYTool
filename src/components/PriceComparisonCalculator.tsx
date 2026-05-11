import { useState, useCallback } from 'react'
import Decimal from 'decimal.js'

const FIELDS = [
  { key: 'liang', label: '游戏币', unit: '两', placeholder: '输入游戏币数量' },
  { key: 'dian', label: '点卡', unit: '点', placeholder: '输入点卡数量' },
  { key: 'jingli', label: '精力', unit: '点', placeholder: '输入精力数量' },
  { key: 'yuan', label: '人民币', unit: '元', placeholder: '输入人民币金额' },
] as const

type FieldKey = typeof FIELDS[number]['key']

interface CalculatorProps {
  cangbaogePrice: number | null
}

export default function PriceComparisonCalculator({ cangbaogePrice }: CalculatorProps) {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    liang: '', dian: '', jingli: '', yuan: '',
  })
  const [lastEdited, setLastEdited] = useState<FieldKey | null>(null)

  const cb = cangbaogePrice != null && cangbaogePrice > 0 ? cangbaogePrice : null

  const handleChange = useCallback((key: FieldKey, raw: string) => {
    if (raw === '') {
      setValues({ liang: '', dian: '', jingli: '', yuan: '' })
      setLastEdited(null)
      return
    }
    const v = Number(raw)
    if (isNaN(v) || v < 0) return

    const d = new Decimal(v)
    let liang = ''; let dian = ''; let jingli = ''; let yuan = ''

    if (!cb) {
      // No exchange rate, only convert between dian/jingli/yuan
      if (key === 'dian') {
        dian = d.toString()
        jingli = d.times(10).toString()
        yuan = d.div(10).toString()
      } else if (key === 'jingli') {
        jingli = d.toString()
        dian = d.div(10).toString()
        yuan = d.div(100).toString()
      } else if (key === 'yuan') {
        yuan = d.toString()
        dian = d.times(10).toString()
        jingli = d.times(100).toString()
      }
      // liang can't convert without exchange rate
      if (key === 'liang') {
        liang = raw
      }
    } else {
      const cbD = new Decimal(cb)
      if (key === 'liang') {
        liang = d.toString()
        yuan = d.times(cbD).div(10000).toString()
        dian = d.times(cbD).div(10000).times(10).toString()
        jingli = d.times(cbD).div(10000).times(100).toString()
      } else if (key === 'dian') {
        dian = d.toString()
        yuan = d.div(10).toString()
        jingli = d.times(10).toString()
        liang = d.div(10).div(cbD).times(10000).toString()
      } else if (key === 'jingli') {
        jingli = d.toString()
        dian = d.div(10).toString()
        yuan = d.div(100).toString()
        liang = d.div(100).div(cbD).times(10000).toString()
      } else if (key === 'yuan') {
        yuan = d.toString()
        dian = d.times(10).toString()
        jingli = d.times(100).toString()
        liang = d.div(cbD).times(10000).toString()
      }
    }

    setValues({ liang, dian, jingli, yuan })
    setLastEdited(key)
  }, [cb])

  const formatDisplay = (s: string) => {
    if (s === '') return ''
    const n = new Decimal(s)
    if (n.abs().lt(0.01) && n.abs().gt(0)) return n.toFixed(8)
    return n.toFixed(4)
  }

  return (
    <section className="tool-section">
      <h2 className="section-title">物价对比计算器</h2>

      <div className="price-comp-grid">
        {FIELDS.map((f) => (
          <div key={f.key} className={`price-comp-card ${lastEdited === f.key ? 'price-comp-active' : ''}`}>
            <div className="price-comp-header">
              <span className="price-comp-label">{f.label}</span>
              <span className="price-comp-unit">{f.unit}</span>
            </div>
            <input
              type="number"
              className="price-comp-input"
              min="0"
              placeholder={f.placeholder}
              value={values[f.key]}
              onChange={(e) => handleChange(f.key, e.target.value)}
            />
            {values[f.key] && (
              <div className="price-comp-display">{formatDisplay(values[f.key])}</div>
            )}
          </div>
        ))}
      </div>

      <div className="price-comp-note">
        1元 = 10点卡 = 100精力 &nbsp;|&nbsp; 藏宝阁汇率来源：顶部输入框
      </div>
    </section>
  )
}
