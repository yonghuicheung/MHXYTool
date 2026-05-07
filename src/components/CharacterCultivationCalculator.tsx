import { useState, useMemo } from 'react'
import { PET_CULTIVATION_EXP } from '../data/petCultivation'
import { CULTIVATION_TYPES, EXP_PER_PRACTICE } from '../data/characterCultivation'

export default function CharacterCultivationCalculator() {
  const [typeId, setTypeId] = useState(CULTIVATION_TYPES[0].id)
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)
  const [targetLevel, setTargetLevel] = useState<number | null>(null)

  const cType = CULTIVATION_TYPES.find((t) => t.id === typeId) ?? CULTIVATION_TYPES[0]

  const result = useMemo(() => {
    const cur = Math.max(0, Math.min(cType.maxLevel, Math.floor(currentLevel ?? 0)))
    const tgt = Math.max(0, Math.min(cType.maxLevel, Math.floor(targetLevel ?? 0)))
    if (tgt <= cur) return null

    const needExp = PET_CULTIVATION_EXP[tgt] - PET_CULTIVATION_EXP[cur]
    const practiceCount = Math.ceil(needExp / EXP_PER_PRACTICE)
    const totalCostWan = practiceCount * cType.costPerPractice

    // Materials cost: 5 帮派资材 per practice
    const materials = practiceCount * 5

    // Character level requirement: 20 + target * 5, minimum 25
    const reqLevel = Math.max(25, 20 + tgt * 5)

    // 帮贡上限 requirement (not consumed)
    const reqBangGong = tgt * 150

    // 快速修炼: same money cost + consumes 帮贡, no 资材
    const quickCost = totalCostWan
    const quickBangGong = practiceCount

    // 无帮贡修炼: through NPC, 2x cost (estimated)
    const noBangCost = totalCostWan * 2

    return { cur, tgt, needExp, practiceCount, totalCostWan, materials, reqLevel, reqBangGong, quickCost, quickBangGong, noBangCost }
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
              setTargetLevel(null)
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
            value={currentLevel ?? ''}
            onChange={(e) => {
              const v = e.target.value === '' ? null : Number(e.target.value)
              setCurrentLevel(v)
              if (v != null && targetLevel != null && targetLevel <= v) {
                setTargetLevel(Math.min(cType.maxLevel, v + 1))
              }
            }}
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
            value={targetLevel ?? ''}
            onChange={(e) => {
              const v = e.target.value === '' ? null : Number(e.target.value)
              setTargetLevel(v)
            }}
          />
        </div>
      </div>

      {result ? (
        <div className="pet-results">
          <div className="pet-result-card">
            <span className="pet-result-label">修炼经验</span>
            <span className="pet-result-value">
              {cType.label}从 <strong>{result.cur}</strong> 级到 <strong>{result.tgt}</strong> 级需要 <strong className="pet-num">{result.needExp.toLocaleString('zh-CN')}</strong> 修炼经验，共修炼 <strong className="pet-num">{result.practiceCount.toLocaleString('zh-CN')}</strong> 次（每次 {cType.costPerPractice} 万两，{EXP_PER_PRACTICE} 点经验）
            </span>
          </div>

          <div className="pet-result-card">
            <span className="pet-result-label">帮派修炼</span>
            <span className="pet-result-value">
              需要消耗 <strong className="pet-num">{result.materials.toLocaleString('zh-CN')}</strong> 资材，
              帮贡上限 <strong className="pet-num">{result.reqBangGong.toLocaleString('zh-CN')}</strong>（不消耗），
              角色等级 ≥ <strong className="pet-num">{result.reqLevel}</strong> 级，
              花费 <strong className="pet-num">{result.totalCostWan.toLocaleString('zh-CN')}</strong> 万两
            </span>
          </div>

          <div className="pet-result-card">
            <span className="pet-result-label">快速修炼</span>
            <span className="pet-result-value">
              需要消耗 <strong className="pet-num">{result.quickBangGong.toLocaleString('zh-CN')}</strong> 帮贡，不消耗资材，不需要帮贡上限，花费 <strong className="pet-num">{result.quickCost.toLocaleString('zh-CN')}</strong> 万两
            </span>
          </div>

          <div className="pet-result-card">
            <span className="pet-result-label">无帮贡修炼</span>
            <span className="pet-result-value">
              无需资材、帮贡和帮贡上限，花费 <strong className="pet-num">{result.noBangCost.toLocaleString('zh-CN')}</strong> 万两（NPC修炼指导人，花费约为帮派修炼的2倍）
            </span>
          </div>
        </div>
      ) : (
        <p className="pet-empty">目标等级需大于当前等级</p>
      )}
    </section>
  )
}
