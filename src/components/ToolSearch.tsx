import { useState, useMemo, useRef, useEffect } from 'react'

interface Tool {
  id: string
  label: string
}

interface Props {
  tools: Tool[]
  onSelect: (id: string) => void
}

// 拼音首字母映射（仅覆盖模块名称中用到的汉字）
const pinyinMap: Record<string, string> = {
  宝: 'b', 石: 's', 成: 'c', 本: 'b',
  星: 'x', 辉: 'h',
  五: 'w', 色: 's', 灵: 'l', 尘: 'c',
  钟: 'z',
  精: 'j', 魄: 'p',
  玄: 'x', 珠: 'z',
  物: 'w', 价: 'j', 对: 'd', 比: 'b',
  召: 'z', 唤: 'h', 兽: 's', 修: 'x', 炼: 'l',
  人: 'r',
  蟠: 'p', 桃: 't', 宴: 'y', 副: 'f', 攻: 'g', 略: 'l',
}

function getPinyinInitials(text: string): string {
  let result = ''
  for (const ch of text) {
    result += pinyinMap[ch] || ch.toLowerCase()
  }
  return result
}

// 子序列匹配：query 的每个字符是否按顺序出现在 target 中（可以不连续）
function isSubsequence(query: string, target: string): boolean {
  let qi = 0
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (target[ti] === query[qi]) qi++
  }
  return qi === query.length
}

function matchTool(query: string, tool: Tool): boolean {
  const q = query.toLowerCase()
  if (!q) return false
  const initials = getPinyinInitials(tool.label)
  return isSubsequence(q, initials) || isSubsequence(q, tool.label.toLowerCase())
}

export default function ToolSearch({ tools, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    if (!query.trim()) return []
    return tools.filter((t) => matchTool(query, t))
  }, [query, tools])

  // Reset active index when matches change
  useEffect(() => { setActiveIndex(-1) }, [matches])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const select = (id: string) => {
    onSelect(id)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || matches.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % matches.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      select(matches[activeIndex].id)
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="tool-search" onKeyDown={handleKeyDown}>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="搜索模块..."
        value={query}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
      />
      {open && matches.length > 0 && (
        <ul ref={listRef} className="search-dropdown">
          {matches.map((tool, i) => (
            <li
              key={tool.id}
              className={`search-item ${i === activeIndex ? 'search-item-active' : ''}`}
              onMouseDown={() => select(tool.id)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {tool.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
