#!/bin/bash
set -e

# 增量部署：仅推送变更文件到 gh-pages，图片不变则秒推
# 多机器安全：每台机器独立维护本地工作树，push 时自动对齐
DEPLOY_DIR=".gh-pages-worktree"

# 首次：拉取远程 gh-pages，创建本地工作树
if [ ! -d "$DEPLOY_DIR" ]; then
  git fetch origin gh-pages 2>/dev/null || true
  if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    # 远程分支存在，基于它创建工作树
    git worktree add "$DEPLOY_DIR" origin/gh-pages
    cd "$DEPLOY_DIR"
    git checkout -B gh-pages
  else
    # 远程分支不存在，创建孤儿分支
    git worktree add "$DEPLOY_DIR" -b gh-pages
    cd "$DEPLOY_DIR"
  fi
else
  cd "$DEPLOY_DIR"
fi

# 同步远程最新（多机器协作时可能有他人推送）
git fetch origin gh-pages 2>/dev/null || true
git reset --hard origin/gh-pages 2>/dev/null || true

# 清空但保留 .git
find . -not -name '.git' -not -name '.' -not -name '..' -delete 2>/dev/null || true

# 复制构建产物
cp -r ../dist/* .

# 提交并推送（仅变更文件会被传输）
git add -A
if git commit -m "deploy $(date '+%Y-%m-%d %H:%M:%S')"; then
  git push origin gh-pages
else
  echo "No changes to deploy"
fi

echo "Deployed (incremental)"
