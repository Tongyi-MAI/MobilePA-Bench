// MobilePA-Bench v1.5 leaderboard data (from paper_v5 Table 1, tab:main_results)
// Overall = 0.5*Tool + 0.2*Memory + 0.2*Skills + 0.1*SubAgent
// info: org used only for optional grouping/badges.
const LEADERBOARD_DATA = [
  { model: "Claude-Opus-5",    org: "Anthropic",  overall: 75.52, basic: 83.85, subagent: 62.92, memory: 58.51, skills: 78.00, costPer1k: 6.54 },
  { model: "Claude-Fable-5",   org: "Anthropic",  overall: 75.31, basic: 83.37, subagent: 70.79, memory: 62.50, skills: 70.25, costPer1k: 13.43 },
  { model: "Kimi-K3",          org: "Moonshot",   overall: 73.01, basic: 77.40, subagent: 62.92, memory: 63.56, skills: 76.50, costPer1k: 4.05 },
  { model: "Qwen-3.8-Max",     org: "Alibaba",    overall: 72.51, basic: 77.88, subagent: 53.93, memory: 64.63, skills: 76.25, costPer1k: 1.50 },
  { model: "Gemini-3.6-Flash", org: "Google",     overall: 71.21, basic: 78.65, subagent: 66.29, memory: 62.77, skills: 63.50, costPer1k: 0.83 },
  { model: "Gemini-3.1-Pro",   org: "Google",     overall: 71.18, basic: 80.58, subagent: 77.53, memory: 48.67, skills: 67.00, costPer1k: 2.33 },
  { model: "GLM-5.2",          org: "Zhipu",      overall: 67.71, basic: 76.06, subagent: 61.80, memory: 49.73, skills: 67.75, costPer1k: 1.64 },
  { model: "Claude-Opus-4.8",  org: "Anthropic",  overall: 65.52, basic: 79.04, subagent: 50.56, memory: 37.23, skills: 67.50, costPer1k: 7.08 },
  { model: "Qwen-3.7-Max",     org: "Alibaba",    overall: 64.71, basic: 76.54, subagent: 50.56, memory: 53.19, skills: 53.75, costPer1k: 1.50 },
  { model: "Seed-2.1-Pro",     org: "ByteDance",  overall: 63.65, basic: 72.98, subagent: 59.55, memory: 42.29, skills: 63.75, costPer1k: 1.20 },
  { model: "GPT-5.6-Sol",      org: "OpenAI",     overall: 62.68, basic: 69.81, subagent: 49.44, memory: 44.15, skills: 70.00, costPer1k: 6.64 },
  { model: "GPT-5.5",          org: "OpenAI",     overall: 61.44, basic: 68.94, subagent: 51.69, memory: 41.76, skills: 67.25, costPer1k: 7.28 },
  { model: "Kimi-2.6",         org: "Moonshot",   overall: 55.63, basic: 70.38, subagent: 43.82, memory: 33.78, skills: 46.50, costPer1k: 0.89 },
];
