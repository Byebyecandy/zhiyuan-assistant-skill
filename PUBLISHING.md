# 发布到 GitHub

本项目已经整理成可直接发布的仓库结构。

## 本地运行

```bash
cd app
node server.js
```

打开：

```text
http://localhost:5178
```

## 推送到 GitHub

如果你已经在 GitHub 创建了空仓库，例如：

```text
https://github.com/<你的用户名>/zhiyuan-assistant-skill.git
```

在项目根目录执行：

```bash
git remote add origin https://github.com/<你的用户名>/zhiyuan-assistant-skill.git
git branch -M main
git push -u origin main
```

如果提示登录，按 Git Credential Manager 的浏览器登录流程完成授权。

## 发布包

本地发布压缩包会生成在：

```text
dist/zhiyuan-assistant-skill-github.zip
```

这个压缩包适合上传到 GitHub Release 或备份。

## 抖音宣传视频

视频生成脚本：

```bash
node marketing/generate-douyin-video.mjs
```

输出：

```text
marketing/zhiyuan-assistant-douyin-promo.mp4
```

建议上传抖音后另配平台内 BGM，并在标题里说明：

```text
高考志愿别只看学校名：我做了一个本地可部署的志愿助手 Skill
```

