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
  return Math.round(num).toLocaleString('zh-CN')
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
  return (
    <div className="table-wrapper">
      <table className="result-table">
        <thead>
          <tr>
            {HEADERS.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.level}>
              <td className="cell-level">{row.level}</td>
              <td>{row.recipe}</td>
              <td className="cell-number">{row.level1Count.toLocaleString('zh-CN')}</td>
              <td className="cell-number">{formatLiang(row.materialCostLiang)}</td>
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
              <td className="cell-number">{formatLiang(row.totalCostLiang)}</td>
              <td className="cell-number">{formatYuan(row.totalCostYuan)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
