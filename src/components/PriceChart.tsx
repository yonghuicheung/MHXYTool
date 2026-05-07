import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

interface PriceRecord {
  date: string
  price: number
}

type MetricType = 'per3000wan' | 'perWan'
type RangeType = '1m' | '3m' | '6m' | '1y'

const RANGE_DAYS: Record<RangeType, number> = {
  '1m': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
}

const RANGE_LABELS: Record<RangeType, string> = {
  '1m': '近1个月',
  '3m': '近3个月',
  '6m': '近半年',
  '1y': '近一年',
}

function dedupeByDay(data: PriceRecord[]): PriceRecord[] {
  const map = new Map<string, PriceRecord>()
  for (const r of data) {
    map.set(r.date, r)
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

interface PriceChartProps {
  onClose: () => void
}

export default function PriceChart({ onClose }: PriceChartProps) {
  const [data, setData] = useState<PriceRecord[]>([])
  const [metric, setMetric] = useState<MetricType>('per3000wan')
  const [range, setRange] = useState<RangeType>('1m')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'price-history.json')
      .then((res) => res.json())
      .then((raw: PriceRecord[]) => {
        setData(dedupeByDay(raw))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const now = new Date()
  const cutoff = new Date(now.getTime() - RANGE_DAYS[range] * 86400000)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  const filtered = data.filter((r) => r.date >= cutoffStr)

  const chartData = filtered.map((r) => ({
    fullDate: r.date,
    date: r.date.slice(5),
    value: metric === 'per3000wan' ? r.price * 3000 : r.price,
  }))

  const metricLabel = metric === 'per3000wan' ? '金价(每3000万两)' : '金价(每万两)'

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-date">{d.fullDate}</div>
        <div className="chart-tooltip-value">{metricLabel}: {d.value.toFixed(2)}</div>
      </div>
    )
  }

  return (
    <div className="chart-overlay" onClick={onClose}>
      <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chart-header">
          <h3 className="chart-title">金价走势</h3>
          <button className="chart-close" onClick={onClose}>×</button>
        </div>

        <div className="chart-controls">
          <div className="chart-toggle-group">
            <span className="chart-toggle-label">指标：</span>
            {(['per3000wan', 'perWan'] as MetricType[]).map((m) => (
              <button
                key={m}
                className={`chart-toggle ${metric === m ? 'active' : ''}`}
                onClick={() => setMetric(m)}
              >
                {m === 'per3000wan' ? '金价(每3000万两)' : '金价(每万两)'}
              </button>
            ))}
          </div>
          <div className="chart-toggle-group">
            <span className="chart-toggle-label">范围：</span>
            {(Object.entries(RANGE_LABELS) as [RangeType, string][]).map(([k, label]) => (
              <button
                key={k}
                className={`chart-toggle ${range === k ? 'active' : ''}`}
                onClick={() => setRange(k)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="chart-loading">加载中...</p>
        ) : chartData.length === 0 ? (
          <p className="chart-loading">暂无数据</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{ value: metricLabel, angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => v.toFixed(metric === 'perWan' ? 4 : 2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#e94560"
                strokeWidth={2}
                dot={{ r: 2, fill: '#e94560' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
