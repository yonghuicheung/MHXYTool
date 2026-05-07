export interface CultivationType {
  id: string
  label: string
  costPerPractice: number // 万两 per practice (10 exp)
  maxLevel: number
}

export const CULTIVATION_TYPES: CultivationType[] = [
  { id: 'attack', label: '攻击修炼', costPerPractice: 3, maxLevel: 25 },
  { id: 'spell', label: '法术修炼', costPerPractice: 3, maxLevel: 25 },
  { id: 'hunting', label: '猎术修炼', costPerPractice: 3, maxLevel: 20 },
  { id: 'defense', label: '防御修炼', costPerPractice: 2, maxLevel: 25 },
  { id: 'anti-spell', label: '抗法修炼', costPerPractice: 2, maxLevel: 25 },
]

export const EXP_PER_PRACTICE = 10
