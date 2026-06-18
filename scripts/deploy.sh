#!/bin/bash
set -e

# 增量部署：仅推送变更文件到 gh-pages，图片不变则秒推
DEPLOY_DIR=".gh-pages-worktree"

# 首次：创建 gh-pages 工作树
if [ ! -d "$DEPLOY_DIR" ]; then
  git worktree add "$DEPLOY_DIR" gh-pages 2>/dev/null || {
    # gh-pages 分支不存在，创建孤儿分支
    git worktree add "$DEPLOY_DIR" -b gh-pages
  }
fi

cd "$DEPLOY_DIR"

# 清空但保留 .git
find . -not -name '.git' -not -name '.' -not -name '..' -delete 2>/dev/null || true

# 复制构建产物
cp -r ../dist/* .

# 提效并推送（首次用 force-with-lease 对齐，后续增量快推）
git add -A
git commit -m "deploy $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to deploy"
git fetch origin gh-pages 2>/dev/null || true
git push origin gh-pages --force-with-lease

echo "Deployed (incremental)"
