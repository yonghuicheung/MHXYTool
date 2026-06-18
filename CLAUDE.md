# MHXYTool - 梦幻西游工具集

> **会话规则（CRITICAL）**
> 1. 每次新会话开始，必须先读取本文件了解项目
> 2. 任何代码或功能变更完成后，必须同步更新本文件以保持文档准确

## 项目概述

React + Vite + TypeScript 单页应用，梦幻西游端游工具聚合站。部署在 GitHub Pages：`https://yonghuicheung.github.io/MHXYTool/`

## 技术栈

- React 19 + TypeScript
- Vite 8（base: `/MHXYTool/`）
- SCSS 样式
- decimal.js 任意精度计算
- recharts 图表（懒加载）
- Git 工作树增量部署

## 运行

```bash
npm install      # 安装依赖
npm run dev      # 开发 http://localhost:5173
npm run build    # 构建到 dist/
npm run deploy   # 构建 + 增量部署到 GitHub Pages
```

### 新电脑环境搭建
```bash
git clone git@github.com:yonghuicheung/MHXYTool.git
cd MHXYTool
npm install
```
之后正常使用 `npm run dev` / `npm run deploy` 即可。首次部署时脚本会自动初始化 gh-pages 工作树。

### 部署机制
- 使用 Git worktree 维护本地 `.gh-pages-worktree/`，指向 `gh-pages` 分支
- 每次部署仅推送变更文件（Git 按内容 SHA 比对），图片不变时不重复上传
- 多机器/多人使用安全：每台机器独立工作树，push 前自动 `git reset --hard origin/gh-pages` 对齐远程

## 项目结构

```
src/
├── main.tsx                    # React 入口
├── App.tsx                     # 主应用：导航状态 + 藏宝阁价格 + 条件渲染
├── index.scss                  # 全局样式
├── components/
│   ├── ToolNav.tsx             # 顶部导航：标题 + 藏宝阁输入 + 涨跌 + 搜索 + 抽屉菜单
│   ├── ToolSearch.tsx          # 模块搜索：拼音首字母模糊匹配，下拉选择
│   ├── GuideViewer.tsx         # 攻略查看器：Markdown渲染，图文混排
│   ├── PriceChart.tsx          # 金价走势图弹窗（recharts，Suspense懒加载）
│   ├── GemCalculator.tsx       # 宝石成本计算器 1-20级
│   ├── StarStoneCalculator.tsx # 星辉石成本计算器 1-11级
│   ├── ColorDustCalculator.tsx # 五色灵尘成本计算器 1-15级
│   ├── ClockStoneCalculator.tsx # 钟灵石成本计算器 1-8级
│   ├── SpiritStoneCalculator.tsx # 精魄灵石成本计算器 1-10级
│   ├── MysticBeadCalculator.tsx  # 玄灵珠成本计算器 1-8级
│   ├── ResultTable.tsx         # 通用结果表格（合成成本类工具共用）
│   ├── PetCultivationCalculator.tsx    # 召唤兽修炼计算器
│   ├── CharacterCultivationCalculator.tsx # 人物修炼计算器
│   └── PriceComparisonCalculator.tsx  # 物价对比计算器
├── data/
│   ├── gemRecipes.ts           # 宝石合成配方（1-20级）
│   ├── starStoneRecipes.ts     # 星辉石合成配方（1-11级）
│   ├── colorDustRecipes.ts     # 五色灵尘合成配方（1-15级）
│   ├── clockStoneRecipes.ts    # 钟灵石合成配方（1-8级）
│   ├── spiritStoneRecipes.ts   # 精魄灵石合成配方（1-10级）
│   ├── mysticBeadRecipes.ts    # 玄灵珠合成配方（1-8级）
│   ├── petCultivation.ts       # 修炼经验表（共用，0-25级）
│   └── characterCultivation.ts # 人物修炼类型定义
├── public/
│   └── guides/                 # 攻略Markdown（每个攻略独立子目录，图片按出现顺序编号 01.webp）
└── utils/
    └── calculate.ts            # 通用计算逻辑：getLevel1Count、formatRecipe、calculateCosts
```

## 关键数据流

- **藏宝阁价格**：App 从 `public/price-history.json` 加载最后一条 → 存入 state → 传递给 ToolNav 和所有计算器
- **price-history.json 格式**：`[{ date, prices: [{ time, value }] }]`，value 为元/万两
- **合成计算**：`calculateCosts(recipes, maxLevel, gemPrice, cangbaogePrice, synthesisCosts, staminaPerCraft?)` → 返回 `CostRow[]`
- **搜索**：ToolNav 右侧搜索框 → 拼音首字母/中文子序列模糊匹配 → 下拉选择 → 跳转模块
- **导航**：ToolNav 右侧三横线按钮 → 抽屉面板（分组卡片：合成成本/物价/修炼/攻略）

## 功能模块

### 合成成本类（共用 ResultTable）
| 模块 | 等级 | 合成规则 | 体力公式 |
|------|------|----------|----------|
| 宝石成本 | 1-20 | 2合1，12级起有额外材料 | 等级×10 |
| 星辉石 | 1-11 | 3合1，9级起有额外材料 | 等级×30 |
| 五色灵尘 | 1-15 | 2合1+额外材料 | 等级×30 |
| 钟灵石 | 1-8 | 3-5合1（不等） | 等级×10 |
| 精魄灵石 | 1-10 | 2合1，8级起有额外材料 | 2:20, 3:30, 4:40, 5:50, 6:60, 7:70, 8-10:80 |
| 玄灵珠 | 1-8 | 3合1，5级起有额外材料，合成费固定 | 20×(等级-1) |

### 修炼类
| 模块 | 等级 | 公式 |
|------|------|------|
| 召唤兽修炼 | 0-25 | 修炼果/宠环/秘传 |
| 人物修炼 | 0-25 | 攻击3万/次，防御2万/次 |

### 物价类
- 物价对比：游戏币(两/万两) ↔ 点卡 ↔ 精力 ↔ 人民币，1元=10点=100精力

### 攻略类
- Markdown 文件存放于 `public/guides/`，每个攻略独立子目录，图片按出现顺序编号 `01.webp`
- 由 GuideViewer 组件渲染（react-markdown），相对路径图片自动补全 BASE_URL
- 新增攻略步骤：放置 md 到 `public/guides/{攻略名}/` → 在 `App.tsx` 的 `guides` 表添加记录 → 在 `ToolNav.tsx` 的 `toolGroups` 攻略分组添加入口

| 攻略 | 类型 | 图片数 |
|------|------|--------|
| 蟠桃宴 | 天命侠士副本 | 10 |
| 青丘迷雾 | 普通副本 | 36 |

## 关键数值规则

- 修炼经验公式：第n级需要 `10n² + 30n + 110` 经验（0级为起始）
- 游戏币颜色分级：<1万默认，1-10万蓝，10-100万绿，100-1000万红，1000万-1亿紫，≥1亿金
- 数值格式化：≥1万显示X.XX万，≥1亿显示X.XX亿，否则显示原值
- 所有小数计算使用 decimal.js
- 藏宝阁汇率更新：编辑 `public/price-history.json`，当日日期追加 `{ "time": "HH:MM:SS", "value": 0.xxxx }`
