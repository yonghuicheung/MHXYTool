import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

interface GuideViewerProps {
  guidePath: string
}

// 防盗链图片渲染：去除 Referrer 避免 403
function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      loading="lazy"
      alt={props.alt || ''}
    />
  )
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
          components={{
            img: Img,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </section>
  )
}
