import { useState, useMemo } from 'react'
import Decimal from 'decimal.js'
import {
  PET_CULTIVATION_EXP, PET_MAX_LEVEL,
  FRUIT_EXP, FRUIT_MAX_PER_DAY,
  RING_EXP,
  SECRET_EXP_MIN, SECRET_EXP_MAX, SECRET_EXP_VARIANT, SECRET_MAX_PER_DAY,
} from '../data/petCultivation'

export default function PetCultivationCalculator() {
  const [currentLevel, setCurrentLevel] = useState<number>(0)
  const [targetLevel, setTargetLevel] = useState<number>(25)

  const result = useMemo(() => {
    const cur = Math.max(0, Math.min(PET_MAX_LEVEL, Math.floor(currentLevel || 0)))
    const tgt = Math.max(0, Math.min(PET_MAX_LEVEL, Math.floor(targetLevel || 0)))
    if (tgt <= cur) return null

    const needExp = PET_CULTIVATION_EXP[tgt] - PET_CULTIVATION_EXP[cur]

    const fruitCount = Math.ceil(needExp / FRUIT_EXP)
    const fruitDays = Math.ceil(fruitCount / FRUIT_MAX_PER_DAY)

    const ringCount = Math.ceil(needExp / RING_EXP)

    const secretMin = Math.ceil(needExp / SECRET_EXP_VARIANT)
    const secretMax = Math.ceil(needExp / SECRET_EXP_MIN)
    const secretDaysMin = Math.ceil(secretMin / SECRET_MAX_PER_DAY)
    const secretDaysMax = Math.ceil(secretMax / SECRET_MAX_PER_DAY)

    const ringExpTotal = ringCount * RING_EXP
    const ringExtra = ringExpTotal - needExp

    return {
      cur,
      tgt,
      needExp,
      fruitCount,
      fruitDays,
      ringCount,
      ringExpTotal,
      ringExtra,
      secretMin,
      secretMax,
      secretDaysMin,
      secretDaysMax,
    }
  }, [currentLevel, targetLevel])

  return (
    <section className="tool-section">
      <h2 className="section-title">召唤兽修炼计算器</h2>

      <div className="input-panel">
        <div className="input-group">
          <label className="input-label" htmlFor="pet-current">当前修炼等级</label>
          <input
            id="pet-current"
            type="number"
            className="text-input"
            min="0"
            max={PET_MAX_LEVEL}
            step="1"
            placeholder="0"
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value === '' ? 0 : Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="pet-target">目标修炼等级</label>
          <input
            id="pet-target"
            type="number"
            className="text-input"
            min="0"
            max={PET_MAX_LEVEL}
            step="1"
            placeholder="25"
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
              召唤兽修炼从 <strong>{result.cur}</strong> 级到 <strong>{result.tgt}</strong> 级需要 <strong className="pet-num">{result.needExp.toLocaleString('zh-CN')}</strong> 修炼经验
            </span>
          </div>

          <div className="pet-result-card">
            <span className="pet-result-label">修炼果</span>
            <span className="pet-result-value">
              吃修炼果 <strong className="pet-num">{result.fruitCount.toLocaleString('zh-CN')}</strong> 个（1个修炼果增加 {FRUIT_EXP} 点修炼经验，每天最多吃 {FRUIT_MAX_PER_DAY} 个，需要 <strong className="pet-num">{result.fruitDays.toLocaleString('zh-CN')}</strong> 天）
            </span>
          </div>

          <div className="pet-result-card">
            <span className="pet-result-label">宠环</span>
            <span className="pet-result-value">
              100环宠环需要跑 <strong className="pet-num">{result.ringCount.toLocaleString('zh-CN')}</strong> 次（100环宠环增加修炼经验 {RING_EXP} 点，共 {result.ringExpTotal.toLocaleString('zh-CN')} 经验，超出 {result.ringExtra.toLocaleString('zh-CN')} 点）
            </span>
          </div>

          <div className="pet-result-card">
            <span className="pet-result-label">修炼秘传</span>
            <span className="pet-result-value">
              召唤兽修炼秘传 <strong className="pet-num">{result.secretMin.toLocaleString('zh-CN')} ~ {result.secretMax.toLocaleString('zh-CN')}</strong> 次（
              每人每天只能领 {SECRET_MAX_PER_DAY} 次秘传任务，需要 <strong className="pet-num">{result.secretDaysMin} ~ {result.secretDaysMax}</strong> 天）
            </span>
          </div>

          <div className="pet-result-note">
            <p>秘传任务说明：完成后将获得最少 {SECRET_EXP_MIN} 点，最多 {SECRET_EXP_MAX} 点召唤兽修炼经验。如果领到上交指定种类变异召唤兽的任务，可以获得 {SECRET_EXP_VARIANT} 点修炼经验。该任务可以选择上交非指定种类变异召唤兽，上交后获得 {SECRET_EXP_MIN} 点至 {SECRET_EXP_MAX} 点修炼经验。</p>
            <p>通常情况下，完成这个任务只需要香火钱和环装，香火钱可以通过储备金抵扣一半。只要运气不差，前 3 个任务都比吃修炼果划算。秘传任务的开启时间为每天 10:00-24:00，这个时候的香火钱是最低的。</p>
          </div>
        </div>
      ) : (
        <p className="pet-empty">目标等级需大于当前等级</p>
      )}
    </section>
  )
}
