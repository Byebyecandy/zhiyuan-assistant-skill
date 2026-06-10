# 宣传视频素材

这里放抖音竖屏宣传视频和可复用生成脚本。

生成视频：

```bash
node marketing/generate-douyin-video.mjs
```

默认输出：

```text
marketing/zhiyuan-assistant-douyin-promo.mp4
```

生成带 AI 口播的版本：

```bash
node marketing/generate-douyin-dubbed-video.mjs
```

输出：

```text
marketing/zhiyuan-assistant-douyin-ai-mambo.mp4
marketing/zhiyuan-assistant-douyin-ai-mambo-cover.png
marketing/voiceover-script-ai-mambo.md
```

视频规格：

- 1080 x 1920
- 28 秒
- 静音，适合上传抖音后自行添加平台热门 BGM
- 文案强调“外行人直接用，内行人有所收获”

带配音版会根据每段 TTS 音频时长自动对齐画面字幕，实际时长以生成文件为准。
