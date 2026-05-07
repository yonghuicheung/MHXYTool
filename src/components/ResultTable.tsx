import type { CostRow } from '../utils/calculate'

const HEADERS = [
  '等级',
  '所需材料',
  '所需1级宝石数',
  '材料成本（两）',
  '材料成本（元）',
  '合成费用（两）',
  '总成本（两）',
  '总成本（元）',
]

function formatLiang(num: number): string {
  const abs = Math.abs(num)
  if (abs >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  }
  if (abs >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toFixed(2)
}

function getLiangColor(num: number): string {
  const abs = Math.abs(num)
  if (abs >= 100000000) return 'liang-gold'
  if (abs >= 10000000) return 'liang-purple'
  if (abs >= 1000000) return 'liang-red'
  if (abs >= 100000) return 'liang-green'
  if (abs >= 10000) return 'liang-blue'
  return ''
}

function formatYuan(num: number): string {
  return num.toFixed(2)
}

interface ResultTableProps {
  rows: CostRow[]
  synthesisCosts: Record<number, number>
  onSynthesisCostChange: (level: number, value: number | null) => void
}

export default function ResultTable({ rows, synthesisCosts, onSynthesisCostChange }: ResultTableProps) {
  const hasStamina = rows.length > 0 && rows.some((r) => r.stamina > 0)

  return (
    <div className="table-wrapper">
      <table className="result-table">
        <thead>
          <tr>
            {HEADERS.map((h) => (
              <th key={h}>{h}</th>
            ))}
            {hasStamina && <th>体力消耗</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.level}>
              <td className="cell-level">{row.level}</td>
              <td>{row.recipe}</td>
              <td className="cell-number">{row.level1Count.toLocaleString('zh-CN')}</td>
              <td className={`cell-number ${getLiangColor(row.materialCostLiang)}`}>{formatLiang(row.materialCostLiang)}</td>
              <td className="cell-number">{formatYuan(row.materialCostYuan)}</td>
              <td className="cell-input">
                <input
                  type="number"
                  className="synthesis-input"
                  min="0"
                  placeholder="可选"
                  value={synthesisCosts[row.level] ?? ''}
                  onChange={(e) => onSynthesisCostChange(row.level, e.target.value === '' ? null : Number(e.target.value))}
                />
              </td>
              <td className={`cell-number ${getLiangColor(row.totalCostLiang)}`}>{formatLiang(row.totalCostLiang)}</td>
              <td className="cell-number">{formatYuan(row.totalCostYuan)}</td>
              {hasStamina && <td className="cell-number">{row.stamina.toLocaleString('zh-CN')}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
