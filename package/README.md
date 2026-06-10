# 志愿助手外置包

这个目录用于把志愿助手接入主流 AI 工具或外部网页。

## OpenAPI 工具

文件：

- `openapi.json`
- `ai-plugin.json`

使用方式：

1. 本地启动 App：`cd app && node server.js`
2. 在支持 OpenAPI/HTTP 工具的 AI 平台中导入 `package/openapi.json`
3. 工具地址默认是 `http://localhost:5178`

可用接口：

- `GET /api/versions`
- `GET /api/search`
- `POST /api/chat`

## DeepSeek 示例

DeepSeek API 支持 Function Calling 时，建议把志愿助手注册成一个由你自己的程序执行的工具：

1. 本地启动 App：`cd app && node server.js`
2. 在你的 Agent 代码里定义 `ask_zhiyuan_assistant` 工具
3. 模型要求调用工具时，由你的代码请求：

```http
POST http://localhost:5178/api/chat
Content-Type: application/json

{
  "message": "江苏物化生580分，想报南京信息工程大学计算机，稳不稳？",
  "version": "ultimate",
  "autoSearch": true
}
```

4. 把返回的 `answer` 和 `search.results` 交回模型总结

## OpenAI 示例

短期接法：

1. 启动 App：`cd app && node server.js`
2. 在支持 OpenAPI/HTTP 工具导入的平台中填入 `http://localhost:5178/openapi.json`
3. 如果平台在云端运行，先把本服务部署成 HTTPS 地址，再导入公网 OpenAPI 地址

正式接法：

- 把 `/api/chat` 包成 `chatWithZhiyuanAssistant` 工具
- 把 `/api/search` 包成 `searchSchoolInfo` 工具
- 用 MCP Server 暴露给 ChatGPT Apps 或其他支持 MCP 的宿主
- 需要界面时，用 `/embed.js` 作为 iframe/网页组件内容

## 网页嵌入

在任意 HTML 页面加入：

```html
<div id="zhiyuan-assistant-widget"></div>
<script
  src="http://localhost:5178/embed.js"
  data-base-url="http://localhost:5178"
  data-mount="zhiyuan-assistant-widget">
</script>
```

也可以直接打开 `embed-example.html` 查看效果。

## 注意

- 如果浏览器或 AI 平台不允许访问 `localhost`，需要把 App 部署到可访问的服务器。
- 生产环境建议配置 Tavily、Brave、Bing Web Search 或 SerpAPI。
- 搜索结果只做信息入口，正式建议必须以官方招生章程、省考试院、阳光高考和学校招生网为准。
