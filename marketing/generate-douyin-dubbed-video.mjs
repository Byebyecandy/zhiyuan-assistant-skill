import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(__dirname, ".tmp-dubbed-video");
const output = path.join(__dirname, "zhiyuan-assistant-douyin-ai-mambo.mp4");
const coverOutput = path.join(__dirname, "zhiyuan-assistant-douyin-ai-mambo-cover.png");
const scriptOutput = path.join(__dirname, "voiceover-script-ai-mambo.md");

const ffmpegCandidates = [
  process.env.FFMPEG_PATH,
  "D:\\EVCapture\\ffmpeg.exe",
  "D:\\oopz\\ffmpeg.exe",
  "C:\\Users\\21914\\AppData\\Local\\JianyingPro\\Apps\\10.4.0.13957\\ffmpeg.exe",
  "C:\\Users\\21914\\AppData\\Local\\JianyingPro\\Apps\\10.3.0.13901\\ffmpeg.exe",
  "ffmpeg"
].filter(Boolean);

const ffmpeg = ffmpegCandidates.find((candidate) => candidate === "ffmpeg" || fs.existsSync(candidate));
const ffprobe = ffmpeg && ffmpeg !== "ffmpeg" ? path.join(path.dirname(ffmpeg), "ffprobe.exe") : "ffprobe";

if (!ffmpeg) {
  throw new Error("没有找到 ffmpeg。可以设置 FFMPEG_PATH 指向 ffmpeg.exe 后重试。");
}

const regularFont = "C:\\Windows\\Fonts\\msyh.ttc";
const boldFont = "C:\\Windows\\Fonts\\msyhbd.ttc";

const scenes = [
  {
    badge: "非官方 · AI 仅供参考",
    title: "雪峰老师 miss 了？",
    body: "我写了个“秽土转生”版\n志愿助手 Skill",
    narration: "雪峰老师 miss 了，我写了一个秽土转生版的非官方志愿助手，还是想帮大家填志愿。"
  },
  {
    badge: "公开思路整合，不冒充本人",
    title: "多个判断思路杂合",
    body: "参考网上几类知名老师\n常见的推荐说法",
    narration: "同时还杂合了网上几个比较知名老师常见的推荐说法。大家喜欢可以参考，但是一定要明白，AI 还是仅供参考。"
  },
  {
    badge: "第一条：别只看学校名",
    title: "分数不是唯一答案",
    body: "分数、位次、专业、城市\n要放在一起判断",
    narration: "填志愿最怕只看学校名。分数、位次、专业、城市、家庭成本，都要放在同一张桌面上判断。"
  },
  {
    badge: "6 个可选版本",
    title: "不知道选哪个？",
    body: "现实版、规则版、院校专业版\n本地职业版、全链路版、终极版",
    narration: "这个助手做了六个版本。现实版看值不值，规则版讲政策，院校专业版看匹配，本地职业版看就业，全链路版看未来几年。"
  },
  {
    badge: "终极版一键整合",
    title: "外行人直接问",
    body: "孩子多少分、什么选科\n想报什么学校，直接说",
    narration: "如果你是外行，不用懂那些复杂术语。直接说孩子多少分，什么选科，想报什么学校和专业，它就会按终极版帮你拆。"
  },
  {
    badge: "实时搜索来源",
    title: "结论回到官方",
    body: "招生网、省考试院\n阳光高考、就业质量报告",
    narration: "它会实时搜索学校招生网、省考试院、阳光高考和就业质量报告。搜索结果只是入口，最后一定要回到官方来源核验。"
  },
  {
    badge: "内行看变量",
    title: "不只给答案",
    body: "近三年位次、专业壁垒\n城市产业、调剂风险",
    narration: "如果你是内行，也可以看它的判断变量。近三年位次、专业壁垒、城市产业、调剂风险、就业出口，这些才是真正影响选择的东西。"
  },
  {
    badge: "最后说句实在话",
    title: "AI 不是算命",
    body: "它不能替你决定人生\n但能帮你少走弯路",
    narration: "AI 不是算命，也不能替任何家庭决定人生。它能做的，是把信息差缩小一点，把风险讲清楚一点，把选择权多还给普通家庭一点。"
  },
  {
    badge: "愿每个孩子都被认真看见",
    title: "志愿不是终点",
    body: "它是孩子走向世界的\n第一张路线图",
    narration: "填志愿不是给孩子定命，而是帮孩子把第一步走清楚。愿每个孩子，都能在更清楚的选择里，走向更开阔的人生。"
  }
];

function filterPath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1\\:");
}

function ensureTmp() {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });
}

function writeTextFile(name, text) {
  const fileName = `${name}.txt`;
  fs.writeFileSync(path.join(tmpDir, fileName), text, "utf8");
  return fileName;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: options.stdio || "pipe",
    ...options
  });

  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(`${command} 执行失败，退出码 ${result.status}\n${details}`);
  }

  return result;
}

function synthesize(textPath, wavPath) {
  const ps1Path = path.join(tmpDir, "synthesize.ps1");
  const script = `
param(
  [string]$TextPath,
  [string]$WavPath
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice = $s.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Culture.Name -eq 'zh-CN' } | Select-Object -First 1
if ($voice) { $s.SelectVoice($voice.VoiceInfo.Name) }
$s.Rate = 6
$s.Volume = 100
$text = [System.IO.File]::ReadAllText($TextPath, [System.Text.Encoding]::UTF8)
$s.SetOutputToWaveFile($WavPath)
$s.Speak($text)
$s.Dispose()
`;
  fs.writeFileSync(ps1Path, script, "utf8");

  run("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    ps1Path,
    textPath,
    wavPath
  ]);
}

function getDuration(filePath) {
  const probePath = fs.existsSync(ffprobe) ? ffprobe : "ffprobe";
  const result = run(probePath, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=nokey=1:noprint_wrappers=1",
    filePath
  ]);
  return Number.parseFloat(result.stdout.trim());
}

function drawText({ file, font = boldFont, size, color = "0x18201a", x = "(w-text_w)/2", y, start, end, extra = "" }) {
  const suffix = extra ? `:${extra}` : "";
  return `drawtext=fontfile='${filterPath(font)}':textfile='${file}':fontsize=${size}:fontcolor=${color}:x=${x}:y=${y}:line_spacing=18:enable='between(t,${start.toFixed(3)},${end.toFixed(3)})'${suffix}`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${rest.toFixed(1).padStart(4, "0")}`;
}

ensureTmp();

const concatList = [];
let cursor = 0;
const timedScenes = [];

scenes.forEach((scene, index) => {
  const txt = path.join(tmpDir, `scene_${index}.txt`);
  const rawWav = path.join(tmpDir, `scene_${index}_raw.wav`);
  const wav = path.join(tmpDir, `scene_${index}.wav`);
  fs.writeFileSync(txt, scene.narration, "utf8");
  synthesize(txt, rawWav);

  const rawDuration = getDuration(rawWav);
  const duration = Math.max(rawDuration + 0.18, 3.4);
  run(ffmpeg, [
    "-y",
    "-i", rawWav,
    "-af", "apad",
    "-t", duration.toFixed(3),
    "-c:a", "pcm_s16le",
    wav
  ], { stdio: "inherit" });

  timedScenes.push({ ...scene, start: cursor, end: cursor + duration, duration });
  cursor += duration;
  concatList.push(`file 'scene_${index}.wav'`);
});

fs.writeFileSync(path.join(tmpDir, "concat.txt"), concatList.join("\n"), "utf8");

const narrationWav = path.join(tmpDir, "narration.wav");
run(ffmpeg, [
  "-y",
  "-f", "concat",
  "-safe", "0",
  "-i", "concat.txt",
  "-c:a", "pcm_s16le",
  narrationWav
], { cwd: tmpDir, stdio: "inherit" });

const totalDuration = Math.max(getDuration(narrationWav), cursor);

const filters = [
  "format=rgba",
  "drawbox=x=0:y=0:w=1080:h=1920:color=0xf5f7f1:t=fill",
  "drawbox=x=0:y=0:w=1080:h=232:color=0x17201a:t=fill",
  "drawbox=x=68:y=286:w=944:h=1104:color=0xffffff:t=fill",
  "drawbox=x=68:y=286:w=14:h=1104:color=0x19705b:t=fill",
  "drawbox=x=96:y=1510:w=888:h=250:color=0x17201a:t=fill",
  drawText({ file: writeTextFile("brand", "志愿助手"), size: 54, color: "0xffffff", y: 74, start: 0, end: totalDuration }),
  drawText({ file: writeTextFile("brand_sub", "非官方 · AI 仅供参考 · 结论回到官方来源"), font: regularFont, size: 28, color: "0xd9e2dc", y: 148, start: 0, end: totalDuration }),
  drawText({ file: writeTextFile("cta_title", "外行直接问，内行看变量"), size: 48, color: "0xffffff", y: 1560, start: 0, end: totalDuration }),
  drawText({ file: writeTextFile("cta_sub", "分数 / 位次 / 选科 / 学校 / 专业，一句话开始"), font: regularFont, size: 30, color: "0xd9e2dc", y: 1640, start: 0, end: totalDuration }),
  drawText({ file: writeTextFile("footer", "不承诺录取，最终以招生章程、省考试院和学校官网为准"), font: regularFont, size: 25, color: "0x5f6b64", y: 1810, start: 0, end: totalDuration })
];

timedScenes.forEach((scene, index) => {
  filters.push(
    drawText({ file: writeTextFile(`scene_${index}_badge`, scene.badge), font: regularFont, size: 30, color: "0x19705b", y: 358, start: scene.start, end: scene.end }),
    drawText({ file: writeTextFile(`scene_${index}_title`, scene.title), size: 68, color: "0x18201a", y: 468, start: scene.start, end: scene.end }),
    drawText({ file: writeTextFile(`scene_${index}_body`, scene.body), font: regularFont, size: 43, color: "0x304039", y: 668, start: scene.start, end: scene.end })
  );
});

filters.push("format=yuv420p");

run(ffmpeg, [
  "-y",
  "-f", "lavfi",
  "-i", `color=c=0xf5f7f1:s=1080x1920:r=30:d=${totalDuration.toFixed(3)}`,
  "-i", narrationWav,
  "-vf", filters.join(","),
  "-t", totalDuration.toFixed(3),
  "-shortest",
  "-c:v", "libx264",
  "-pix_fmt", "yuv420p",
  "-preset", "medium",
  "-crf", "20",
  "-c:a", "aac",
  "-b:a", "160k",
  "-movflags", "+faststart",
  output
], { cwd: tmpDir, stdio: "inherit" });

run(ffmpeg, [
  "-y",
  "-ss", "2",
  "-i", output,
  "-frames:v", "1",
  coverOutput
], { stdio: "inherit" });

const scriptMarkdown = [
  "# AI 曼波式口播文案",
  "",
  "说明：这是非官方宣传口播，不克隆或冒充任何真实老师。AI 建议仅供参考，最终必须核验官方来源。",
  "",
  ...timedScenes.map((scene) => `## ${formatTime(scene.start)} - ${formatTime(scene.end)}\n\n${scene.narration}\n`)
].join("\n");

fs.writeFileSync(scriptOutput, scriptMarkdown, "utf8");
fs.rmSync(tmpDir, { recursive: true, force: true });

console.log(`带配音视频已生成：${output}`);
console.log(`封面已生成：${coverOutput}`);
console.log(`口播文案已生成：${scriptOutput}`);
