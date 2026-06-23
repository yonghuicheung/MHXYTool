import { useState, lazy, Suspense } from 'react'
import Decimal from 'decimal.js'
import ToolSearch from './ToolSearch'

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
      { id: 'clock-stone-calculator', label: '钟灵石', desc: '计算1-8级钟灵石合成成本' },
      { id: 'spirit-stone-calculator', label: '精魄灵石', desc: '计算1-10级精魄灵石合成成本' },
      { id: 'mystic-bead-calculator', label: '玄灵珠', desc: '计算1-8级玄灵珠合成成本' },
    ],
  },
  {
    name: '物价',
    tools: [
      { id: 'price-comparison-calculator', label: '物价对比', desc: '游戏币、点卡、精力、人民币互相换算' },
    ],
  },
  {
    name: '修炼',
    tools: [
      { id: 'pet-cultivation-calculator', label: '召唤兽修炼', desc: '计算修炼经验、修炼果、宠环、秘传次数' },
      { id: 'character-cultivation-calculator', label: '人物修炼', desc: '攻击/法术/猎术/防御/抗法修炼花费计算' },
    ],
  },
  {
    name: '攻略',
    tools: [
      { id: 'guide-pantaoyan', label: '副本·蟠桃宴 ★★★', desc: '天命侠士副本' },
      { id: 'guide-qingqiu', label: '副本·青丘迷雾 ★★★★', desc: '青丘迷雾全流程攻略' },
      { id: 'guide-neidan', label: '任务·内丹点化', desc: '召唤兽内丹点化规律与策略' },
      { id: 'guide-hulao', label: '副本·虎牢魔影 ★★★★', desc: '英雄副本全流程攻略' },
      { id: 'guide-mijing', label: '副本·秘境降妖 ★★★☆', desc: '侠士副本全流程攻略' },
      { id: 'guide-wuxing', label: '副本·五行斗法 ★', desc: '五行斗法全流程攻略' },
      { id: 'guide-jianling', label: '副本·剑陵魔影 ★★★☆', desc: '探索解谜型副本全攻略' },
      { id: 'guide-yiguan', label: '副本·衣冠古丘 ★★★☆', desc: '特殊副本全流程+隐藏任务攻略' },
      { id: 'guide-jindoudong', label: '副本·金兜洞兕大王 ★★☆', desc: '10人协作副本全流程攻略' },
      { id: 'guide-shenqixuzhang', label: '神器·序章', desc: '神器任务序章全流程指南' },
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
    <>
      <nav className="tool-nav">
        <div className="tool-nav-left">
          <h1 className="tool-nav-title" onClick={() => handleSelect('gem-calculator')}><span className="title-full">梦幻西游工具集</span><span className="title-module">{activeLabel}</span></h1>
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
            {wanLiangPerYuan != null && (
              <span className="exchange-hint-mobile">{wanLiangPerYuan.toFixed(4)} 万两/元</span>
            )}
            {sanQianWan != null && (
              <span className="exchange-hint">
                {sanQianWan.toFixed(2)} 元/3000万两 | {liangPerDian.toFixed(2)} 两/点 | {wanLiangPerYuan.toFixed(4)} 万两/元 | {wanLiangPerBaiYuan.toFixed(2)} 万两/百元
              </span>
            )}
          </div>
        </div>
        <div className="tool-nav-right">
          <ToolSearch tools={allTools} onSelect={handleSelect} />
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
      </nav>

      {/* Drawer 移到 nav 外部，避免 sticky 层叠上下文影响 */}
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
    </>
  )
}
