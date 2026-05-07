interface Tool {
  id: string
  label: string
  disabled?: boolean
}

const tools: Tool[] = [
  { id: 'gem-calculator', label: '宝石成本' },
  { id: 'star-stone-calculator', label: '星辉石' },
  { id: 'tool-3', label: '工具3', disabled: true },
]

interface ToolNavProps {
  activeTool: string
  onSelect: (toolId: string) => void
  cangbaogePrice: number | null
  onCangbaogePriceChange: (value: number | null) => void
}

export default function ToolNav({ activeTool, onSelect, cangbaogePrice, onCangbaogePriceChange }: ToolNavProps) {
  const sanQianWan = cangbaogePrice != null && cangbaogePrice > 0
    ? cangbaogePrice * 3000
    : null
  const liangPerDian = cangbaogePrice != null && cangbaogePrice > 0
    ? 1000 / cangbaogePrice
    : null
  const wanLiangPerYuan = cangbaogePrice != null && cangbaogePrice > 0
    ? 1 / cangbaogePrice
    : null
  const wanLiangPerBaiYuan = cangbaogePrice != null && cangbaogePrice > 0
    ? 100 / cangbaogePrice
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
    </nav>
  )
}
