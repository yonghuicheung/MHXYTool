// Cumulative experience required to reach each pet cultivation level (0-25)
// Formula for step n-1→n: 10*n² + 30*n + 110
const cumExp: number[] = [0]
for (let n = 1; n <= 25; n++) {
  cumExp.push(cumExp[n - 1] + 10 * n * n + 30 * n + 110)
}

export const PET_CULTIVATION_EXP = cumExp

export const PET_MAX_LEVEL = 25
// 1 cultivation fruit gives 150 exp, max 10 per day
export const FRUIT_EXP = 150
export const FRUIT_MAX_PER_DAY = 10
// 100-ring pet quest gives 760 exp
export const RING_EXP = 760
// Secret quest: 150-200 normally, 350 for variant pet
export const SECRET_EXP_MIN = 150
export const SECRET_EXP_MAX = 200
export const SECRET_EXP_VARIANT = 350
export const SECRET_MAX_PER_DAY = 6
