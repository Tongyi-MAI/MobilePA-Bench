// MobilePA-Bench public leaderboard.
// Overall = 0.5*Tool Use + 0.2*Memory + 0.2*Skills + 0.1*Sub-agent.
// Skills is the equal average of SOR and MTSR setting-specific success.
const LEADERBOARD_DATA = [
  { model: "GPT-6-Astra",               org: "OpenAI",    access: "Closed source", overall: 76.87, basic: 75.77, memory: 74.73, skills: 93.25, subagent: 53.93 },
  { model: "Claude-Opus-5",             org: "Anthropic", access: "Closed source", overall: 75.71, basic: 77.60, memory: 71.81, skills: 83.00, subagent: 59.55 },
  { model: "Claude-Fable-5",            org: "Anthropic", access: "Closed source", overall: 74.53, basic: 77.21, memory: 76.33, skills: 69.00, subagent: 68.54 },
  { model: "GLM-5.3",                   org: "Zhipu AI",  access: "744B-A40B",    overall: 73.88, basic: 76.44, memory: 72.07, skills: 77.00, subagent: 58.43 },
  { model: "DeepSeek-V4.1-Flash-1017",  org: "DeepSeek",  access: "763B-A8B/16B",  overall: 71.97, basic: 73.75, memory: 70.74, skills: 80.00, subagent: 49.44 },
  { model: "Qwen-3.8-Max",              org: "Alibaba",   access: "2.4T-A95B",     overall: 71.77, basic: 73.65, memory: 73.14, skills: 75.75, subagent: 51.69 },
  { model: "Muse-Spark-1.3",            org: "Meta",      access: "Closed source", overall: 71.47, basic: 73.08, memory: 73.40, skills: 69.25, subagent: 64.04 },
  { model: "Qwen-3.8-Max-0902",         org: "Alibaba",   access: "2.4T-A95B",     overall: 71.41, basic: 69.71, memory: 69.95, skills: 87.00, subagent: 51.69 },
  { model: "Kimi-K3",                   org: "Moonshot",  access: "2.8T-A104B",    overall: 69.64, basic: 71.54, memory: 71.01, skills: 74.75, subagent: 47.19 },
  { model: "Gemini-3.6-Flash",          org: "Google",    access: "Closed source", overall: 69.61, basic: 74.71, memory: 69.68, skills: 65.75, subagent: 51.69 },
  { model: "GLM-5.3-Flash",             org: "Zhipu AI",  access: "320B-A18B",     overall: 68.31, basic: 71.35, memory: 65.16, skills: 68.25, subagent: 59.55 },
  { model: "Gemini-3.1-Pro",            org: "Google",    access: "Closed source", overall: 68.16, basic: 75.38, memory: 65.69, skills: 55.75, subagent: 61.80 },
  { model: "Qwen-3.8-27B",              org: "Alibaba",   access: "27B",           overall: 67.22, basic: 68.37, memory: 67.82, skills: 73.75, subagent: 47.19 },
  { model: "GLM-5.2",                   org: "Zhipu AI",  access: "744B-A40B",     overall: 66.06, basic: 73.75, memory: 60.37, skills: 58.00, subagent: 55.06 },
  { model: "Claude-Opus-4.8",           org: "Anthropic", access: "Closed source", overall: 66.05, basic: 72.40, memory: 56.38, skills: 69.25, subagent: 47.19 },
  { model: "Qwen-3.7-Max",              org: "Alibaba",   access: "Closed source", overall: 64.89, basic: 72.31, memory: 64.10, skills: 53.75, subagent: 51.69 },
  { model: "Seed-2.1-Pro",              org: "ByteDance", access: "Closed source", overall: 64.89, basic: 70.29, memory: 57.18, skills: 64.00, subagent: 55.06 },
  { model: "Qwen-3.7-Plus",             org: "Alibaba",   access: "Closed source", overall: 62.54, basic: 68.46, memory: 60.90, skills: 54.25, subagent: 52.81 },
  { model: "GPT-5.5",                   org: "OpenAI",    access: "Closed source", overall: 61.94, basic: 65.48, memory: 49.47, skills: 71.25, subagent: 50.56 },
  { model: "GPT-5.6-Sol",               org: "OpenAI",    access: "Closed source", overall: 60.21, basic: 63.94, memory: 48.14, skills: 74.50, subagent: 37.08 },
];
