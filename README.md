# 志愿助手

一个面向高考志愿、升学规划、专业选择、考研与就业路径分析的 Agent Skill + 本地 Web App。

项目保留 6 个可选版本：

- 现实版
- 全链路版
- 规则版
- 院校专业版
- 本地职业版
- 终极版

其中“终极版”会把前 5 个版本整合成完整咨询工作流。

## 本地 App

进入 `app/` 后直接启动，不需要安装依赖：

```bash
cd app
node server.js
```

打开：

```text
http://localhost:5178
```

App 能做两件事：

- 用默认字号对话框直接问志愿问题，右上角可一键切换大字模式。
- 在左侧选择 6 个版本之一。
- 实时搜索院校信息，优先展示高校官网/招生网、教育部/阳光高考、省考试院、就业质量报告等高置信来源。
- 生成带来源的家长友好回答。
- 在页面下方查看当前人物状态、判断重点和可直接点击的提问模板。
- 进阶用户可通过弹窗教程了解 DeepSeek / OpenAI 两种接入方式。

## 外置包接入

本项目可以作为支持 HTTP/OpenAPI 工具的 AI 外置包使用。

启动本地 App 后，可访问：

```text
http://localhost:5178/openapi.json
http://localhost:5178/ai-plugin.json
http://localhost:5178/embed.js
```

文件也保存在：

```text
package/openapi.json
package/ai-plugin.json
package/embed-example.html
```

嵌入任意网页：

```html
<div id="zhiyuan-assistant-widget"></div>
<script
  src="http://localhost:5178/embed.js"
  data-base-url="http://localhost:5178"
  data-mount="zhiyuan-assistant-widget">
</script>
```

主要接口：

- `POST /api/chat`：直接对话，可自动搜索院校信息。
- `GET /api/search`：实时搜索院校来源。
- `GET /api/versions`：列出 6 个版本。
- `GET /api/health`：检查服务状态。

页面下方的 Skill 工作台提供两类信息：

- 当前人物状态：展示这个版本正在按什么角色、重点和边界回答。
- 这样问更准：提供可点击提问模板，外行能直接用，内行能看出背后的判断变量。

进阶接入区提供两个小白教程：

- DeepSeek：按 Function Calling 思路，把 `/api/chat` 包成由用户程序执行的工具函数。
- OpenAI：短期可用 OpenAPI/HTTP 工具导入；正式 ChatGPT Apps 方向建议再包一层 MCP Server，并把网页组件作为 iframe UI 暴露。

注意：云端 AI 平台通常不能直接访问你的 `localhost`。要给线上 AI 使用，需要部署到 HTTPS 域名，或先用内网穿透做测试地址。

## 实时搜索配置

默认会使用 Bing HTML fallback，并保留 DuckDuckGo HTML fallback，适合临时测试，但稳定性和覆盖范围有限。

建议配置至少一个搜索 API。复制 `.env.example` 为 `.env` 后填写 key：

```bash
cd app
copy .env.example .env
```

支持的 provider 优先级：

1. Tavily
2. Brave Search
3. Bing Web Search
4. SerpAPI
5. Bing HTML fallback
6. DuckDuckGo HTML fallback

Windows PowerShell 临时配置示例：

```powershell
$env:BRAVE_SEARCH_API_KEY="your_key"
node server.js
```

Docker 方式：

```bash
cd app
cp .env.example .env
docker compose up --build
```

## Skill 使用

示例提示：

```text
用志愿助手终极版帮我分析：江苏物化生，580分，想学电气或计算机，家庭希望稳定就业。
```

```text
用志愿助手现实版分析：河南理科位次 6 万，孩子想学金融，值不值得？
```

```text
用志愿助手规则版解释提前批、服从调剂和专业组对广东考生有什么影响。
```

## 静态网页

保留静态网页版本：

```text
assets/web/zhiyuan-assistant.html
```

静态网页只能复制提示词，不具备实时全网搜索能力。需要实时更新院校信息时，请运行 `app/`。

## 事实核验原则

App 的搜索结果只是实时入口，不等于事实确认。最终结论必须回到：

- 当年招生章程
- 省考试院公告
- 阳光高考/教育部信息
- 选科要求
- 近三年录取位次
- 招生计划
- 就业质量报告

## 发布风险

发 GitHub 前建议保留这些边界：

- 仓库名使用 `zhiyuan-assistant-skill` 这类通用名称。
- README 不写“某某老师本人”“切换到某某老师视角”。
- 不放真人照片、二维码、视频搬运、长语录合集。
- 不使用“官方”“授权”“同款”“本人”这类会造成混淆的词。
- 对真实人物资料只做短摘要并附来源，不搬运长段原文。

详细说明见 `references/research/legal-risk.md`。

## License

MIT. 只覆盖本仓库原创代码、文档和界面，不覆盖第三方姓名、肖像、视频、文章、图书内容或平台素材。
