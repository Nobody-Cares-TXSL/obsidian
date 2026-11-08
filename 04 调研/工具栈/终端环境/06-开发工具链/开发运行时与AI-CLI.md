---
title: 开发运行时与 AI CLI
updated: 2026-11-08
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
