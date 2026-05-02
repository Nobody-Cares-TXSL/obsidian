**Superpowers + gstack 最佳实践使用指南**

> 最后更新：2026-05-02，基于 Superpowers v5.0.7 + gstack v1.25.1.0 实际安装验证

## 更新日志源文件

更新本文档时，读取以下两个文件获取最新版本信息：

- Superpowers：`~/.claude/plugins/cache/claude-plugins-official/superpowers/*/CHANGELOG.md`
- gstack：`~/.claude/skills/gstack/CHANGELOG.md`

---

## 设计哲学

这套组合的核心理念：**不要把 AI 当 Copilot（副驾驶），要当完整的虚拟工程团队**。

- **gstack** = 管理层 + 评审团（CEO、产品经理、QA、安全官）— 管"想什么"和"做什么"
- **Superpowers** = 执行层 + 车间主任（架构师、编码员、测试）— 管"怎么写"和"怎么测"

角色隔离是关键：AI 最容易犯的错误是"一边发散需求一边写代码"（Scope Creep + 上下文污染），这两个插件通过**阶段门控**强制分离决策和执行，每个阶段输出明确的文档/代码制品后才进入下一阶段。

---

## 插件概况

| 插件 | 版本 | 来源 | 定位 |
|:-----|:-----|:-----|:-----|
| Superpowers | 5.0.7 | claude-plugins-official marketplace | 流程铁律派：强制 TDD + 子代理 + 结构化执行 |
| gstack | 1.25.1.0 | ~/.claude/skills/gstack/（手动安装） | 虚拟团队派：43 个 slash commands，CEO/设计师/工程经理/QA 等角色 |

---

## 一、Superpowers 单独使用

### 核心机制：Skills 自动触发

Superpowers 的 14 个 skills **不需要手动调用**（除了 receiving-code-review 和 writing-skills），在合适时机自动介入。

### 完整 Skill 链路（推荐流程）

```
brainstorming（硬性门控）
  → writing-plans
    → using-git-worktrees（创建隔离环境）
      → subagent-driven-development（推荐）或 executing-plans（备选）
        → test-driven-development（每个任务强制 TDD）
      → requesting-code-review（任务间）
    → finishing-a-development-branch（全部完成后）
```

**独立触发的 skills**（随时可用）：
- `systematic-debugging`（硬性）— 遇 bug 自动启动 4 阶段根因分析
- `verification-before-completion`（硬性）— 声称完成前必须验证
- `dispatching-parallel-agents` — 多个独立任务并行

### 四个硬性门控（不可绕过）

| Skill | 触发时机 | 铁律 |
|:------|:---------|:-----|
| brainstorming | 任何创意工作之前 | 没有设计文档就不能写代码 |
| test-driven-development | 任何实现之前 | 没有失败测试就不能写生产代码 |
| systematic-debugging | 任何 bug 之前 | 没有根因分析就不能提修复方案 |
| verification-before-completion | 任何完成声明之前 | 没有验证证据就不能声称完成 |

### 日常用法

1. 直接描述需求 → brainstorming 自动触发
2. 确认设计（回复 "Yes, proceed"）→ 自动进入 writing-plans
3. 执行 → 自动 subagent-driven-development + TDD
4. 遇 bug → 直接说 "debug this"，systematic-debugging 自动接管
5. 完成 → 自动 code-review + finishing-branch

**加速技巧**：明确说 "use subagent-driven-development with Opus" 或 "parallel agents"

---

## 二、gstack 单独使用

### 核心机制：43 个 Slash Commands

gstack 将 Claude Code 变成虚拟工程团队，每个 `/xxx` 命令对应一个角色/职能。

### 按阶段分组

**决策层（新项目必用）**：
- `/office-hours` — YC 风格 6 个 forcing questions，框定需求和设计（Phase 4 硬性门控，自动停止等待决策）
- `/plan-ceo-review` — CEO 视角审计划（Expansion / Selective / Hold / Reduction）
- `/plan-eng-review` — 工程经理锁架构、数据流、边角 case、测试计划
- `/autoplan` — 一键自动跑 CEO → Design → Eng 审查流水线

**设计层**：
- `/design-consultation` — 从 0 建设计系统
- `/design-shotgun` — 生成多种设计方案（类 Vercel v0 体验）
- `/design-html` — 转生产 HTML
- `/design-review` — 代码 + 视觉审计 + 自动修复

**实现层**：
- `/review` — Staff Engineer 级 bug 审查
- `/investigate` — 系统性调试（自动 freeze 目录防乱改）
- `/careful` / `/freeze` / `/guard` — 安全模式（防 rm -rf、scope creep）
- `/unfreeze` — 解除冻结

**测试 & 上线层**：
- `/qa` — 真实浏览器 QA 测试 + 自动修复
- `/qa-only` — 只报 bug 不修
- `/cso` — 安全审计（OWASP + STRIDE）
- `/ship` — Release Engineer 打包 PR + 覆盖率检查
- `/land-and-deploy` — 合并 + 上线
- `/canary` — 金丝雀监控
- `/landing-report` — 合并后生成落地报告（v1.25+ 新增）
- `/document-release` — 生成 release notes
- `/retro` — 周报回顾（shipping streak、测试健康度）

**工具层**：
- `/browse` — headless Chromium 浏览器（点击、截图、console）
- `/scrape` — 网页抓取与结构化提取（v1.20+ 新增）
- `/connect-chrome` — 连接本地 Chrome DevTools
- `/setup-browser-cookies` — 配置浏览器 cookies
- `/pair-agent` — 双 agent 结对编程
- `/codex` — 召唤 OpenAI Codex 做第二意见（输出含 Recommendation 行）
- `/benchmark` — 性能基准测试
- `/health` — 项目健康检查
- `/make-pdf` — 生成 PDF
- `/learn` — 学习 gstack 用法
- `/gstack-upgrade` — 升级 gstack

**Skill 工程**：
- `/skillify` — 从代码或文档生成 gstack skill（v1.20+ 新增）
- `/setup-gbrain` — gbrain 联邦记忆初始化（v1.17+ 新增，跨机器同步）

### Garry Tan 日常流程

```
/office-hours → /plan-ceo-review → /plan-eng-review（或直接 /autoplan）
→ /design-shotgun → /design-html
→ 正常写代码
→ /review + /design-review
→ /qa → /ship → /land-and-deploy → /canary
→ /retro
```

---

## 三、Superpowers + gstack 组合使用

### 核心原则：gstack 管决策，Superpowers 管执行

| 阶段 | 用谁 | 原因 |
|:-----|:-----|:-----|
| 需求框定 | gstack `/office-hours` | 产品思维，6 个 forcing questions |
| 计划审查 | gstack `/plan-ceo-review` + `/plan-eng-review` | 角色视角更专业 |
| 设计探索 | gstack `/design-shotgun` | 多方案对比能力 |
| **详细设计** | **Superpowers brainstorming** | Socratic 提问 + 设计文档产出 |
| **任务分解** | **Superpowers writing-plans** | 精确到文件名和验证步骤 |
| **代码实现** | **Superpowers subagent-driven + TDD** | 强制测试、结构化执行 |
| **调试** | Superpowers systematic-debugging + gstack `/investigate` | 双保险 |
| 代码审查 | gstack `/review` + `/codex` | Staff Engineer + Codex 第二意见（含 Recommendation 行） |
| 视觉审查 | gstack `/design-review` | 自动修复 |
| QA 测试 | gstack `/qa` | 真实浏览器测试 |
| 上线 | gstack `/ship` → `/land-and-deploy` → `/canary` | 完整发布流水线 |
| 落地报告 | gstack `/landing-report` | 合并后生成落地报告 |
| 复盘 | gstack `/retro` | 数据驱动回顾 |

### 推荐组合工作流

**流程 A：新功能（完整版）**

```
1. gstack /office-hours          ← 框定需求（人类确认 ✓）
2. gstack /plan-ceo-review       ← CEO 审查（人类确认 ✓）
3. gstack /plan-eng-review       ← 工程审查（人类确认 ✓）
--- 建议在此开新 Session，保持执行上下文干净 ---
4. Superpowers brainstorming     ← 详细设计（自动触发）
5. Superpowers writing-plans     ← 任务分解（人类确认 ✓）
6. Superpowers subagent-driven  ← TDD 实现（自动触发）
7. gstack /review                ← 代码审查
8. gstack /qa                    ← 浏览器 QA
9. gstack /ship                  ← 打包 PR
10. gstack /retro                ← 复盘
```

> 流程中有 4 个人类确认点（✓），防止 AI 闭门造车导致需求偏航。

**流程 B：快速修复**

```
1. Superpowers systematic-debugging  ← 根因分析
2. gstack /investigate               ← 系统性调试（自动 freeze 防乱改）
3. Superpowers TDD                   ← 修复 + 测试
4. gstack /review                    ← 审查
```

**流程 C：设计探索**

```
1. gstack /design-shotgun     ← 多方案对比
2. gstack /design-html        ← 可视化原型
3. Superpowers brainstorming  ← 细化设计
4. Superpowers writing-plans  ← 分解实现
```

---

## 四、实战注意事项

### 上下文管理（Context 是最贵的资源）

前期的 brainstorm、CEO review、Eng review 会消耗大量 Token。如果全部在同一个 Session 里执行到代码阶段，AI 后期会因为上下文过长而变"笨"（注意力涣散）。

**建议**：在组合工作流的决策阶段（步骤 1-3）和执行阶段（步骤 4-6）之间**开一个新的 Claude 对话**，把生成的 Plan 文档喂给新 Session 执行。gstack 提供了 `/context-save` 和 `/context-restore` 来跨 Session 传递状态。

### 原子化提交（TDD 期间每通过一个测试就 commit）

TDD 的 GREEN 阶段可能包含多次小修改。配合 `using-git-worktrees` 的隔离环境，建议在每个测试用例通过后执行一次 `git commit`。这样即使 subagent 后续跑飞了，随时可以通过 `git reset` 精确回滚到上一个安全点。

### Human-in-the-Loop 关键确认点

完全自动化 ≠ 盲目自动化。以下节点建议人类必须审阅后回复 "Proceed"：

1. **`/plan-eng-review` 之后** — 架构和数据流锁定，写代码前的最后安全门
2. **`brainstorming` 设计文档产出后** — 确认设计方向符合预期再分解任务
3. **`writing-plans` 计划产出后** — 确认任务拆分粒度合理再开始实现
4. **`/office-hours` Phase 4** — 架构分支选择（A/B/C），v1.25 硬性门控自动停止

### 安全防护组合

| 场景 | Superpowers | gstack |
|:-----|:-----------|:-------|
| 防代码写崩 | `using-git-worktrees` 隔离环境 | `/freeze` 冻结目录范围 |
| 防破坏性操作 | — | `/careful` 警告 rm -rf / force-push |
| 全模式 | — | `/guard` = careful + freeze |
| 防调试乱改 | `systematic-debugging` 强制根因分析 | `/investigate` 自动冻结 |

### v1.25 主要更新（2026-05-01）

- **Office-hours Phase 4 硬性门控** — 架构分支选择不再自动跳过，必须等待用户确认
- **Recommendation 质量评分** — Haiku 4.5 评委对推荐理由打分（1-5），低于 4 分不通过
- **Codex 合成输出规范化** — `/codex` 的 review/challenge/consult 模式都输出 `Recommendation: <action> because <reason>` 行
- **跨平台加固** — Windows 支持 + Bun.which 解析器 + 路径可移植性
- **新增 4 个 skill** — `/landing-report`、`/scrape`、`/setup-gbrain`、`/skillify`
- **gbrain 联邦记忆** — 跨机器 gstack 记忆同步（v1.9+）/browser-skills 运行时 + HN 前端 skill
