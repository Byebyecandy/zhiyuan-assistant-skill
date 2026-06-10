# 实时搜索设计

志愿助手 App 的实时搜索目标是给咨询过程提供“最新来源入口”，不是自动替代官方核验。

## 搜索流程

1. 用户输入院校、省份、年份、关键词。
2. 后端构造多组查询：
   - `<院校> <年份> 招生章程`
   - `<院校> <年份> 招生计划 选科要求`
   - `<院校> 本科招生网`
   - `<院校> 就业质量报告`
   - `<院校> 专业 录取分数 位次`
3. 搜索 provider 返回结果。
4. 后端按来源类型打分并去重。
5. 前端展示摘要、来源类型、可信度和链接。

## 来源优先级

高优先级：

- 高校官网/本科招生网
- 教育部/阳光高考
- 省考试院/招生考试院
- 就业质量报告或学校就业信息网

低优先级：

- 媒体稿
- 百科
- 论坛
- 短视频平台
- 自媒体文章

## Provider

优先级：

1. Tavily: `TAVILY_API_KEY`
2. Brave Search: `BRAVE_SEARCH_API_KEY`
3. Bing Web Search: `BING_SEARCH_API_KEY`
4. SerpAPI: `SERPAPI_API_KEY`
5. Bing HTML fallback
6. DuckDuckGo HTML fallback

HTML fallback 可能受到频率限制、页面结构变化、搜索引擎重定向或 SEO 污染影响，不适合作为生产环境唯一来源。正式使用建议配置 Tavily、Brave、Bing Web Search 或 SerpAPI。

## 风险提示

- 搜索结果可能过期、重复、被 SEO 污染或来自非官方转载。
- 招生章程、计划、选科要求、录取位次必须以当年官方发布为准。
- App 不应输出录取保证，只能输出风险和核验清单。
