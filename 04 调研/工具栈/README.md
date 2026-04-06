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

#### Skills

| 技能 | 功能 |
|------|------|
| **agent-reach** | 多平台互联网搜索与交互 |
| **notebooklm** | Google NotebookLM API 集成 |

#### Plugins

- **claude-plugins-official** — 官方插件集
  > code-review · code-simplifier · playground · skill-creator · superpowers

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

#### Commands

| 命令 | 功能 |
|------|------|
| `/english-md <url>` | 从 learnenai.com 获取新概念英语课程并按模板格式生成笔记 |
| `/sql-md <url>` | 从 LeetCode SQL 题目 URL 生成格式统一的 SQL 笔记 |

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