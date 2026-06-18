import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface GuideViewerProps {
  guidePath: string
}

// 相对路径图片自动补全 BASE_URL（如 /MHXYTool/）
function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const src = props.src || ''
  const resolvedSrc = src.startsWith('http') || src.startsWith('/')
    ? src
    : import.meta.env.BASE_URL + src
  return (
    <img
      {...props}
      src={resolvedSrc}
      loading="lazy"
      alt={props.alt || ''}
    />
  )
}

// 外链新窗口打开
function A(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href || ''
  const isExternal = href.startsWith('http')
  return (
    <a
      {...props}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    />
  )
}

const components: Components = {
  img: Img,
  a: A,
}

export default function GuideViewer({ guidePath }: GuideViewerProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(import.meta.env.BASE_URL + guidePath)
      .then((res) => {
        if (!res.ok) throw new Error('加载失败')
        return res.text()
      })
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [guidePath])

  if (loading) {
    return <section className="tool-section"><div className="guide-loading">加载中...</div></section>
  }

  if (error) {
    return <section className="tool-section"><div className="guide-error">加载失败：{error}</div></section>
  }

  return (
    <section className="tool-section">
      <div className="guide-content">
        <ReactMarkdown
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </section>
  )
}
