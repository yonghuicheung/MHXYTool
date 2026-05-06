const tools = [
  { id: 'gem-calculator', label: '宝石成本' },
  { id: 'tool-2', label: '工具2', disabled: true },
  { id: 'tool-3', label: '工具3', disabled: true },
]

export default function ToolNav({ activeTool, onSelect, cangbaogePrice, onCangbaogePriceChange }) {
  const sanQianWan = cangbaogePrice != null && cangbaogePrice > 0
    ? cangbaogePrice * 3000
    : null
  const liangPerDian = cangbaogePrice != null && cangbaogePrice > 0
    ? 1000 / cangbaogePrice
    : null

  return (
    <nav className="tool-nav">
      <h1 className="tool-nav-title">梦幻西游工具集</h1>
      <div className="tool-nav-exchange">
        <input
          type="number"
          className="exchange-input"
          min="0"
          step="0.01"
          placeholder="藏宝阁价格（元/万两）"
          value={cangbaogePrice ?? ''}
          onChange={(e) => onCangbaogePriceChange(e.target.value === '' ? null : Number(e.target.value))}
        />
        {sanQianWan != null && (
          <span className="exchange-hint">
            {sanQianWan.toFixed(2)} 元/3000万两 | {liangPerDian.toFixed(2)} 两/点
          </span>
        )}
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
