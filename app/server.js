import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const packageDir = path.join(__dirname, "..", "package");
await loadEnvFile(path.join(__dirname, ".env"));
const port = Number(process.env.PORT || 5178);
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

const providerPriority = [
  ["tavily", Boolean(process.env.TAVILY_API_KEY)],
  ["brave", Boolean(process.env.BRAVE_SEARCH_API_KEY)],
  ["bing", Boolean(process.env.BING_SEARCH_API_KEY)],
  ["serpapi", Boolean(process.env.SERPAPI_API_KEY)],
  ["bing-html", true],
  ["duckduckgo", true]
];

const versionDefinitions = [
  {
    id: "ultimate",
    title: "终极版",
    short: "五个版本合在一起，适合完整咨询。",
    method: "先补齐信息，再综合现实判断、长期路径、规则核验、院校专业适配和就业出口。"
  },
  {
    id: "reality",
    title: "现实版",
    short: "先说值不值得，适合快速判断。",
    method: "按就业出口、城市、学历门槛、专业壁垒和家庭试错成本分析。"
  },
  {
    id: "chain",
    title: "全链路版",
    short: "看长期路线，适合规划未来几年。",
    method: "把高中、本科、读研、就业连起来，给出 3 个月、1 年、3-7 年行动。"
  },
  {
    id: "rules",
    title: "规则版",
    short: "讲清政策规则，适合看不懂投档调剂。",
    method: "按定义、影响、误区、操作建议、核验清单解释。"
  },
  {
    id: "fit",
    title: "院校专业版",
    short: "看学校和专业是否适合孩子。",
    method: "分析学校层次、学科实力、城市资源、培养方案、就业方向和适合学生。"
  },
  {
    id: "career",
    title: "本地职业版",
    short: "看本省规则和就业出口。",
    method: "从本省录取规则出发，映射行业、企业用人门槛、职业成长路径和冲稳保。"
  }
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

async function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const raw = await readFile(filePath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sendText(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, {
    "content-type": contentType,
    "cache-control": "no-store",
    "access-control-allow-origin": "*"
  });
  res.end(body);
}

function handleOptions(res) {
  res.writeHead(204, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "access-control-max-age": "86400"
  });
  res.end();
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

function sanitizeQuery(value) {
  return String(value || "")
    .replace(/[\u0000-\u001f<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function splitWords(value) {
  return String(value || "")
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function buildQueries({ school, province, year, keywords }) {
  const currentYear = year || new Date().getFullYear();
  const quotedSchool = school ? `"${school}"` : "";
  const words = splitWords(keywords);
  const topicQueries = [
    `${quotedSchool} ${currentYear} 招生章程`,
    `${quotedSchool} ${currentYear} 招生计划 选科要求`,
    `${quotedSchool} 本科招生网`,
    `${quotedSchool} 招生网 site:edu.cn`,
    `${quotedSchool} 阳光高考`,
    `${quotedSchool} 就业质量报告 filetype:pdf`,
    `${quotedSchool} 专业 录取分数 位次 ${province || ""}`,
    ...words.map((word) => `${quotedSchool} ${word}`)
  ];
  return [...new Set(topicQueries.map(sanitizeQuery).filter(Boolean))].slice(0, 8);
}

function normalizeResult(item, query, provider) {
  const url = item.url || item.link || item.href;
  if (!url || !/^https?:\/\//i.test(url)) return null;
  const title = decodeHtml(item.title || item.name || url).slice(0, 160);
  const snippet = decodeHtml(item.snippet || item.description || item.content || "").slice(0, 360);
  return {
    title,
    url,
    snippet,
    query,
    provider,
    sourceType: classifySource(url, title, snippet),
    score: scoreSource(url, title, snippet, query)
  };
}

function classifySource(url, title = "", snippet = "") {
  const host = getHost(url);
  const text = `${host} ${title} ${snippet}`.toLowerCase();
  if (/gaokao\.chsi\.com\.cn|chsi\.com\.cn|moe\.gov\.cn/.test(host)) return "教育部/阳光高考";
  if (/eea|考试院|招生考试|省教育|教育考试/.test(text)) return "省考试院/教育部门";
  if (/gov\.cn$/.test(host)) return "政府网页";
  if (/\.edu\.cn$/.test(host) || host.endsWith(".edu.cn")) {
    if (/就业质量|quality|career|job|就业/.test(text)) return "就业质量/就业信息";
    return "高校官网/招生网";
  }
  if (/baike|wikipedia|zhihu|sohu|163|qq\.com|toutiao|douyin|bilibili|china\.com\.cn|gankaosheng|xuexili/.test(text)) return "媒体/百科/社区";
  return "其他网页";
}

function scoreSource(url, title = "", snippet = "", query = "") {
  const type = classifySource(url, title, snippet);
  const scores = {
    "高校官网/招生网": 95,
    "教育部/阳光高考": 92,
    "省考试院/教育部门": 90,
    "就业质量/就业信息": 82,
    "政府网页": 58,
    "其他网页": 55,
    "媒体/百科/社区": 35
  };
  let score = scores[type] || 50;
  const text = `${title} ${snippet}`;
  if (/招生章程|招生计划|选科要求|就业质量报告|本科招生/.test(text)) score += 5;
  const school = extractQuotedSchool(query);
  if (school && !`${url} ${title} ${snippet}`.includes(school)) score -= 25;
  return Math.min(100, score);
}

function extractQuotedSchool(query) {
  const match = String(query || "").match(/"([^"]+)"/);
  return match?.[1] || "";
}

function getHost(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function uniqueResults(results) {
  const seen = new Set();
  return results
    .filter(Boolean)
    .filter((item) => {
      const key = item.url.replace(/[#?].*$/, "").replace(/\/$/, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);
}

function summarize(results, school, province, year) {
  const official = results.filter((item) => item.score >= 90).slice(0, 5);
  const employment = results.filter((item) => item.sourceType.includes("就业")).slice(0, 3);
  const media = results.filter((item) => item.score < 60).slice(0, 3);
  const lines = [
    `检索对象：${[school, province, year].filter(Boolean).join(" / ") || "未指定"}`,
    `检索时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
    `高置信来源：${official.length} 条；就业相关来源：${employment.length} 条；低置信补充来源：${media.length} 条。`
  ];
  if (official.length) {
    lines.push(`优先核验：${official.map((item) => item.title).join("；")}`);
  }
  if (employment.length) {
    lines.push(`就业信息入口：${employment.map((item) => item.title).join("；")}`);
  }
  lines.push("注意：实时搜索结果只提供入口和证据优先级，录取规则、招生计划、选科要求必须以当年官方章程和省考试院发布为准。");
  return lines.join("\n");
}

async function handleSearch(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const school = sanitizeQuery(url.searchParams.get("school"));
  const province = sanitizeQuery(url.searchParams.get("province"));
  const year = sanitizeQuery(url.searchParams.get("year"));
  const keywords = sanitizeQuery(url.searchParams.get("keywords"));

  if (!school && !keywords) {
    sendJson(res, 400, { error: "请至少输入院校名称或关键词。" });
    return;
  }

  const cacheKey = JSON.stringify({ school, province, year, keywords });
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    sendJson(res, 200, { ...cached.payload, cached: true });
    return;
  }

  const queries = buildQueries({ school, province, year, keywords });
  try {
    const { provider, rawResults, providerErrors } = await runSearchWithFallback(queries);
    const results = uniqueResults(rawResults);
    const payload = {
      provider,
      providerErrors,
      searchedAt: new Date().toISOString(),
      school,
      province,
      year,
      keywords,
      queries,
      summary: summarize(results, school, province, year),
      results
    };
    cache.set(cacheKey, { createdAt: Date.now(), payload });
    sendJson(res, 200, payload);
  } catch (error) {
    sendJson(res, 502, {
      error: "实时搜索失败",
      detail: error.message
    });
  }
}

function handleVersions(res) {
  sendJson(res, 200, {
    versions: versionDefinitions,
    defaultVersion: "ultimate"
  });
}

async function handleChat(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "请使用 POST 调用 /api/chat。" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const message = sanitizeLongText(body.message);
    const versionId = sanitizeQuery(body.version || "ultimate");
    const province = sanitizeQuery(body.province);
    const year = sanitizeQuery(body.year);
    const explicitSchool = sanitizeQuery(body.school);
    const keywords = sanitizeQuery(body.keywords || "招生章程 选科要求 就业质量报告 录取位次");
    const autoSearch = body.autoSearch !== false;

    if (!message && !explicitSchool) {
      sendJson(res, 400, { error: "请先输入想问的问题，或者输入院校名称。" });
      return;
    }

    const version = versionDefinitions.find((item) => item.id === versionId) || versionDefinitions[0];
    const school = explicitSchool || inferSchool(message);
    let search = null;
    if (autoSearch && school) {
      const queries = buildQueries({ school, province, year, keywords });
      const { provider, rawResults, providerErrors } = await runSearchWithFallback(queries);
      const results = uniqueResults(rawResults);
      search = {
        provider,
        providerErrors,
        searchedAt: new Date().toISOString(),
        school,
        province,
        year,
        keywords,
        queries,
        summary: summarize(results, school, province, year),
        results
      };
    }

    sendJson(res, 200, {
      version,
      message,
      inferredSchool: school || "",
      answer: buildChatAnswer({ message, version, school, province, year, search }),
      search
    });
  } catch (error) {
    sendJson(res, 502, {
      error: "对话生成失败",
      detail: error.message
    });
  }
}

function sanitizeLongText(value) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

function inferSchool(message) {
  const text = String(message || "");
  const suffixes = ["职业技术学院", "高等专科学校", "专科学校", "大学", "学院", "学校"];
  const candidates = [];

  suffixes.forEach((suffix) => {
    let index = text.indexOf(suffix);
    while (index !== -1) {
      const end = index + suffix.length;
      let start = end;
      while (start > 0 && /[\u4e00-\u9fa5A-Za-z0-9·（）()]/.test(text[start - 1]) && end - start < 28) {
        start -= 1;
      }
      let candidate = text.slice(start, end);
      candidate = candidate.replace(/^.*?(想报|报考|准备报|考虑报|想去|想上|想读|咨询|看看|分析)/, "");
      candidate = candidate.replace(/^(孩子|我家|请问|老师|帮我|给我|这个)/, "");
      if (candidate.length >= 4 && suffixes.some((item) => candidate.endsWith(item))) {
        candidates.push(candidate);
      }
      index = text.indexOf(suffix, end);
    }
  });

  return candidates.sort((a, b) => a.length - b.length)[0] || "";
}

function buildChatAnswer({ message, version, school, province, year, search }) {
  const lines = [];
  lines.push(`我先用「${version.title}」帮你用大白话说。`);
  lines.push("");

  if (!school) {
    lines.push("我还没看出你问的是哪所学校。你可以补一句：学校名、省份、孩子分数或位次。");
    lines.push("");
  } else {
    lines.push(`你现在问的院校：${school}${province ? `（${province}）` : ""}${year ? `，${year} 年` : ""}。`);
  }

  lines.push("先记住一句话：志愿不能只看学校名，必须同时看专业、城市、位次、规则和就业出口。");
  lines.push("");
  lines.push("我建议按这 5 步走：");
  lines.push("1. 先确认孩子的省份、选科、分数和位次。");
  lines.push("2. 查这所学校当年招生章程和招生计划。");
  lines.push("3. 看目标专业近三年录取位次，不只看最低分。");
  lines.push("4. 查培养方案和就业质量报告，看看毕业后主要去哪里。");
  lines.push("5. 最后再分成冲、稳、保，不要把所有希望压在一个志愿上。");
  lines.push("");
  lines.push(`本次使用的方法：${version.method}`);

  if (search?.results?.length) {
    const official = search.results.filter((item) => item.score >= 85).slice(0, 5);
    lines.push("");
    lines.push("我已经帮你实时找到了这些优先核验入口：");
    official.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.title}（${item.sourceType}，可信度 ${item.score}）`);
      lines.push(`   ${item.url}`);
    });
    lines.push("");
    lines.push("注意：搜索结果只是入口，最终要点开官方来源核验。");
  } else if (school) {
    lines.push("");
    lines.push("我暂时没有拿到实时搜索结果。建议你配置搜索 API，或者手动查看学校招生网、阳光高考和省考试院。");
  }

  lines.push("");
  lines.push("你下一步可以直接告诉我：孩子省份、选科、分数/位次、想学的专业，我就能继续帮你排冲稳保。");
  return lines.join("\n");
}

async function runSearchWithFallback(queries) {
  const enabledProviders = providerPriority.filter(([, enabled]) => enabled).map(([name]) => name);
  const providerErrors = [];

  for (const provider of enabledProviders) {
    try {
      const rawResults = [];
      for (const query of queries) {
        const results = await searchProvider(provider, query);
        rawResults.push(...results.map((item) => normalizeResult(item, query, provider)));
      }
      return { provider, rawResults, providerErrors };
    } catch (error) {
      providerErrors.push({ provider, error: error.message });
    }
  }

  throw new Error(providerErrors.map((item) => `${item.provider}: ${item.error}`).join("; "));
}

async function searchProvider(provider, query) {
  if (provider === "tavily") return searchTavily(query);
  if (provider === "brave") return searchBrave(query);
  if (provider === "bing") return searchBing(query);
  if (provider === "serpapi") return searchSerpApi(query);
  if (provider === "bing-html") return searchBingHtml(query);
  return searchDuckDuckGo(query);
}

async function searchTavily(query) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${process.env.TAVILY_API_KEY}`
    },
    body: JSON.stringify({
      query,
      search_depth: "basic",
      max_results: 6,
      include_answer: false
    })
  });
  if (!response.ok) throw new Error(`Tavily ${response.status}`);
  const data = await response.json();
  return data.results || [];
}

async function searchBrave(query) {
  const endpoint = new URL("https://api.search.brave.com/res/v1/web/search");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("count", "6");
  endpoint.searchParams.set("country", "CN");
  const response = await fetch(endpoint, {
    headers: {
      "accept": "application/json",
      "x-subscription-token": process.env.BRAVE_SEARCH_API_KEY
    }
  });
  if (!response.ok) throw new Error(`Brave ${response.status}`);
  const data = await response.json();
  return data.web?.results || [];
}

async function searchBing(query) {
  const endpoint = new URL("https://api.bing.microsoft.com/v7.0/search");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("count", "6");
  endpoint.searchParams.set("mkt", "zh-CN");
  const response = await fetch(endpoint, {
    headers: { "Ocp-Apim-Subscription-Key": process.env.BING_SEARCH_API_KEY }
  });
  if (!response.ok) throw new Error(`Bing ${response.status}`);
  const data = await response.json();
  return data.webPages?.value || [];
}

async function searchSerpApi(query) {
  const endpoint = new URL("https://serpapi.com/search.json");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("engine", "google");
  endpoint.searchParams.set("hl", "zh-cn");
  endpoint.searchParams.set("num", "6");
  endpoint.searchParams.set("api_key", process.env.SERPAPI_API_KEY);
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`SerpAPI ${response.status}`);
  const data = await response.json();
  return data.organic_results || [];
}

async function searchDuckDuckGo(query) {
  const endpoint = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; ZhiyuanAssistant/0.1; +http://localhost)",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.7"
    }
  });
  if (!response.ok) throw new Error(`DuckDuckGo ${response.status}`);
  const html = await response.text();
  return parseDuckDuckGo(html);
}

async function searchBingHtml(query) {
  const endpoint = `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=zh-CN&mkt=zh-CN`;
  const response = await fetch(endpoint, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.7"
    }
  });
  if (!response.ok) throw new Error(`Bing HTML ${response.status}`);
  const html = await response.text();
  return parseBingHtml(html);
}

function parseBingHtml(html) {
  const blockMatches = [...html.matchAll(/<li class="b_algo"[\s\S]*?<\/li>/g)];
  return blockMatches.slice(0, 8).map((blockMatch) => {
    const block = blockMatch[0];
    const titleMatch = block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h2>/);
    if (!titleMatch) return null;
    const snippetMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    return {
      url: decodeHtml(stripTags(titleMatch[1])),
      title: decodeHtml(stripTags(titleMatch[2])),
      snippet: decodeHtml(stripTags(snippetMatch?.[1] || ""))
    };
  }).filter(Boolean);
}

function parseDuckDuckGo(html) {
  const matches = [...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)];
  return matches.slice(0, 8).map((match) => ({
    url: normalizeDuckUrl(decodeHtml(stripTags(match[1]))),
    title: decodeHtml(stripTags(match[2])),
    snippet: decodeHtml(stripTags(match[3]))
  }));
}

function normalizeDuckUrl(value) {
  try {
    const url = new URL(value, "https://duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg || value;
  } catch {
    return value;
  }
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const safePath = path.normalize(path.join(publicDir, pathname));
  if (!safePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  const filePath = existsSync(safePath) ? safePath : path.join(publicDir, "index.html");
  try {
    const body = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": mimeTypes[ext] || "application/octet-stream",
      "cache-control": "no-cache"
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

async function servePackageFile(res, filename) {
  const filePath = path.join(packageDir, filename);
  try {
    const body = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": mimeTypes[ext] || "application/json; charset=utf-8",
      "cache-control": "no-cache",
      "access-control-allow-origin": "*"
    });
    res.end(body);
  } catch {
    sendJson(res, 404, { error: `${filename} not found` });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    handleOptions(res);
    return;
  }
  if (req.url?.startsWith("/api/chat")) {
    await handleChat(req, res);
    return;
  }
  if (req.url?.startsWith("/api/search")) {
    await handleSearch(req, res);
    return;
  }
  if (req.url?.startsWith("/api/versions")) {
    handleVersions(res);
    return;
  }
  if (req.url?.startsWith("/api/health")) {
    sendJson(res, 200, {
      ok: true,
      providers: providerPriority.map(([name, enabled]) => ({ name, enabled })),
      time: new Date().toISOString()
    });
    return;
  }
  if (req.url === "/openapi.json") {
    await servePackageFile(res, "openapi.json");
    return;
  }
  if (req.url === "/ai-plugin.json" || req.url === "/.well-known/ai-plugin.json") {
    await servePackageFile(res, "ai-plugin.json");
    return;
  }
  if (req.url === "/legal") {
    sendText(res, 200, "志愿助手是非官方本地工具，不承诺录取结果。搜索结果只作为入口，最终以招生章程、省考试院、阳光高考和高校招生网为准。", "text/plain; charset=utf-8");
    return;
  }
  if (req.url === "/icon.svg") {
    sendText(res, 200, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="24" fill="#19705b"/><text x="64" y="82" font-size="70" text-anchor="middle" fill="white" font-family="Arial, sans-serif">志</text></svg>', "image/svg+xml; charset=utf-8");
    return;
  }
  await serveStatic(req, res);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`端口 ${port} 已被占用。请打开 http://localhost:${port}，或设置 PORT=其他端口后重试。`);
    process.exit(1);
  }
  throw error;
});

server.listen(port, () => {
  console.log(`志愿助手 App running at http://localhost:${port}`);
});
