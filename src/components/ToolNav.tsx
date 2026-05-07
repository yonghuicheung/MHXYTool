import { useState, lazy, Suspense } from 'react'
import Decimal from 'decimal.js'

const PriceChart = lazy(() => import('./PriceChart'))

interface Tool {
  id: string
  label: string
  disabled?: boolean
}

const tools: Tool[] = [
  { id: 'gem-calculator', label: '宝石成本' },
  { id: 'star-stone-calculator', label: '星辉石' },
  { id: 'color-dust-calculator', label: '五色灵尘' },
  { id: 'pet-cultivation-calculator', label: '召唤兽修炼' },
]

interface ToolNavProps {
  activeTool: string
  onSelect: (toolId: string) => void
  cangbaogePrice: number | null
  dailyChange: number | null
  onCangbaogePriceChange: (value: number | null) => void
}

function formatChange(d: number): string {
  if (Math.abs(d) < 0.005) return '0'
  const abs = Math.abs(d)
  const s = new Decimal(abs).toFixed(2)
  if (d > 0) return `+${s}`
  return `-${s}`
}

function changeColor(d: number): string {
  if (Math.abs(d) < 0.005) return '#2563eb'
  if (d > 0) return '#dc2626'
  return '#16a34a'
}

export default function ToolNav({ activeTool, onSelect, cangbaogePrice, dailyChange, onCangbaogePriceChange }: ToolNavProps) {
  const [showChart, setShowChart] = useState(false)
  const sanQianWan = cangbaogePrice != null && cangbaogePrice > 0
    ? new Decimal(cangbaogePrice).times(3000).toNumber()
    : null
  const liangPerDian = cangbaogePrice != null && cangbaogePrice > 0
    ? new Decimal(1000).div(cangbaogePrice).toNumber()
    : null
  const wanLiangPerYuan = cangbaogePrice != null && cangbaogePrice > 0
    ? new Decimal(1).div(cangbaogePrice).toNumber()
    : null
  const wanLiangPerBaiYuan = cangbaogePrice != null && cangbaogePrice > 0
    ? new Decimal(100).div(cangbaogePrice).toNumber()
    : null

  return (
    <nav className="tool-nav">
      <div className="tool-nav-left">
        <h1 className="tool-nav-title">梦幻西游工具集</h1>
        <div className="tool-nav-exchange">
          <span className="exchange-input-wrapper">
            <input
              type="number"
              className="exchange-input"
              min="0"
              step="0.01"
              placeholder="藏宝阁价格"
              value={cangbaogePrice ?? ''}
              onChange={(e) => onCangbaogePriceChange(e.target.value === '' ? null : Number(e.target.value))}
            />
            <span className="exchange-suffix">元/万两</span>
          </span>
          <button
            className="chart-trigger"
            title="金价走势"
            onClick={() => setShowChart(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 17 9 11 13 15 21 5" />
              <polyline points="21 5 14 5 21 5 21 12" />
            </svg>
          </button>
          {dailyChange != null && (
            <span className="daily-change" style={{ color: changeColor(dailyChange) }}>
              {formatChange(dailyChange)}
            </span>
          )}
          {sanQianWan != null && (
            <span className="exchange-hint">
              {sanQianWan.toFixed(2)} 元/3000万两 | {liangPerDian.toFixed(2)} 两/点 | {wanLiangPerYuan.toFixed(4)} 万两/元 | {wanLiangPerBaiYuan.toFixed(2)} 万两/百元
            </span>
          )}
        </div>
      </div>
      <div className="tool-nav-tabs">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-nav-tab ${tool.id === activeTool ? 'active' : ''}`}
            disabled={tool.disabled}
            onClick={() => onSelect(tool.id)}
          >
            {tool.label}
          </button>
        ))}
      </div>
      {showChart && (
        <Suspense fallback={null}>
          <PriceChart onClose={() => setShowChart(false)} />
        </Suspense>
      )}
    </nav>
  )
}
