import { useState, useMemo, useRef, useEffect } from 'react'

interface Tool {
  id: string
  label: string
}

interface Props {
  tools: Tool[]
  onSelect: (id: string) => void
}

// 动态加载拼音库（~200KB），首次聚焦搜索框时加载
let pinyinFn: ((text: string) => string) | null = null
let pinyinLoading = false

function getPinyinInitials(text: string, fallback: boolean): string {
  if (pinyinFn) {
    return pinyinFn(text)
  }
  if (!pinyinLoading) {
    pinyinLoading = true
    import('pinyin-pro').then(({ pinyin }) => {
      pinyinFn = (t: string) => pinyin(t, { pattern: 'first', toneType: 'none' })
    })
  }
  // 拼音库未加载时，用原文字做 fallback（中文部分仍可匹配）
  return fallback ? text.toLowerCase() : ''
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
  // 中文直接匹配（始终可用）
  if (isSubsequence(q, tool.label.toLowerCase())) return true
  // 拼音首字母匹配（可能 fallback）
  const initials = getPinyinInitials(tool.label, true)
  if (initials && isSubsequence(q, initials)) return true
  return false
}

export default function ToolSearch({ tools, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [pinyinReady, setPinyinReady] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // 聚焦时触发拼音库加载
  const handleFocus = () => {
    setOpen(true)
    if (!pinyinFn && !pinyinLoading) {
      pinyinLoading = true
      import('pinyin-pro').then(({ pinyin }) => {
        pinyinFn = (t: string) => pinyin(t, { pattern: 'first', toneType: 'none' })
        setPinyinReady(true)
      })
    }
  }

  const matches = useMemo(() => {
    if (!query.trim()) return []
    return tools.filter((t) => matchTool(query, t))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tools, pinyinReady])

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
        onFocus={handleFocus}
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
