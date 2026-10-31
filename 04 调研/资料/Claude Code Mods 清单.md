---
title: "Claude Code Mods 清单"
created: 2026-10-17
updated: 2026-10-17
description: 本机安装的 Claude Code mod 清单：功能、钩子、权限、配置、statusline 改造与终端限制
tags:
  - "claude-code"
  - "mods"
  - "工具栈"
---

本机（Linux + Alacritty）当前启用的 Claude Code mod 清单。mod 是**函数钩子**形式的插件——在 Claude Code 进程内注册事件处理器，能绘制界面、拦截工具调用、观察会话状态，与 settings.json 里的传统 hook（外部命令）是两套机制。

> 判据：`hooks/hooks.json` 里有 `modules` 键指向 TS/JS 钩子模块的才是 mod。仅声明 settings hooks 的插件（如 `warp`）不算。

---

## 📦 已装 mod 一览

| mod | 版本 | marketplace | 能力 | 界面位置 |
| --- | --- | --- | --- | --- |
| **mdview** | 1.0.1 | `xuanji86/claude-mdview` | markdown 侧栏阅读 + 指着改 | `Pane` + 重绘对话 |
| **files** | 0.2.0 | `ntkode/notkode-mods` | 项目文件浏览器 | `Pane` |
| **blast-radius** | 0.2.3 | `hamzafer/claude-code-mods` | 危险命令预览 | `AbovePrompt` + `Pane` |
| **agent-radar** | 0.1.3 | `hamzafer/claude-code-mods` | 子代理实时状态 | `AbovePrompt` + `Pane` |
| **mission-control** | 0.1.3 | `hamzafer/claude-code-mods` | 主/子代理关系图 + 代码地图 | `AbovePrompt` + `Pane` |
| **next-steps** | 0.2.2 | `hamzafer/claude-code-mods` | 下一步 prompt 建议 | `AbovePrompt` |

> **已卸载**：`context-bar`（上下文窗口分类条）。原因：占空间太多，且只用于显示上下文窗口，而 statusline 第 1 行已有 `ctx:37%` 同类信息。

---

## 🔍 逐个说明

### mdview — markdown 阅读与就地编辑

对话里出现 `.md` 路径时自动变成可点链接（后缀 `↗`），单击在侧栏打开，用引擎原生渲染器画。

- **独有能力**：分节 + 目录（`t`）+ 查找（`f`）+ 长文分页（`p`/`n`）；**`✎` 指哪改哪**——悬停某个块，写指令回车，作为你的消息发给 Claude，改完 pane 当场刷新
- **钩子**：`ui.render{AssistantMessage}`、`{ToolUse}`、`{UserMessage}`、`{Pane, requestId=mdview}`
- **注意**：它**重写对话渲染**。含 `.md` 路径的回复由它接管（开头带 `⏺`），与同类 mod 会互相短路
- **配置**：`clickOpens=pane`、`clickOpensInWarp=warp`

### files — 项目文件浏览器

`/files [目录或文件]` 打开 pane，逐层浏览项目。

| 按键 | 作用 |
| --- | --- |
| `t` | 切到 touched 视图——本会话 Claude 读过/改过哪些文件（`✎` 标改过的） |
| `u` / `h` | 上一层目录 / 显示隐藏与被 git 忽略的文件 |
| `b` | 从文件退回目录 |
| `a` | 把当前文件加进 prompt（`@路径`） |
| `r` | md 文件：渲染 ⇄ 源码 |
| `e` / `o` | 用 `$EDITOR` 编辑 / 用系统默认程序打开 |
| `i` | 图片：切换 pixels/blocks 模式 |

- **钩子**：`session.start`、`command.run{files}`、`tool.call`、`ui.render{Pane, requestId=files}`
- **零冲突**：只画自己的 pane，不碰对话渲染
- **Linux 友好**：外部打开走 `xdg-open`（已验证可用）

### blast-radius — 危险命令预览

拦截 `rm -rf`、`git reset --hard`、force push 这类命令，**先展示会造成什么后果**，再由你决定是否执行。

- **独有能力**：需要 `tool.call` 钩子**拦截**并返回 `deny`——这是纯展示型脚本（如 statusline）结构上做不到的
- **钩子**：`tool.call{tool=Bash}`、`ui.render{Pane, requestId=blast-radius}`、`ui.render{AbovePrompt}`
- **配置**：`timeoutSeconds`（自动取消等待的秒数，未设置）

### agent-radar — 子代理监控

提示条上方每个运行中的 subagent 一行：状态图标、描述、耗时、工具调用数、当前在做什么；完成后显示 `✓` 保留 30 秒，并有 toast 通知。

- **独有能力**：`/radar` 打开 pane 列出全部代理，点进去能看**该代理的消息流**（`$.session.messages({ agentId })`）
- **钩子**：`session.start`、`agent.spawn`、`tool.call`、`turn.complete`、`command.run{radar}`、`ui.render{AbovePrompt}`、`ui.render{Pane, requestId=agent-radar}`

### mission-control — 代理关系图

`/mission` 打开实时地图：主代理、子代理、每次工具调用，以及它们碰过的文件的代码地图。

- **独有能力**：不只是列表，是**关系图 + 代码地图**
- **钩子**：`session.start`、`turn.start`、`agent.spawn`、`tool.call`、`turn.complete`、`command.run{mission}`、`ui.render{Pane, requestId=mission-control}`、`ui.render{AbovePrompt}`
- **权限提示**：调 `$.fs.write`（写代码地图）、`$.process.run`（生成地图）、`$.model.complete`（解释代码）——**会写文件、跑进程、调用模型**

### next-steps — 下一步建议

每轮结束后，提示条上方给出 2-3 个可能的后续 prompt。在空输入框按 `1`/`2`/`3` 填入，按 `0` 关闭。

- **钩子**：`prompt.submit`、`turn.start`、`turn.complete`、`prompt.edit`、`ui.render{AbovePrompt}`
- **权限提示**：调 `$.model.complete`（生成建议）、`$.agent.list`、`$.session.messages`——**会产生模型调用，消耗额度**
- **配置**：`language`（输出语言，未设置）

---

## ⚙️ 本机配置

### 插件配置

| 插件 | 选项 | 值 | 说明 |
| --- | --- | --- | --- |
| `mdview@claude-mdview` | `clickOpens` | `pane` | 非 Warp 环境单击开 pane |
| `mdview@claude-mdview` | `clickOpensInWarp` | `warp` | Warp 环境用自带查看器 |
| `blast-radius@claude-code-mods` | `timeoutSeconds` | `120` | 危险命令等待 120 秒后自动取消（默认 60，0 为永不取消） |
| `next-steps@claude-code-mods` | `language` | `Chinese` | 后续 prompt 建议用中文写 |

> 配置方式：`echo '{"键":"值"}' | claude plugin configure <插件> --values-stdin`，或会话内 `/plugin configure <插件>`。
> 注意：`--values-stdin` 只接受**字符串值**的 JSON 对象；schema 声明为 `number` 的项会自动转换（如 `"120"` → `120`）。

### marketplace 注册

| marketplace | 来源仓库 |
| --- | --- |
| `claude-mdview` | `xuanji86/claude-mdview` |
| `notkode-mods` | `ntkode/notkode-mods` |
| `claude-code-mods` | `hamzafer/claude-code-mods` |

> **命名冲突提醒**：marketplace 的注册键是 `marketplace.json` 里的 `name` 字段，与 GitHub 仓库路径无关。`ronanworks/claude-code-mods` 与 `hamzafer/claude-code-mods` 声明名相同，本地只能存在一个——切换时必须先 `claude plugin marketplace remove`。

---

## ⚠️ 本机终端限制

本机终端是 **Alacritty**（`TERM=alacritty`），影响如下：

| 项 | 状态 | 影响 |
| --- | --- | --- |
| kitty 图形协议 | ❌ 不支持 | 图片画不出来 |
| `sips` 命令 | ❌ 不存在（macOS 专有） | 图片转换/缩放的降级路径也断了 |
| `xdg-open` | ✅ 可用 | 交系统程序打开这条路通 |

**结论**：mdview 和 files 的**文本、代码、markdown 渲染全部正常**；**图片类功能不可用**（两者都靠 `hasPixels` 探测终端能力，只认 kitty/ghostty；降级路径又依赖 `sips`）。替代方案是按 `o` 用系统程序打开。

---

## 🔄 statusLine 改造

`~/.claude/statusline.zsh` 已**恢复并改造**：三行结构保留，但第 2、3 行的内容换成了斜杠命令速查。

### 三行结构

| 行 | 内容 | 来源 |
| --- | --- | --- |
| 1 | 模型名 \| ctx 百分比 + 进度条 \| 目录（在 git 仓库里还会显示 branch） | 引擎的 stdin JSON |
| 2 | **mod 的斜杠命令**（硬编码） | `/files`、`/md`、`/mission`、`/radar` |
| 3 | **master-plugin 的斜杠命令**（硬编码） | `/explain`、`/deep-read`、`/write-docx`、`/distill-session`、`/auto_answer` |

### 相比改造前

| 项 | 改造前 | 改造后 |
| --- | --- | --- |
| 第 2 行 | 最近活动流：`tail -n 20` 读 transcript + 逐条 `jq` 解析，每 3 秒一次 | 纯字符串常量，零 I/O |
| 第 3 行 | 代理状态：扫 `/tmp/claude-$UID/*/*/tasks` 整棵目录树 + 解析 stop_reason | 纯字符串常量，零 I/O |

> **性能**：两行的 I/O 全部去掉。原来每次刷新都要 fork 子进程跑 `jq`/`grep`/`stat`，现在只有第 1 行还在读 stdin JSON。

### 与 mod 的分工

第 3 行原显示的代理状态，现由 **agent-radar** 接管（画在提示条上方，每个子代理一行，还带 pane）。

**数据边界**（重要）：statusline 与 mod **不是竞争关系，是两条通道**。

| 数据 | statusline | mod |
| --- | --- | --- |
| 上下文用量、分类明细 | ✅ | ✅ 同源（官方类型注释写明 "the status line's figures"） |
| 套餐限额 `rateLimits` | ❌ 无此字段 | ✅ **仅 mod 有** |
| `prompt_cache`（命中率、TTL、`expires_at`、重算成本） | ✅ **仅 statusline 有** | ❌ 拿不到 |
| `session_name`、`fast_mode`、`thinking` | ✅ | ❌ |
| 行数增删、总时长 | ✅ | ❌ |

> 这也解释了为何保留 statusline：`prompt_cache` 那组数据（缓存是否还热、命中率、变冷后的重算成本）**mod API 拿不到**——它只在切模型和恢复会话两个时刻暴露缓存状态。

### 维护提醒

第 2、3 行是**硬编码**。装/卸 mod 或改动插件技能后，要手动同步这两行：

```zsh
# statusline.zsh 第 188 行附近
local line2="/files [目录|文件]:项目文件浏览器 · /md <路径>:md 阅读器 · ..."
local line3="/explain:解释选中代码 · /deep-read:智能阅读 · ..."
```

**备份**：`~/.claude/statusline.zsh.disabled`（改造前原版）、`~/.claude/statusline.zsh.bak-*`（本次改造前）

---

## 📌 冲突与共存

mod 的同名钩子形成**中间件链**：先注册的在外层，`next(e)` 传给下一个，最内层是引擎自身行为。**不调 `next` 就短路**——这决定同类 mod 能否共存。

| 钩子 | 谁在用 | 冲突风险 |
| --- | --- | --- |
| `AssistantMessage` | mdview | ⚠️ 高——同类重写会互相短路 |
| `ToolUse` | mdview | ⚠️ 中——调用 `next` 的能嵌套叠加 |
| `AbovePrompt` | blast-radius、agent-radar、mission-control、next-steps | ✅ 低——各画各的一行，可共存 |
| `Pane`（各自 requestId） | 全部 | ✅ 无——ID 不同，互不干扰 |

> **设计判据**：优先选只画 `AbovePrompt` 或自有 `Pane` 的 mod。这两类是"自己的地盘"，不参与引擎渲染的争夺。重写 `AssistantMessage`/`ToolUse` 的 mod 之间天然互斥，只能二选一。

---

## 🔗 相关

- 调研来源：[`mods.aidojo.si`](https://mods.aidojo.si) — 自动扫描 GitHub 上全部 Claude Code mod 的目录站，含每个 mod 的权限标注（L0 只画 / L1 读 / L2 写与跑进程 / L3 联网）
- 数据源仓库：`karanb192/awesome-claude-code-mods`
- 官方文档：[Mods overview](https://code.claude.com/docs/en/plugins/mods/overview)
- 同类笔记：[[yazi快捷键速查表]]
