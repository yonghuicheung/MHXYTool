const tools = [
  { id: 'gem-calculator', label: '宝石成本' },
  { id: 'tool-2', label: '工具2', disabled: true },
  { id: 'tool-3', label: '工具3', disabled: true },
]

export default function ToolNav({ activeTool, onSelect }) {
  return (
    <nav className="tool-nav">
      <h1 className="tool-nav-title">梦幻西游工具集</h1>
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
