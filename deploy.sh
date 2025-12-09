#!/bin/bash

# 游戏平台快速部署脚本
# 使用方法：chmod +x deploy.sh && ./deploy.sh

echo "🎮 游戏平台部署脚本"
echo "===================="
echo ""

# 检查是否在正确的目录
if [ ! -f "gameinfos.js" ]; then
    echo "❌ 错误：请在项目根目录下运行此脚本"
    exit 1
fi

# 步骤1：初始化Git仓库
echo "📦 步骤1：初始化Git仓库..."
if [ -d ".git" ]; then
    echo "✅ Git仓库已存在"
else
    git init
    echo "✅ Git仓库初始化完成"
fi

# 步骤2：添加所有文件
echo ""
echo "📝 步骤2：添加文件到Git..."
git add .
echo "✅ 文件添加完成"

# 步骤3：提交
echo ""
echo "💾 步骤3：提交更改..."
git commit -m "Initial commit: Add 260+ HTML5 games platform" 2>/dev/null || echo "✅ 已是最新提交"

# 步骤4：配置GitHub仓库
echo ""
echo "🔗 步骤4：配置GitHub远程仓库"
repo_url="https://github.com/wang2186223/gametest.git"
echo "使用仓库: $repo_url"
echo ""

if true; then
    # 检查是否已有remote
    if git remote get-url origin 2>/dev/null; then
        echo "🔄 更新远程仓库地址..."
        git remote set-url origin "$repo_url"
    else
        echo "➕ 添加远程仓库..."
        git remote add origin "$repo_url"
    fi
    
    # 推送到GitHub
    echo ""
    echo "⬆️  步骤5：推送到GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ 成功推送到GitHub！"
    else
        echo "⚠️  推送失败，请检查："
        echo "   1. GitHub仓库地址是否正确"
        echo "   2. 是否已配置Git用户名和邮箱"
        echo "   3. 是否有推送权限"
    fi
fi

# 步骤6：Vercel部署指引
echo ""
echo "🌐 步骤6：部署到Vercel"
echo "===================="
echo ""
echo "选择部署方式："
echo "1) 通过Vercel网站部署（推荐，简单快捷）"
echo "2) 使用Vercel CLI部署"
echo "3) 跳过Vercel部署"
echo ""
read -p "请选择 (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "📋 请按照以下步骤操作："
        echo "1. 访问 https://vercel.com"
        echo "2. 使用GitHub账号登录"
        echo "3. 点击 'New Project'"
        echo "4. 导入你的GitHub仓库"
        echo "5. 点击 'Deploy'"
        echo ""
        echo "🎉 几分钟后，你的网站就会上线！"
        echo "📖 详细说明请查看 DEPLOYMENT.md 文件"
        ;;
    2)
        echo ""
        echo "🔧 使用Vercel CLI部署..."
        
        # 检查是否安装了Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo "📦 正在安装Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "🚀 开始部署..."
        vercel
        
        echo ""
        read -p "是否部署到生产环境？(y/n): " deploy_prod
        if [ "$deploy_prod" = "y" ] || [ "$deploy_prod" = "Y" ]; then
            vercel --prod
            echo "✅ 生产环境部署完成！"
        fi
        ;;
    3)
        echo "⏭️  跳过Vercel部署"
        echo "你可以稍后手动部署，详见 DEPLOYMENT.md"
        ;;
    *)
        echo "❌ 无效选择"
        ;;
esac

# 完成
echo ""
echo "✨ 部署脚本执行完成！"
echo ""
echo "📚 有用的命令："
echo "   - 本地测试：npm start 或 python -m http.server 8000"
echo "   - 查看详细文档：cat DEPLOYMENT.md"
echo "   - 查看README：cat README.md"
echo ""
echo "🎮 祝你的游戏平台运行顺利！"
