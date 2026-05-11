import { useState, useCallback } from 'react'
import Decimal from 'decimal.js'

type FieldKey = 'liang' | 'dian' | 'jingli' | 'yuan'

interface CalculatorProps {
  cangbaogePrice: number | null
}

function formatAmount(s: string): string {
  if (!s) return ''
  const n = new Decimal(s)
  if (n.abs().lt(0.01) && n.abs().gt(0)) return n.toFixed(8)
  const parts = n.toFixed(2).split('.')
  parts[0] = Number(parts[0]).toLocaleString('zh-CN')
  return parts.join('.')
}

export default function PriceComparisonCalculator({ cangbaogePrice }: CalculatorProps) {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    liang: '', dian: '', jingli: '', yuan: '',
  })
  const [lastEdited, setLastEdited] = useState<FieldKey | null>(null)
  const [liangUnit, setLiangUnit] = useState<'liang' | 'wan'>('liang')

  const liangUnitLabel = liangUnit === 'wan' ? '万两' : '两'

  const toggleUnit = (unit: typeof liangUnit) => {
    if (unit === liangUnit || !values.liang) {
      setLiangUnit(unit)
      return
    }
    const d = new Decimal(values.liang)
    if (liangUnit === 'liang' && unit === 'wan') {
      setValues(v => ({ ...v, liang: d.div(10000).toString() }))
    } else if (liangUnit === 'wan' && unit === 'liang') {
      setValues(v => ({ ...v, liang: d.times(10000).toString() }))
    }
    setLiangUnit(unit)
  }

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

    // Apply unit multiplier for liang input
    const getLiang = (val: Decimal) => liangUnit === 'wan' ? val.times(10000) : val
    const getLiangDisplay = (val: Decimal) => liangUnit === 'wan' ? val.div(10000) : val

    if (!cb) {
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
      if (key === 'liang') {
        liang = getLiang(d).toString()
      }
    } else {
      const cbD = new Decimal(cb)
      if (key === 'liang') {
        const liangD = getLiang(d)
        liang = liangD.toString()
        yuan = liangD.times(cbD).div(10000).toString()
        dian = liangD.times(cbD).div(10000).times(10).toString()
        jingli = liangD.times(cbD).div(10000).times(100).toString()
      } else if (key === 'dian') {
        dian = d.toString()
        yuan = d.div(10).toString()
        jingli = d.times(10).toString()
        const liangD = d.div(10).div(cbD).times(10000)
        liang = getLiangDisplay(liangD).toString()
      } else if (key === 'jingli') {
        jingli = d.toString()
        dian = d.div(10).toString()
        yuan = d.div(100).toString()
        const liangD = d.div(100).div(cbD).times(10000)
        liang = getLiangDisplay(liangD).toString()
      } else if (key === 'yuan') {
        yuan = d.toString()
        dian = d.times(10).toString()
        jingli = d.times(100).toString()
        const liangD = d.div(cbD).times(10000)
        liang = getLiangDisplay(liangD).toString()
      }
    }

    setValues({ liang, dian, jingli, yuan })
    setLastEdited(key)
  }, [cb, liangUnit])

  return (
    <section className="tool-section">
      <h2 className="section-title">物价对比计算器</h2>

      <div className="price-comp-grid">
        {/* Game currency card */}
        <div className={`price-comp-card ${lastEdited === 'liang' ? 'price-comp-active' : ''}`}>
          <div className="price-comp-header">
            <span className="price-comp-label">游戏币</span>
            <div className="price-comp-toggle">
              <button
                className={`price-comp-toggle-btn ${liangUnit === 'liang' ? 'active' : ''}`}
                onClick={() => toggleUnit('liang')}
              >两</button>
              <button
                className={`price-comp-toggle-btn ${liangUnit === 'wan' ? 'active' : ''}`}
                onClick={() => toggleUnit('wan')}
              >万两</button>
            </div>
          </div>
          <input
            type="number"
            className="price-comp-input"
            min="0"
            placeholder={`输入游戏币数量（${liangUnit === 'wan' ? '万两' : '两'}）`}
            value={values.liang}
            onChange={(e) => handleChange('liang', e.target.value)}
          />
          {values.liang && (
            <div className="price-comp-display">{formatAmount(values.liang)} {liangUnitLabel}</div>
          )}
        </div>

        {/* Other cards */}
        {([
          { key: 'dian' as FieldKey, label: '点卡', unit: '点', placeholder: '输入点卡数量' },
          { key: 'jingli' as FieldKey, label: '精力', unit: '点', placeholder: '输入精力数量' },
          { key: 'yuan' as FieldKey, label: '人民币', unit: '元', placeholder: '输入人民币金额' },
        ]).map((f) => (
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
              <div className="price-comp-display">{formatAmount(values[f.key])} {f.unit}</div>
            )}
          </div>
        ))}
      </div>

      {Object.values(values).every(v => !v) && (
        <p className="price-comp-empty">在任意输入框中输入数值，其他项将自动换算</p>
      )}
      <div className="price-comp-note">
        1元 = 10点卡 = 100精力 &nbsp;|&nbsp; 藏宝阁汇率来源：顶部输入框
      </div>
    </section>
  )
}
