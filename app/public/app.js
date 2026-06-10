const versions = [
  {
    id: "ultimate",
    color: "#18201a",
    icon: "终",
    title: "终极版",
    subtitle: "不知道选哪个就点我",
    intro: "五个版本合在一起，适合完整咨询。",
    personaTitle: "终极版 · 总控顾问",
    status: "正在同时看现实风险、长期路径、录取规则、院校专业和就业出口。",
    method: "综合现实判断、长期路径、规则核验、院校专业适配和就业出口。",
    tone: "先给一句话结论，再分层拆理由，最后列出必须核验的官方来源。",
    guard: "不承诺录取，不冒充真人老师，不用未经核验的信息下定论。",
    expertNote: "不要只看学校名，要把专业壁垒、城市产业、近三年位次和调剂风险放在一起看。",
    prompts: [
      { label: "完整评估", text: "孩子江苏物化生580分，想学电气或计算机，家庭希望稳定就业，请按冲稳保、专业风险和就业出口帮我判断。", meta: "适合第一次完整咨询" },
      { label: "院校对比", text: "南京信息工程大学、江苏大学、扬州大学，孩子想学计算机或电气，怎么排优先级？", meta: "看学校、城市、专业组合" },
      { label: "风险复查", text: "这套志愿最大的退档、调剂、专业冷门和就业风险分别是什么？请直接指出问题。", meta: "适合提交前复盘" }
    ]
  },
  {
    id: "reality",
    color: "#b84a3d",
    icon: "现",
    title: "现实版",
    subtitle: "先说值不值得",
    intro: "适合快速判断某学校、某专业到底值不值得选。",
    personaTitle: "现实版 · 风险拆解员",
    status: "正在优先判断这件事值不值、坑在哪里、家庭能不能承受试错。",
    method: "按就业、城市、学历门槛、专业壁垒和家庭试错成本分析。",
    tone: "少铺垫，先讲现实结论，再说不推荐或可接受的原因。",
    guard: "不贩卖焦虑，不用单一薪资传闻替代官方就业质量报告。",
    expertNote: "现实判断要看机会成本：同分数能不能换到更强城市、更硬专业或更低调剂风险。",
    prompts: [
      { label: "值不值得", text: "孩子河南理科位次6万，想学金融，值不值得？请直接说现实风险。", meta: "判断专业和家庭成本" },
      { label: "避坑判断", text: "这个学校名字听着不错，但专业一般，我该不该为了学校名牺牲专业？", meta: "看名校光环是否划算" },
      { label: "就业现实", text: "孩子想学新闻、金融、工商管理这类专业，普通家庭要注意哪些就业现实？", meta: "看低壁垒专业风险" }
    ]
  },
  {
    id: "chain",
    color: "#19705b",
    icon: "链",
    title: "全链路版",
    subtitle: "看未来几年",
    intro: "适合不只想填志愿，还想规划本科、读研和就业。",
    personaTitle: "全链路版 · 路线规划师",
    status: "正在把志愿选择连接到本科四年、考研方向、实习和第一份工作。",
    method: "给出 3 个月、1 年、3-7 年的行动路线。",
    tone: "把复杂选择拆成时间线，让每一步都有可执行动作。",
    guard: "不把所有问题都推给考研，也不承诺某条路线一定翻盘。",
    expertNote: "一个志愿方案是否好，不只看录取，还要看后续能否积累项目、证书、实习和升学筹码。",
    prompts: [
      { label: "四年路线", text: "孩子想学计算机，但分数只能去普通一本，请帮我设计本科四年的学习、竞赛、实习和考研路线。", meta: "从录取看到就业" },
      { label: "读研判断", text: "这个专业是不是必须读研？如果不读研，本科就业会遇到什么门槛？", meta: "看学历门槛" },
      { label: "转专业方案", text: "孩子被不太喜欢的专业录取后，本科阶段有哪些转专业、辅修、考研跨考的可行路径？", meta: "看补救空间" }
    ]
  },
  {
    id: "rules",
    color: "#a87318",
    icon: "规",
    title: "规则版",
    subtitle: "讲政策规则",
    intro: "适合看不懂投档、调剂、提前批、专业组。",
    personaTitle: "规则版 · 填报翻译官",
    status: "正在把投档、专业组、调剂、提前批这些规则翻译成家长能理解的话。",
    method: "用定义、影响、误区、操作建议讲清楚。",
    tone: "先讲一句人话定义，再讲这条规则会怎样影响录取结果。",
    guard: "所有政策细节必须回到当年省考试院、招生章程和学校招生网核验。",
    expertNote: "规则问题最怕跨省套用经验。一定要锁定省份、年份、批次、选科和院校专业组。",
    prompts: [
      { label: "规则解释", text: "提前批、专业组、服从调剂到底是什么意思？请用家长能听懂的话讲清楚。", meta: "适合零基础理解" },
      { label: "调剂风险", text: "如果我服从调剂，最坏会被调到什么情况？不服从又有什么风险？", meta: "看退档和冷门风险" },
      { label: "省份核验", text: "我是广东考生，物化生，想填某学校专业组，请告诉我需要核验哪些官方规则。", meta: "避免跨省误判" }
    ]
  },
  {
    id: "fit",
    color: "#315f9d",
    icon: "校",
    title: "院校专业版",
    subtitle: "看适不适合",
    intro: "适合问某个大学或某个专业适不适合孩子。",
    personaTitle: "院校专业版 · 匹配分析师",
    status: "正在把学校层次、专业实力、城市资源和孩子偏好放到同一张表里比较。",
    method: "看学校层次、学科实力、城市、培养方案和就业方向。",
    tone: "先判断匹配度，再指出适合什么孩子、不适合什么家庭。",
    guard: "不只凭学校名气下结论，必须提示查看培养方案、招生计划和就业质量报告。",
    expertNote: "专业适配要看课程结构和产业场景：同名专业在不同学校可能完全不是一个培养方向。",
    prompts: [
      { label: "学校适配", text: "南京信息工程大学的计算机、电子信息、大气科学分别适合什么样的孩子？", meta: "看学校优势专业" },
      { label: "专业比较", text: "电气、自动化、电子信息、计算机这几个专业，普通家庭怎么选更稳？", meta: "看专业壁垒和出口" },
      { label: "城市因素", text: "同样是普通一本，去省会城市弱一点的学校，还是去地级市强一点的专业？", meta: "看城市和资源" }
    ]
  },
  {
    id: "career",
    color: "#5d7e36",
    icon: "职",
    title: "本地职业版",
    subtitle: "看本省和就业",
    intro: "适合重视本省录取规则和毕业后就业。",
    personaTitle: "本地职业版 · 就业落地顾问",
    status: "正在把本省录取机会、本地产业、岗位稳定性和家庭资源一起考虑。",
    method: "把专业对应到行业、岗位、薪资稳定性和成长路径。",
    tone: "讲岗位、讲行业、讲城市，不只讲大学排名。",
    guard: "不把个别高薪案例当平均结果，必须提醒看本地产业和学校就业质量报告。",
    expertNote: "本地就业要看产业密度：同样专业，在有产业集群的城市更容易找到实习和第一份工作。",
    prompts: [
      { label: "本省就业", text: "孩子毕业后大概率留河北，本科专业应该优先看哪些方向和城市？", meta: "看本地产业" },
      { label: "稳定岗位", text: "普通家庭想要稳定就业，电气、护理、师范、计算机该怎么排序？", meta: "看岗位稳定性" },
      { label: "职业路径", text: "某专业毕业后具体能做什么岗位？前三年怎么积累经验？", meta: "把专业落到岗位" }
    ]
  }
];

let activeVersion = versions[0];
let latestAnswer = "";
let latestSearch = null;
let largeText = localStorage.getItem("zyLargeText") === "true";
let currentTutorialText = "";

const $ = (id) => document.getElementById(id);

const tutorials = {
  deepseek: {
    title: "DeepSeek 接入教程",
    intro: "DeepSeek 更像一个会思考的模型 API，它不会自己打开你的本地网页。最稳的做法是：在你的 Agent 程序里把志愿助手注册成一个工具，DeepSeek 需要查志愿时，由你的程序调用这个工具。",
    steps: [
      {
        title: "先把志愿助手跑起来",
        body: "在本机打开终端，进入 app 目录并启动服务。浏览器能打开 http://localhost:5178 就说明服务已经启动。",
        code: "cd app\nnode server.js"
      },
      {
        title: "确认工具地址能访问",
        body: "打开 http://localhost:5178/openapi.json 看接口说明。真正给程序调用的是 POST /api/chat，实时查院校信息的是 GET /api/search。"
      },
      {
        title: "在你的 DeepSeek Agent 里注册工具",
        body: "如果你用的是支持 Function Calling 的 DeepSeek 调用代码，就把 ask_zhiyuan_assistant 定义成一个工具函数。DeepSeek 返回 tool call 后，由你的代码去请求本地志愿助手。",
        code: "POST http://localhost:5178/api/chat\n{\n  \"message\": \"江苏物化生580分，想报南京信息工程大学计算机，稳不稳？\",\n  \"version\": \"ultimate\",\n  \"autoSearch\": true\n}"
      },
      {
        title: "把工具结果交回 DeepSeek",
        body: "DeepSeek 文档里的 Function Calling 流程是：模型提出要调用哪个函数，你的程序执行函数，再把函数结果发回模型。这里的函数结果就是志愿助手返回的 answer 和 search.sources。"
      },
      {
        title: "如果 DeepSeek 平台不能访问 localhost",
        body: "把本 APP 部署到服务器，或用内网穿透生成 HTTPS 地址，再把 localhost 全部换成公网地址。"
      }
    ],
    links: [
      ["DeepSeek API 入门", "https://api-docs.deepseek.com/"],
      ["DeepSeek Function Calling", "https://api-docs.deepseek.com/guides/function_calling"]
    ]
  },
  openai: {
    title: "OpenAI 接入教程",
    intro: "OpenAI 侧建议优先按 ChatGPT Apps / MCP 的思路接入：模型看到的是工具，界面可以作为小组件显示。当前模块已经准备好可调用接口和可嵌入界面。",
    steps: [
      {
        title: "先启动本地服务",
        body: "本地试用时先运行服务。打开 http://localhost:5178/openapi.json 能看到接口，说明外接描述已经可用。",
        code: "cd app\nnode server.js"
      },
      {
        title: "短期接法：导入 OpenAPI",
        body: "如果你的 OpenAI 相关平台或代理框架支持 OpenAPI/HTTP 工具导入，就填入 http://localhost:5178/openapi.json。云端平台通常不能直接访问你的 localhost，需要先部署成 HTTPS 地址。"
      },
      {
        title: "正式接法：包一层 MCP 工具",
        body: "ChatGPT Apps 使用 MCP 连接工具。你可以把 /api/chat 包成 chatWithZhiyuanAssistant 工具，把 /api/search 包成 searchSchoolInfo 工具，再把工具暴露给 ChatGPT。"
      },
      {
        title: "需要界面时嵌入组件",
        body: "如果宿主支持网页组件，把 /embed.js 指向一个页面容器；如果是 ChatGPT Apps，就把组件资源作为 MCP UI resource 暴露，让宿主用 iframe 渲染。",
        code: "<div id=\"zhiyuan-assistant-widget\"></div>\n<script src=\"https://你的域名/embed.js\" data-base-url=\"https://你的域名\" data-mount=\"zhiyuan-assistant-widget\"></script>"
      },
      {
        title: "测试一句真实问题",
        body: "测试时问：江苏物化生580分，想报南京信息工程大学计算机，稳不稳？如果回答里有来源列表和官方核验提醒，说明工具链已经通了。"
      }
    ],
    links: [
      ["OpenAI Apps SDK", "https://developers.openai.com/apps-sdk"],
      ["构建 MCP Server", "https://developers.openai.com/apps-sdk/build/mcp-server"],
      ["连接到 ChatGPT", "https://developers.openai.com/apps-sdk/deploy/connect-chatgpt"]
    ]
  }
};

function buildPrompt(version) {
  return `你是“志愿助手”的${version.title}。

请用家长能听懂的大白话回答，不要说复杂术语。

边界：
- 不冒充任何真实老师。
- 不承诺录取结果。
- 涉及院校、招生章程、选科要求、录取位次、就业质量报告时，必须提醒用户核验官方来源。

本版本方法：
${version.method}

回答格式：
1. 先给一句简单结论
2. 再说为什么
3. 列出需要补充的信息
4. 给出下一步怎么查、怎么选
5. 标明哪些内容必须看官方来源`;
}

function renderVersions() {
  const nav = $("versionNav");
  nav.innerHTML = versions.map((item) => `
    <button type="button" data-id="${item.id}" style="--accent:${item.color}" aria-selected="${item.id === activeVersion.id}">
      <span class="nav-icon">${item.icon}</span>
      <span>
        <span class="nav-title">${item.title}</span>
        <span class="nav-desc">${item.subtitle}</span>
      </span>
    </button>
  `).join("");

  nav.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeVersion = versions.find((item) => item.id === button.dataset.id) || versions[0];
      renderVersions();
      renderActiveVersion();
    });
  });
}

function renderActiveVersion() {
  $("activeVersionBadge").textContent = activeVersion.title;
  $("versionIntro").textContent = activeVersion.intro;
  $("personaMode").textContent = activeVersion.title;
  $("personaIcon").textContent = activeVersion.icon;
  $("personaIcon").style.background = activeVersion.color;
  $("personaTitle").textContent = activeVersion.personaTitle;
  $("personaStatus").textContent = activeVersion.status;
  $("personaFocus").textContent = activeVersion.method;
  $("personaTone").textContent = activeVersion.tone;
  $("personaGuard").textContent = activeVersion.guard;
  $("expertNote").textContent = activeVersion.expertNote;
  renderPromptCards();
}

function renderPromptCards() {
  $("promptCards").innerHTML = activeVersion.prompts.map((item) => `
    <button class="prompt-card" type="button" data-prompt="${escapeAttr(item.text)}">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.text)}</strong>
      <em>${escapeHtml(item.meta)}</em>
    </button>
  `).join("");

  document.querySelectorAll(".prompt-card").forEach((button) => {
    button.addEventListener("click", () => {
      $("messageInput").value = button.dataset.prompt;
      $("messageInput").focus();
    });
  });
}

function currentPromptSetText() {
  const promptLines = activeVersion.prompts.map((item, index) => `${index + 1}. ${item.label}\n${item.text}\n用途：${item.meta}`).join("\n\n");
  return `${activeVersion.title}\n\n人物状态：${activeVersion.status}\n判断重点：${activeVersion.method}\n说话方式：${activeVersion.tone}\n\n推荐提问：\n${promptLines}`;
}

function appendBubble(role, text) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  bubble.innerHTML = `<strong>${role === "user" ? "你" : "志愿助手"}：</strong><p>${escapeHtml(text)}</p>`;
  $("chatBox").appendChild(bubble);
  $("chatBox").scrollTop = $("chatBox").scrollHeight;
}

async function handleChat(event) {
  event.preventDefault();
  const message = $("messageInput").value.trim();
  if (!message) return;

  appendBubble("user", message);
  $("messageInput").value = "";
  appendBubble("assistant", "我正在查最新院校信息，请稍等一下。");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message,
        version: activeVersion.id,
        school: $("schoolInput").value.trim(),
        province: $("provinceInput").value.trim(),
        year: $("yearInput").value.trim(),
        autoSearch: true
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "请求失败");
    latestAnswer = data.answer || "";
    latestSearch = data.search || null;
    replaceLastAssistant(latestAnswer);
    renderSearch(latestSearch);
  } catch (error) {
    replaceLastAssistant(`这次没有查成功：${error.message}\n\n你可以稍后再试，或者配置搜索 API。`);
  }
}

function replaceLastAssistant(text) {
  const bubbles = [...document.querySelectorAll(".bubble.assistant")];
  const last = bubbles[bubbles.length - 1];
  if (last) {
    last.innerHTML = `<strong>志愿助手：</strong><p>${escapeHtml(text)}</p>`;
  } else {
    appendBubble("assistant", text);
  }
}

function renderSearch(data) {
  if (!data) {
    $("updatedAt").textContent = "未搜索";
    $("summaryBox").textContent = "没有识别到明确院校。你可以在问题里写上学校全名。";
    $("sourceList").innerHTML = "";
    return;
  }

  $("updatedAt").textContent = new Date(data.searchedAt).toLocaleString("zh-CN");
  $("summaryBox").textContent = data.summary;
  $("sourceList").innerHTML = data.results.slice(0, 12).map((item, index) => `
    <article class="source-card">
      <div class="source-meta">
        <span class="chip ${item.score >= 85 ? "good" : item.score < 60 ? "warn" : ""}">${escapeHtml(item.sourceType)}</span>
        <span class="chip">可信度 ${item.score}</span>
        <span class="chip">${escapeHtml(item.provider)}</span>
      </div>
      <a href="${escapeAttr(item.url)}" target="_blank" rel="noreferrer">${index + 1}. ${escapeHtml(item.title || item.url)}</a>
      <p>${escapeHtml(item.snippet || "无摘要，请打开来源核验。")}</p>
    </article>
  `).join("");
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    const enabled = data.providers.filter((item) => item.enabled).map((item) => item.name);
    $("providerBadge").textContent = `搜索：${enabled.join(" / ")}`;
  } catch {
    $("providerBadge").textContent = "搜索服务未连接";
  }
}

function renderTextMode() {
  document.documentElement.classList.toggle("large-text", largeText);
  $("fontToggle").textContent = largeText ? "恢复默认字" : "大字模式";
  $("fontToggle").setAttribute("aria-pressed", String(largeText));
}

function toggleTextMode() {
  largeText = !largeText;
  localStorage.setItem("zyLargeText", String(largeText));
  renderTextMode();
}

function tutorialToText(tutorial) {
  const steps = tutorial.steps.map((step, index) => {
    const code = step.code ? `\n${step.code}` : "";
    return `${index + 1}. ${step.title}\n${step.body}${code}`;
  }).join("\n\n");
  const links = tutorial.links.map(([label, url]) => `- ${label}: ${url}`).join("\n");
  return `${tutorial.title}\n\n${tutorial.intro}\n\n${steps}\n\n参考入口：\n${links}`;
}

function openTutorial(kind) {
  const tutorial = tutorials[kind];
  if (!tutorial) return;

  currentTutorialText = tutorialToText(tutorial);
  $("tutorialTitle").textContent = tutorial.title;
  $("tutorialBody").innerHTML = `
    <p>${escapeHtml(tutorial.intro)}</p>
    <ol>
      ${tutorial.steps.map((step) => `
        <li>
          <strong>${escapeHtml(step.title)}</strong>
          <p>${escapeHtml(step.body)}</p>
          ${step.code ? `<pre><code>${escapeHtml(step.code)}</code></pre>` : ""}
        </li>
      `).join("")}
    </ol>
    <p><strong>参考入口：</strong>${tutorial.links.map(([label, url]) => ` <a href="${escapeAttr(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`).join(" / ")}</p>
  `;
  $("tutorialModal").hidden = false;
  $("closeTutorial").focus();
}

function closeTutorial() {
  $("tutorialModal").hidden = true;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("已复制");
  } catch {
    showToast("复制受限，请手动选中文本");
  }
}

function showToast(text) {
  $("toast").textContent = text;
  $("toast").classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => $("toast").classList.remove("show"), 1600);
}

$("chatForm").addEventListener("submit", handleChat);
$("clearChat").addEventListener("click", () => {
  $("chatBox").innerHTML = '<div class="bubble assistant"><strong>志愿助手：</strong><p>你可以这样问：江苏物化生 580 分，想报南京信息工程大学计算机，稳不稳？</p></div>';
  $("sourceList").innerHTML = "";
  $("summaryBox").textContent = "我会优先找学校招生网、阳光高考、省考试院、就业质量报告。搜索结果只是入口，最终要点开官方网页核验。";
  latestAnswer = "";
});
$("copyAnswer").addEventListener("click", () => copyText(latestAnswer || $("chatBox").innerText));
$("copyPromptSet").addEventListener("click", () => copyText(currentPromptSetText()));
$("fontToggle").addEventListener("click", toggleTextMode);
$("closeTutorial").addEventListener("click", closeTutorial);
$("copyTutorial").addEventListener("click", () => copyText(currentTutorialText));
$("tutorialModal").addEventListener("click", (event) => {
  if (event.target === $("tutorialModal")) closeTutorial();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("tutorialModal").hidden) closeTutorial();
});
document.querySelectorAll(".tutorial-btn").forEach((button) => {
  button.addEventListener("click", () => openTutorial(button.dataset.tutorial));
});
document.querySelectorAll(".quick").forEach((button) => {
  button.addEventListener("click", () => {
    $("messageInput").value = button.dataset.example;
    $("messageInput").focus();
  });
});

renderTextMode();
renderVersions();
renderActiveVersion();
checkHealth();
