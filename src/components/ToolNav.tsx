import { useState, lazy, Suspense } from 'react'
import Decimal from 'decimal.js'

const PriceChart = lazy(() => import('./PriceChart'))

interface Tool {
  id: string
  label: string
  desc?: string
  disabled?: boolean
}

interface ToolGroup {
  name: string
  tools: Tool[]
}

const toolGroups: ToolGroup[] = [
  {
    name: '合成成本',
    tools: [
      { id: 'gem-calculator', label: '宝石成本', desc: '计算1-20级宝石合成所需材料和费用' },
      { id: 'star-stone-calculator', label: '星辉石', desc: '计算1-11级星辉石合成成本' },
      { id: 'color-dust-calculator', label: '五色灵尘', desc: '计算1-15级五色灵尘合成成本' },
    ],
  },
  {
    name: '修炼',
    tools: [
      { id: 'pet-cultivation-calculator', label: '召唤兽修炼', desc: '计算修炼经验、修炼果、宠环、秘传次数' },
    ],
  },
]

const allTools = toolGroups.flatMap((g) => g.tools)

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
  const [drawerOpen, setDrawerOpen] = useState(false)

  const activeLabel = allTools.find((t) => t.id === activeTool)?.label ?? ''

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

  const handleSelect = (toolId: string) => {
    onSelect(toolId)
    setDrawerOpen(false)
  }

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
      <div className="tool-nav-right">
        <span className="tool-nav-current">{activeLabel}</span>
        <button
          className={`menu-btn ${drawerOpen ? 'menu-btn-open' : ''}`}
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}
      <div className={`drawer ${drawerOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">功能模块</span>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {drawerOpen && (
          <div className="drawer-body">
            {toolGroups.map((group) => {
              let cardIndex = 0
              return (
                <div key={group.name} className="drawer-group">
                  <h3 className="drawer-group-title">{group.name}</h3>
                  <div className="drawer-cards">
                    {group.tools.map((tool) => {
                      cardIndex++
                      return (
                        <button
                          key={tool.id}
                          className={`drawer-card ${tool.id === activeTool ? 'drawer-card-active' : ''}`}
                          disabled={tool.disabled}
                          style={{ animationDelay: `${0.08 * (cardIndex - 1)}s` }}
                          onClick={() => handleSelect(tool.id)}
                        >
                          <span className="drawer-card-label">{tool.label}</span>
                          {tool.desc && <span className="drawer-card-desc">{tool.desc}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showChart && (
        <Suspense fallback={null}>
          <PriceChart onClose={() => setShowChart(false)} />
        </Suspense>
      )}
    </nav>
  )
}
