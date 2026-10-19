// MobilePA-Bench revised-paper leaderboard (paper_v5, Table 1).
// Overall = 0.5*Tool Use + 0.2*Memory + 0.2*Skills + 0.1*Sub-agent.
// Skills is the equal average of SOR and MTSR setting-specific success.
const LEADERBOARD_DATA = [
  { model: "GPT-6-Astra",       org: "OpenAI",    access: "Closed source", overall: 76.87, basic: 75.77, memory: 74.73, skills: 93.25, subagent: 53.93 },
  { model: "Claude-Opus-5",     org: "Anthropic", access: "Closed source", overall: 75.71, basic: 77.60, memory: 71.81, skills: 83.00, subagent: 59.55 },
  { model: "Claude-Fable-5",    org: "Anthropic", access: "Closed source", overall: 74.53, basic: 77.21, memory: 76.33, skills: 69.00, subagent: 68.54 },
  { model: "Gemini-3.6-Flash",  org: "Google",    access: "Closed source", overall: 69.61, basic: 74.71, memory: 69.68, skills: 65.75, subagent: 51.69 },
  { model: "Gemini-3.1-Pro",    org: "Google",    access: "Closed source", overall: 68.16, basic: 75.38, memory: 65.69, skills: 55.75, subagent: 61.80 },
  { model: "Claude-Opus-4.8",   org: "Anthropic", access: "Closed source", overall: 66.05, basic: 72.40, memory: 56.38, skills: 69.25, subagent: 47.19 },
  { model: "Qwen-3.7-Max",      org: "Alibaba",   access: "Closed source", overall: 64.89, basic: 72.31, memory: 64.10, skills: 53.75, subagent: 51.69 },
  { model: "Seed-2.1-Pro",      org: "ByteDance", access: "Closed source", overall: 64.89, basic: 70.29, memory: 57.18, skills: 64.00, subagent: 55.06 },
  { model: "GLM-5.3",           org: "Zhipu AI",  access: "744B-A40B",    overall: 73.88, basic: 76.44, memory: 72.07, skills: 77.00, subagent: 58.43 },
  { model: "Qwen-3.8-Max",      org: "Alibaba",   access: "2.4T-A95B",    overall: 71.77, basic: 73.65, memory: 73.14, skills: 75.75, subagent: 51.69 },
  { model: "Kimi-K3",           org: "Moonshot",  access: "2.8T-A104B",   overall: 69.64, basic: 71.54, memory: 71.01, skills: 74.75, subagent: 47.19 },
  { model: "GLM-5.3-Flash",     org: "Zhipu AI",  access: "320B-A18B",    overall: 68.31, basic: 71.35, memory: 65.16, skills: 68.25, subagent: 59.55 },
  { model: "GLM-5.2",           org: "Zhipu AI",  access: "744B-A40B",    overall: 66.06, basic: 73.75, memory: 60.37, skills: 58.00, subagent: 55.06 },
];
