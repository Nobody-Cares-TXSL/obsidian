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
| **claude-plugins-official** | code-review · code-simplifier · playground · skill-creator · superpowers · claude-md-management |
| **obsidian-skills** | obsidian-cli · obsidian-markdown · obsidian-bases · json-canvas · defuddle |
| **last30days-skill** | last30days |

#### Skills

**全局技能** (`~/.claude/skills/`)

| 技能 | 功能 |
|------|------|
| **agent-reach** | 多平台互联网搜索与交互（15 通道） |
| **notebooklm** | Google NotebookLM API 集成 |
| **smart-search** | 智能搜索路由（基于 opencli） |
| **opencli** | 网站 CLI 框架（usage · browser · adapter-author · autofix · smart-search） |
| **docx** | Word 文档创建与编辑 |
| **find-skills** | 查找和安装可复用 AI 技能 |
| **deep-analysis** | NotebookLM 输出全景深度分析 |
| **first-principles** | 第一性原理分析 |

**项目技能** (`.claude/skills/`)

| 技能 | 功能 |
|------|------|
| **english-md** | 新概念英语笔记生成 |
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
| **yazi + lazygit** | 文件管理器 + Git TUI |
| **glow** | 终端 Markdown 阅读器 |
| **bat** | 带语法高亮的 cat 替代品 |
| [opencli](https://opencli.info/docs/zh/) | 命令行工具集合 |
| [github cli](https://cli.github.com/) | GitHub 官方命令行工具 |

## 笔记

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
| **claudian** | Claude AI 集成 |
| **obsidian-excalidraw-plugin** | 手绘风格图表 |
| **obsidian-export-image** | 导出笔记为图片 |
| **obsidian-style-settings** | 样式自定义设置 |
| **dataview** | 数据查询和索引 |
| **cm-editor-syntax-highlight-obsidian** | 代码语法高亮 |

## 信息获取

### 工具对比

| 工具 | 定位 | 数据源 | 适用场景 |
|------|------|--------|----------|
| **last30days** | 舆论研究引擎 | 15 个源（Reddit·X·YouTube·TikTok·小红书·Polymarket·GitHub·Perplexity·Web） | 话题全景研究、趋势追踪、每日简报 |
| **opencli** | 网站 CLI 框架 | 103 站点 · 628 命令（微博·知乎·B站·ChatGPT·Cursor·Notion·HN·arXiv） | 精确平台操作、自动化任务、数据抓取 |
| **agent-reach** | 多平台信息代理 | 15 通道（Jina·GitHub·xreach·mcporter·Camoufox·yt-dlp） | 中文平台深度访问、Agent 集成 |

### 配置状态

#### [last30days](https://github.com/mvanhorn/last30days-skill)

| 通道 | 状态 | 说明 |
|------|------|------|
| Web · Reddit · X · YouTube · TikTok | ✓ 激活 | 默认 5 个源 |
| Instagram · GitHub · HN · Polymarket · Bluesky · Threads · Pinterest · 小红书 · Perplexity | ⚠️ 待配置 | 需要 [ScrapeCreators](https://scrapecreators.com/) API（10,000 免费调用） |

**核心功能**：`--deep` 深度模式、`--store` SQLite 存储、Watchlist 自动追踪、Briefing 简报

#### [opencli](https://github.com/jackwener/opencli) v1.7.8

| 类别 | 状态 | 平台示例 |
|------|------|----------|
| 中文社交 | ✓ 内建 | 微博·知乎·B站·小红书·豆瓣·即刻·虎扑·V2EX·雪球 |
| 国际平台 | ✓ 内建 | Twitter/X·Reddit·Instagram·TikTok |
| AI 工具 | ✓ 内建 | ChatGPT·Cursor·Gemini·NotebookLM |
| 生产力 | ✓ 内建 | Notion·飞书·企业微信·钉钉 |
| 电商 | ✓ 内建 | 1688·淘宝·京东·拼多多 |
| 公开 API | ✓ 内建 | HN·arXiv·Wikipedia·IMDb·Spotify·StackOverflow |

**核心技能**：`usage`（使用指南）· `browser`（浏览器自动化）· `adapter-author`（编写适配器）· `autofix`（自动修复适配器）· `smart-search`（智能搜索路由）

#### [agent-reach](https://github.com/Panniantong/Agent-Reach)

| Tier | 平台 | 状态 | 依赖 |
|------|------|------|------|
| 0 零配置 | GitHub · RSS · 任意网页 (Jina Reader) | ✓ 可用 | 无 |
| 1 已配置 | YouTube (yt-dlp) · Twitter/X (xreach) · Reddit (代理) · Exa 语义搜索 · B站 · 微博 · 微信公众号 | ✓ 可用 | mcporter + xreach |
| 2 待配置 | 小红书 · 抖音 · 小宇宙 · LinkedIn · Boss直聘 | ⚠️ 待配置 | Docker · Groq API · MCP Server |

**当前状态**：10/15 通道可用

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
