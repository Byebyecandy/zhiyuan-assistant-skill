import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(__dirname, "zhiyuan-assistant-douyin-promo.mp4");
const tmpDir = path.join(__dirname, ".tmp-video-text");
const duration = 28;

const ffmpegCandidates = [
  process.env.FFMPEG_PATH,
  "D:\\EVCapture\\ffmpeg.exe",
  "D:\\oopz\\ffmpeg.exe",
  "C:\\Users\\21914\\AppData\\Local\\JianyingPro\\Apps\\10.4.0.13957\\ffmpeg.exe",
  "C:\\Users\\21914\\AppData\\Local\\JianyingPro\\Apps\\10.3.0.13901\\ffmpeg.exe",
  "ffmpeg"
].filter(Boolean);

const ffmpeg = ffmpegCandidates.find((candidate) => {
  if (candidate === "ffmpeg") return true;
  return fs.existsSync(candidate);
});

if (!ffmpeg) {
  throw new Error("没有找到 ffmpeg。可以设置 FFMPEG_PATH 指向 ffmpeg.exe 后重试。");
}

const regularFont = "C:\\Windows\\Fonts\\msyh.ttc";
const boldFont = "C:\\Windows\\Fonts\\msyhbd.ttc";

function filterPath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1\\:");
}

function ensureTmp() {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });
}

function textFile(name, text) {
  const fileName = `${name}.txt`;
  fs.writeFileSync(path.join(tmpDir, fileName), text, "utf8");
  return fileName;
}

function enable(start, end) {
  return `enable='between(t,${start},${end})'`;
}

function drawText({ file, font = boldFont, size, color = "0x18201a", x = "(w-text_w)/2", y, start = 0, end = duration, extra = "" }) {
  const suffix = extra ? `:${extra}` : "";
  return `drawtext=fontfile='${filterPath(font)}':textfile='${file}':fontsize=${size}:fontcolor=${color}:x=${x}:y=${y}:line_spacing=18:${enable(start, end)}${suffix}`;
}

ensureTmp();

const scenes = [
  {
    start: 0,
    end: 4,
    title: "志愿别只看学校名",
    body: "分数、位次、专业、城市\n一起放到桌面上判断",
    badge: "给家长看的高考志愿 Skill"
  },
  {
    start: 4,
    end: 8,
    title: "5 个判断版本",
    body: "现实版  全链路版  规则版\n院校专业版  本地职业版",
    badge: "不会选，就先点终极版"
  },
  {
    start: 8,
    end: 12,
    title: "终极版一键整合",
    body: "录取风险、调剂风险\n专业壁垒、就业出口一起看",
    badge: "外行也能直接问"
  },
  {
    start: 12,
    end: 16,
    title: "实时查院校来源",
    body: "优先看招生网、省考试院\n阳光高考、就业质量报告",
    badge: "先查来源，再做选择"
  },
  {
    start: 16,
    end: 20,
    title: "内行也能看变量",
    body: "近三年位次、城市产业\n专业组规则、家庭试错成本",
    badge: "不只给答案，也给判断框架"
  },
  {
    start: 20,
    end: 24,
    title: "本地部署，可外接 AI",
    body: "保留 DeepSeek / OpenAI 教程\n也能嵌到自己的 AI 工作流",
    badge: "一个可发布到 GitHub 的外置包"
  },
  {
    start: 24,
    end: 28,
    title: "志愿助手",
    body: "让外行人直接用\n让内行人有所收获",
    badge: "不承诺录取，结论回到官方来源"
  }
];

const filters = [
  "format=rgba",
  "drawbox=x=0:y=0:w=1080:h=1920:color=0xf5f7f1:t=fill",
  "drawbox=x=0:y=0:w=1080:h=232:color=0x17201a:t=fill",
  "drawbox=x=68:y=288:w=944:h=1090:color=0xffffff:t=fill",
  "drawbox=x=68:y=288:w=14:h=1090:color=0x19705b:t=fill",
  "drawbox=x=96:y=1510:w=888:h=250:color=0x17201a:t=fill",
  drawText({ file: textFile("brand", "志愿助手"), size: 54, color: "0xffffff", y: 74, start: 0, end: duration }),
  drawText({ file: textFile("brand_sub", "本地可部署 · 实时搜索院校信息 · 6 种判断版本"), font: regularFont, size: 28, color: "0xd9e2dc", y: 148, start: 0, end: duration }),
  drawText({ file: textFile("cta_title", "打开浏览器就能问"), size: 52, color: "0xffffff", y: 1560, start: 0, end: duration }),
  drawText({ file: textFile("cta_sub", "分数 / 位次 / 选科 / 学校 / 专业，一句话开始"), font: regularFont, size: 31, color: "0xd9e2dc", y: 1640, start: 0, end: duration }),
  drawText({ file: textFile("footer", "提示：不承诺录取，最终以招生章程、省考试院和学校官网为准"), font: regularFont, size: 26, color: "0x5f6b64", y: 1810, start: 0, end: duration })
];

scenes.forEach((scene, index) => {
  filters.push(
    drawText({ file: textFile(`scene_${index}_badge`, scene.badge), font: regularFont, size: 30, color: "0x19705b", y: 360, start: scene.start, end: scene.end }),
    drawText({ file: textFile(`scene_${index}_title`, scene.title), size: 74, color: "0x18201a", y: 475, start: scene.start, end: scene.end }),
    drawText({ file: textFile(`scene_${index}_body`, scene.body), font: regularFont, size: 45, color: "0x304039", y: 680, start: scene.start, end: scene.end })
  );
});

filters.push("format=yuv420p");

const args = [
  "-y",
  "-f", "lavfi",
  "-i", `color=c=0xf5f7f1:s=1080x1920:r=30:d=${duration}`,
  "-vf", filters.join(","),
  "-t", String(duration),
  "-c:v", "libx264",
  "-pix_fmt", "yuv420p",
  "-preset", "medium",
  "-crf", "20",
  "-movflags", "+faststart",
  output
];

const result = spawnSync(ffmpeg, args, {
  cwd: tmpDir,
  stdio: "inherit"
});

fs.rmSync(tmpDir, { recursive: true, force: true });

if (result.status !== 0) {
  throw new Error(`ffmpeg 生成失败，退出码 ${result.status}`);
}

console.log(`视频已生成：${output}`);
