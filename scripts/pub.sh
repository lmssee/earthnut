#!/bin/bash

CHECK_VERSION="@qqi/check-version"
printf $(pnpm dlx "${CHECK_VERSION}" -v)  # 更改全局安装的测试方法
tag=""
if ! tag=$(pnpm dlx "${CHECK_VERSION}" c=. 2>&1); then
    echo "未通过版本校验：$tag"
    exit 0
fi
echo "获取🉐发布标签为 ${tag}"
# 依赖安装
# npm ci
pnpm install --frozen-lockfile --prod=false
# 变换环境值
node ./scripts/env.js env=production
# 构建项目
./scripts/build.sh
# 构建 package.json 文件
node ./scripts/clean-package-json.js
# if ! npm run build; then 
#   echo "构建失败" 
#   exit 0
# fi

# 切换到构建目录
if [ ! -d "dist" ]; then 
  echo "未找到 dist 构建码"
  exit 0
fi

# 确保脚本在遇见错误时立即退出
set -e

cd "dist"
echo "开始发布 npm 包 ${tag} 版本"
if ! pnpm publish --provenance --access public --tag "${tag}" --no-git-checks; then
    echo "发布失败" 
    exit 1
fi
echo "🚀🚀  发布成功，完结 🎉🎉 撒花 🎉🎉"

