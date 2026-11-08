---
title: 开发运行时与 AI CLI
updated: 2026-11-09
tags: [runtime, nodejs, python, rust, java, ai-agent]
---

# 开发运行时与 AI CLI

这些程序属于开发工具链，不是终端模拟器本身。它们可以在 Alacritty、Ghostty 或其他终端中运行。

## 语言与运行时

| 工具 | 版本 / 状态 | 路径 / 说明 |
|---|---|---|
| Node.js | v24.14.0 | NVM 管理，~/.nvm/versions/node/v24.14.0 |
| npm | 11.21.1 | 随 Node 环境提供 |
| pnpm | 命令实际 12.10.1 | Corepack shim；全局包清单显示 12.16.1 |
| Bun | 1.4.4 | ~/.bun/bin/bun |
| Python | 3.12.3 | /usr/bin/python3 |
| Conda | 4.9.2 | ~/anaconda3，另有 Python 3.8.5 环境 |
| uv | 0.13.7 | ~/.local/bin/uv |
| Rust / Cargo | 1.99.1 | Rustup 管理，~/.cargo/bin |
| Java | OpenJDK 17.0.20.1 | JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 |
| Maven | 3.9.12 | /opt/maven |
| JMeter | 已配置 | JMETER_HOME=/opt/jmeter，版本未单独核验 |
| Go | 未安装 | 当前没有 go 命令 |

### Rustup 组件不等于 Rust 已装好

`rustup` 装完 toolchain 只带 cargo、rustc、rust-std 三件，**rustfmt 和 clippy 默认不在内**。后果不是编译失败，而是 `make check` 这类聚合门禁在第一步就报 `'cargo-fmt' is not installed for the toolchain stable-x86_64-unknown-linux-gnu`，看起来像源码格式有问题，实际是组件缺失。

2026-11-09 已执行 `rustup component add rustfmt clippy`（rustfmt 1.10.0-stable、clippy 0.1.99）。新机器复现这套环境时，这一步必须跟着 toolchain 一起做，否则任何依赖 `make check` / `make lint` 的项目都会卡住。核对命令：

~~~bash
rustup component list --installed
cargo fmt --version
cargo clippy --version
~~~

## pnpm 版本说明

当前 pnpm 命令报告 12.10.1，但 NPM 全局包目录中的 pnpm package.json 显示 12.16.1。

PATH 命中的是 Corepack shim，Corepack 可根据项目 packageManager 字段或自身缓存选择实际版本。因此，不能只看全局包清单推断命令实际运行版本。

若未来要统一版本，应先确认项目是否通过 packageManager 固定版本，再选择 Corepack 的版本管理方式；不要同时混用 Corepack 和 npm 全局安装。

## 编码 Agent 与 AI CLI

| 工具 | 版本 | 安装位置 / 线索 |
|---|---|---|
| Claude Code | 2.1.310 | ~/.local/bin/claude |
| OpenAI Codex CLI | 0.166.0 | NVM 全局 npm 包 |
| OpenCode | v2.2.5 | ~/.opencode/bin/opencode |
| OpenCLI | 2.0.2 | NVM 全局 npm 包 |
| RTK | 1.1.0 | ~/.local/bin/rtk |
| DeepSeek DSH | 0.2.1-rc.5 | NVM 全局 npm 包 |
| CodeBuddy Code | 2.180.0 | NVM 全局 npm 包 |
| XReach CLI | 0.3.3 | NVM 全局 npm 包 |
| MCPorter | 0.16.1 | NVM 全局 npm 包 |
| agent-reach | 版本未核验 | ~/.local/bin/agent-reach |

版本是 2026-11-07/08 的现场快照，不代表自动更新状态。使用前可通过 command -v 和对应 --version 重新核验。

### Claude Code 的 tmux 状态 Hook

2026-11-09 改名后核对 `~/.claude/settings.json`，以下五个事件都调用 `/home/duan/.cargo/bin/tmux-workspace-expose agent-status <状态>`。写绝对路径而不是裸名，是为了不受 hook 执行环境 PATH 差异影响——虽然 tmux server 的 PATH 首位就是 `~/.cargo/bin`，但 Claude Code 的 hook 未必在同一个 shell 环境里跑。修改时向同名事件数组追加条目，保留现有 hook。迁移前的备份为 `~/.claude/settings.json.bak-20261109-013558-migrate`。

**Hook 改动需要重启 Claude Code 会话才生效**——正在运行的会话仍持有旧命令路径。本次改名后，旧路径 `/home/duan/.cargo/bin/tmux-expose` 仍存在（改名前的残留二进制），所以旧会话不会报错，只是跑的是旧代码。

| 事件 | 状态 | 触发时机 |
|---|---|---|
| `UserPromptSubmit` | `working` | 提交新提示 |
| `Stop` | `waiting` | 正常结束一轮回复 |
| `StopFailure` | `attention` | API 错误导致本轮结束 |
| `PermissionRequest` | `attention` | 请求工具权限 |
| `SessionEnd` | `clear` | Claude Code 执行会话结束钩子 |

公开 README 的示例使用 `Notification` 的 `permission_prompt` 匹配和 `PostToolUse`，本机改用 `PermissionRequest` 和 `StopFailure`。本机配置下，批准权限后即使工具恢复运行，标记也可能保持 `attention`，直到后续事件覆盖或清除。 [Claude Code hooks 参考](https://code.claude.com/docs/en/hooks)

验收时在 tmux 中启动新的 Claude Code 会话，先用 `/hooks` 核对注册，再提交提示并读回 Pane 选项，检查正常回复后变为 `waiting`、退出后清空。当前已核对配置文件和独立 tmux 会话中的状态命令，真实 Claude Code 会话的自动触发待核实。 [Pane 选项读回命令](../03-%E7%BB%88%E7%AB%AF%E5%A4%8D%E7%94%A8/tmux%E9%85%8D%E7%BD%AE%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA.md#agent-状态标记)

#### 退出码能证明什么，不能证明什么

分两层，别混为一谈：

| 失败层次 | 43a570e 之前 | 当前部署（43a570e） |
|---|---|---|
| 命令找不到 / 不可执行 / 状态参数非法 | 返回非零 | 返回非零 |
| tmux 写入失败（pane 已消失等） | **静默返回 0**，只在 stderr 留痕 | 返回非零，并报出 tmux 的 stderr |

旧实现用 `let _ = Command::new("tmux")...status()` 丢弃结果，所以那时"退出码 0"从来不等于"状态写进去了"。43a570e 改为检查 `output.status.success()` 并已部署到本机（2026-11-09 实测：非法参数返回 1、无效 Pane 返回 1 并带 `no such pane`）。两者共同点是：**缺少 `$TMUX_PANE` 时直接返回成功**（不在 tmux 内无状态可写）。

另外，Claude Code 是否把 hook 的非零退出码显示出来取决于事件——`StopFailure` 等事件会忽略 hook 退出码。所以验收的可靠手段始终是读回目标 Pane 的选项，而不是看 hook 有没有报错。

## NPM 全局包

全局目录：
~/.nvm/versions/node/v24.14.0/lib/node_modules

当前盘点的主要包：
- @agentclientprotocol/claude-agent-acp 0.100.0
- @bitkyc08/opencodex 2.97.0
- @deepseek-ai/dsh 0.2.1-rc.5
- @jackwener/opencli 2.0.2
- @open-pencil/mcp 0.16.0
- @openai/codex 0.166.0
- @tencent-ai/codebuddy-code 2.180.0
- ccstatusline-zh 2.2.35
- corepack 0.34.7
- mcporter 0.16.1
- npm 11.21.1
- pnpm 包清单 12.16.1
- pyright 1.1.414
- typescript 7.0.2
- typescript-language-server 6.0.3
- vscode-langservers-extracted 4.10.0
- xreach-cli 0.3.3

## 用户级 CLI 目录

~/.local/bin 中还存在：
agent-reach、claude、fzf、harlequin、hsql、herdr、magpie、md-read-hd、notebooklm、paper-search、rtk、uv、uvx、yt-dlp 等。

并非每个工具都已确认版本和安装来源。路径存在不等于安装方式可追溯。

## 环境变量与启动关系

- NVM 使用懒加载，减少 Zsh 初始化成本。
- Java、Maven、JMeter 在 .zshrc 中设置环境变量和 PATH。
- Bun、OpenCode、Cargo 通过用户目录加入 PATH。
- Conda 通过 conda init 区块初始化。
- Claude 和 RTK 有各自的环境变量设置。

Shell 初始化逻辑详见 [Zsh与Starship](../02-%E7%BB%88%E7%AB%AF%E4%B8%8EShell/Zsh%E4%B8%8EStarship.md)；安装来源与版本冲突详见 [安装来源与维护决策](../07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md)。
