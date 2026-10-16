# 工具栈

## 编程工具栈

### 工具

- VS Code, IDEA, DataGrip

### 语言栈

| 类别 | 技术栈 |
|------|------|
| 语言 | Java |
| 框架 | Spring Boot |
| 工具 | Git · Maven · Jmeter |
| 数据库 | MySQL · Redis |

## AI 工具

### AI 搜索

| 工具 | 说明 |
|------|------|
| [秘塔AI](https://metaso.cn/) | 国内 AI 搜索 |
| [Perplexity](https://www.perplexity.ai/) | 国外 AI 搜索 |
| [Consensus](https://consensus.app/) | 学术/论文权威搜索 |

### Claude Code 技能与插件

#### Plugins

| 插件 | 技能 |
|------|------|
| **claude-plugins-official** | code-review · code-simplifier · playground · skill-creator · claude-md-management |
| **obsidian-skills** | obsidian-cli · obsidian-markdown · obsidian-bases · json-canvas · defuddle |
| **last30days-skill** | last30days（v3.24.0） |

#### Skills

**全局技能** (`~/.claude/skills/`)

| 技能 | 功能 |
|------|------|
| **[agent-reach](https://github.com/Panniantong/Agent-Reach)** | 多平台互联网搜索与交互（13 平台） |
| **[notebooklm](https://github.com/teng-lin/notebooklm-py)** | Google NotebookLM API 集成 |
| **[opencli](https://github.com/jackwener/opencli)** | 网站 CLI 框架（usage · browser · browser-sitemap · sitemap-author · adapter-author · autofix · smart-search） |
| **find-skills** | 查找和安装可复用 AI 技能 |

**项目技能** (`.claude/skills/`)

| 技能 | 功能 |
|------|------|
| **english-md** | 新概念英语笔记生成 |
| **learn-in-all** | 领域深度学习工作流（NotebookLM 建库 → 苏格拉底式问答 → Obsidian 笔记沉淀） |
| **vault-graph** | Obsidian 仓库关系图谱 |
| **obsidian-canvas-creator** | 文本转 Obsidian Canvas |
| **excalidraw-diagram** | Excalidraw 图表生成 |
| **mermaid-visualizer** | Mermaid 图表生成 |
| **skill-lookup** | 查找和安装可复用 AI 技能 |

## 终端

### Shell 与提示符

| 工具 | 说明 |
|------|------|
| **Oh My Zsh** | zsh 配置框架（zsh-autosuggestions · zsh-syntax-highlighting） |
| **starship** | 跨 shell 极简提示符主题 |
| **zoxide** | 智能 cd，按 frecency 跳转目录 |

### 终端环境

| 工具 | 说明 |
|------|------|
| **Alacritty + zsh + tmux** | 终端组合 |
| **fastfetch** | 系统信息展示 |
| **btop** | 资源监控 |

### 终端工具

| 工具 | 说明 |
|------|------|
| **claude code cli** | Claude Code 命令行工具 |
| **[RTK](https://github.com/rtk-ai/rtk)** | Token 优化代理，为 Claude Code / OpenCode 节省 60-90% token（单 Rust 二进制，100+ 命令支持） |
| **yazi + lazygit** | 文件管理器 + Git TUI · [[04 调研/资料/yazi快捷键速查表]] |
| **glow** | 终端 Markdown 阅读器 |
| **bat** | 带语法高亮的 cat 替代品 |
| [opencli](https://opencli.info/docs/zh/) | 命令行工具集合 |
| [github cli](https://cli.github.com/) | GitHub 官方命令行工具 |

## Obsidian 笔记

- obsidian
- obsidian cli

### Obsidian 的 Claude 插件、技能与命令

#### Plugins
> 插件来源 ： https://github.com/kepano/obsidian-skills


```bash
/plugin marketplace add kepano/obsidian-skills
/plugin install obsidian@obsidian-skills
```

- 插件技能

| 技能 | 描述 |
|---|---|
| [obsidian-markdown](https://github.com/kepano/obsidian-skills/blob/main/skills/obsidian-markdown) | 创建和编辑 [Obsidian 风格 Markdown](https://help.obsidian.md/obsidian-flavored-markdown) 文档（wikilinks、callouts、frontmatter 等） |
| [obsidian-bases](https://github.com/kepano/obsidian-skills/blob/main/skills/obsidian-bases) | 创建和编辑 [Obsidian 数据库](https://help.obsidian.md/bases/syntax)（`.base`），包括视图、筛选器、公式和摘要 |
| [json-canvas](https://github.com/kepano/obsidian-skills/blob/main/skills/json-canvas) | 创建和编辑 [JSON Canvas](https://jsoncanvas.org/) 文件（`.canvas`），包含节点、边、组和连接 |
| [obsidian-cli](https://github.com/kepano/obsidian-skills/blob/main/skills/obsidian-cli) | 通过 [Obsidian CLI](https://help.obsidian.md/cli) 与 Obsidian Vaults 交互，包括插件和主题开发 |
| [defuddle](https://github.com/kepano/obsidian-skills/blob/main/skills/defuddle) | 使用 [Defuddle](https://github.com/kepano/defuddle-cli) 从网页提取干净 Markdown，去除冗余节省 tokens |

#### Skills

| 技能 | 功能 |
|------|------|
| **obsidian-canvas-creator** | 将文本内容转换为 Obsidian Canvas（思维导图、自由布局） |
| **excalidraw-diagram** | 生成 Excalidraw 格式图表 |
| **mermaid-visualizer** | 将文本转换为 Mermaid 图表 |
| **skill-lookup** | 查找和安装可复用的 AI 技能 |

### Obsidian 主题

- **Blue Topaz** — 蓝宝石主题

### Obsidian 插件

| 插件 | 功能 |
|------|------|
| **claudian** | Claude AI 集成，将 vault 作为工作目录，支持文件读写、搜索和终端命令 |
| **obsidian-excalidraw-plugin** | 手绘风格图表编辑与查看 |
| **obsidian-export-image** | 将笔记导出为图片 |
| **obsidian-style-settings** | 主题、插件和 CSS 片段的样式变量自定义 |
| **dataview** | 数据查询和索引，支持类 SQL 语法查询笔记元数据 |
| **cm-editor-syntax-highlight-obsidian** | 编辑器中代码块语法高亮 |
| **terminal** | 在 Obsidian 中集成终端/Shell |

## 信息获取

### 工具对比

| 工具 | 定位 | 数据源 | 适用场景 |
|------|------|--------|----------|
| **last30days** | 舆论研究引擎 | 15 个源（Reddit·X·YouTube·TikTok·小红书·Polymarket·GitHub·Perplexity·Web） | 话题全景研究、趋势追踪、每日简报 |
| **opencli** | 网站 CLI 框架 | 167 站点 · 1332 命令 · 10 apps · 13 外部 CLI（微博·知乎·B站·ChatGPT·Cursor·Notion·HN·arXiv·Discord·DingTalk·Lark） | 精确平台操作、自动化任务、数据抓取 |
| **agent-reach** | 多平台信息代理 | 13 平台（Jina·GitHub·yt-dlp·语义搜索） | 中文平台深度访问、Agent 集成 |

### 配置状态

#### [last30days](https://github.com/mvanhorn/last30days-skill)

| 通道 | 状态 | 说明 |
|------|------|------|
| Web · Reddit · X · YouTube · TikTok | ✓ 激活 | 默认 5 个源 |
| Instagram · GitHub · HN · Polymarket · Bluesky · Threads · Pinterest · 小红书 · Perplexity | ⚠️ 待配置 | 需要 [ScrapeCreators](https://scrapecreators.com/) API（10,000 免费调用） |

**核心功能**：`--deep` 深度模式、`--store` SQLite 存储、Watchlist 自动追踪、Briefing 简报

#### [opencli](https://github.com/jackwener/opencli) v1.8.7

| 类别 | 状态 | 平台示例 |
|------|------|----------|
| 中文社交 | ✓ 内建 | 微博·知乎·B站·小红书·豆瓣·即刻·虎扑·V2EX·雪球 |
| 国际平台 | ✓ 内建 | Twitter/X·Reddit·Instagram·TikTok |
| AI 工具 | ✓ 内建 | ChatGPT·Cursor·Gemini·NotebookLM |
| 生产力 | ✓ 内建 | Notion·飞书(Lark CLI)·企业微信·钉钉(DWS) |
| 电商 | ✓ 内建 | 1688·淘宝·京东·拼多多 |
| 公开 API | ✓ 内建 | HN·arXiv·Wikipedia·IMDb·Spotify·StackOverflow |

**核心技能**：`usage`（使用指南）· `browser`（浏览器自动化）· `browser-sitemap`（站点地图浏览器）· `sitemap-author`（站点地图编写）· `adapter-author`（编写适配器）· `autofix`（自动修复适配器）· `smart-search`（智能搜索路由）

#### [agent-reach](https://github.com/Panniantong/Agent-Reach)

| Tier | 平台 | 状态 | 依赖 |
|------|------|------|------|
| 0 零配置 | GitHub · V2EX · RSS · 任意网页 (Jina Reader) | ✓ 可用 | 无 |
| 0 零配置 | YouTube (yt-dlp) · 全网语义搜索 (Exa) | ⚠️ 待配置 | Node/deno JS runtime · Exa API |
| 1 已安装 | B站 (yt-dlp) | ✓ 可用 | yt-dlp |
| 2 可选 | Twitter/X · Reddit · 小红书 · 小宇宙 · 雪球 · LinkedIn | ⚠️ 待安装 | 对应平台 CLI/API |

**当前状态**：5/13 渠道可用

**核心功能**：`agent-reach doctor` 诊断、`agent-reach read <url>` 读取任意网页、`agent-reach search-twitter` 搜索推文、mcporter MCP 路由

### 使用建议

#### 调用方向

| 工具 | 调用方式 | 输入 | 输出 |
|------|----------|------|------|
| **last30days** | Claude 技能 / 命令行 | 自然语言查询 | 跨源聚合报告 |
| **opencli** | CLI 命令 | `<平台> <操作> <参数>` | 结构化数据 |
| **agent-reach** | CLI / MCP Server | 平台 + 目标 | 原始内容/工具调用 |

#### 命令格式

- **last30days**: `/last30days [--deep] [--deep-research] [--store] <query>`
- **opencli**: `opencli <platform> <command> [args]`
- **agent-reach**: `agent-reach <platform> <action> [options]`

#### 决策流程

```
了解话题全貌 → last30days（多源聚合）
     ↓
需要精确操作 → opencli（平台命令）
     ↓
深度中文访问 → agent-reach（配置依赖）
```
