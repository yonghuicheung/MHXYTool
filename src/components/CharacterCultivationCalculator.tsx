import { useState, useMemo } from 'react'
import { PET_CULTIVATION_EXP } from '../data/petCultivation'
import { CULTIVATION_TYPES, EXP_PER_PRACTICE } from '../data/characterCultivation'

export default function CharacterCultivationCalculator() {
  const [typeId, setTypeId] = useState(CULTIVATION_TYPES[0].id)
  const [currentLevel, setCurrentLevel] = useState<number>(0)
  const [targetLevel, setTargetLevel] = useState<number>(25)

  const cType = CULTIVATION_TYPES.find((t) => t.id === typeId) ?? CULTIVATION_TYPES[0]

  const result = useMemo(() => {
    const cur = Math.max(0, Math.min(cType.maxLevel, Math.floor(currentLevel || 0)))
    const tgt = Math.max(0, Math.min(cType.maxLevel, Math.floor(targetLevel || 0)))
    if (tgt <= cur) return null

    const needExp = PET_CULTIVATION_EXP[tgt] - PET_CULTIVATION_EXP[cur]
    const practiceCount = Math.ceil(needExp / EXP_PER_PRACTICE)
    const totalCostWan = practiceCount * cType.costPerPractice

    return { cur, tgt, needExp, practiceCount, totalCostWan }
  }, [typeId, currentLevel, targetLevel, cType])

  return (
    <section className="tool-section">
      <h2 className="section-title">人物修炼计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="cult-type">修炼类型</label>
          <select
            id="cult-type"
            className="text-input"
            style={{ width: 180 }}
            value={typeId}
            onChange={(e) => {
              setTypeId(e.target.value)
              setTargetLevel(0)
            }}
          >
            {CULTIVATION_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="cult-current">当前修炼等级</label>
          <input
            id="cult-current"
            type="number"
            className="text-input"
            min="0"
            max={cType.maxLevel}
            step="1"
            placeholder="0"
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value === '' ? 0 : Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="cult-target">目标修炼等级</label>
          <input
            id="cult-target"
            type="number"
            className="text-input"
            min="0"
            max={cType.maxLevel}
            step="1"
            placeholder={String(cType.maxLevel)}
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value === '' ? 0 : Number(e.target.value))}
          />
        </div>
      </div>

      {result ? (
        <div className="pet-results">
          <div className="pet-result-card">
            <span className="pet-result-label">修炼经验</span>
            <span className="pet-result-value">
              {cType.label}从 <strong>{result.cur}</strong> 级到 <strong>{result.tgt}</strong> 级需要 <strong className="pet-num">{result.needExp.toLocaleString('zh-CN')}</strong> 修炼经验
            </span>
          </div>

          <div className="pet-result-card">
            <span className="pet-result-label">修炼次数</span>
            <span className="pet-result-value">
              需要修炼 <strong className="pet-num">{result.practiceCount.toLocaleString('zh-CN')}</strong> 次（每次 {cType.costPerPractice} 万两，获得 {EXP_PER_PRACTICE} 点修炼经验）
            </span>
          </div>

          <div className="pet-result-card">
            <span className="pet-result-label">修炼花费</span>
            <span className="pet-result-value">
              需要 <strong className="pet-num">{result.totalCostWan.toLocaleString('zh-CN')}</strong> 万两
            </span>
          </div>
        </div>
      ) : (
        <p className="pet-empty">目标等级需大于当前等级</p>
      )}
    </section>
  )
}
