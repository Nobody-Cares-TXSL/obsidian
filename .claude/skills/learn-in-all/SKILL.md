---
name: learn-in-all
description: 自动化领域深度学习工作流。NotebookLM 建库 → 苏格拉底式问答 → Obsidian 笔记沉淀。当用户想系统学习一个新领域时使用。
argument-hint: "[源文件/文件夹路径或URL]"
allowed-tools: Bash, Skill, Read, Write, Glob, Grep, AskUserQuestion
---

# 领域深度学习工作流

通过 NotebookLM 构建知识库、苏格拉底式问答引导学习、生成 Obsidian 结构化笔记的 4 阶段工作流。

## 参数

- `$ARGUMENTS`：源文件/文件夹路径或 URL（可选，支持 PDF、URL、YouTube、音频、视频）

## 依赖 Skill

| Skill | 用途 | 参考 |
|-------|------|------|
| `notebooklm` | NotebookLM CLI 全部操作（建库、添加源、问答、生成） | @~/.claude/skills/notebooklm/SKILL.md |
| `agent-reach` | 中文平台深度访问、技术资料、视频内容抓取 | @~/.agents/skills/agent-reach/SKILL.md |
| `smart-search` | 智能搜索路由器，精确平台数据、专业讨论、学术搜索 | @~/.agents/skills/smart-search/SKILL.md |
| `last30days` | 舆论趋势、公众讨论、热点事件调研 | @~/.claude/plugins/marketplaces/last30days-skill/skills/last30days/SKILL.md |
| `vault-graph` | 查找 vault 中已有相关笔记，建立 wikilink 关联 | @.claude/skills/vault-graph/SKILL.md |

## 入口分流

### 无参数 — 复用已有 Notebook

1. 运行 `notebooklm list --json` 获取所有已有 notebook 列表
2. 从每个 notebook 的 `title` 和 `created_at` 提取信息
3. 通过 `AskUserQuestion` 让用户选择一个 notebook，选项格式：`标题（创建日期）`
4. 用户选择后，设置 `notebook_id`
5. 运行 `notebooklm source list --notebook {notebook_id}` 获取该 notebook 的所有源材料
6. 通过 `AskUserQuestion` 让用户选择要学习的材料（multiSelect），列出每个源的标题和类型
7. 如用户选择了部分源，后续 `notebooklm ask` 时使用 `-s` 参数指定选中的 source_id
8. **跳到阶段 3**（苏格拉底式问答）

### 有参数 — 新建 Notebook

参数是源文件/文件夹路径或 URL。进入阶段 1。

## 阶段 1：源文件准备

1. 判断参数类型：
   - **文件路径**（以 `/` 或 `./` 开头，不含 `://`）：
     - 如果是目录：用 Glob 列出目录下所有支持的文件（PDF、txt、md、docx、mp3、mp4、png、jpg 等）
     - 如果是单个文件：直接使用
   - **URL**（包含 `://`）：直接使用
   - **多个参数**（空格分隔）：逐个处理

2. 向用户展示找到的所有源文件列表，通过 `AskUserQuestion` 确认是否就绪

3. 如用户暂无源文件，提供选项：
   - **等待用户准备**
   - **使用 NotebookLM 内置网络调研**（首选，结果直接添加为 notebook 源）：
     ```bash
     notebooklm source add-research "{domain} 核心概念 入门教程" --notebook {notebook_id} --mode deep --import-all
     ```
     快速模式用 `--mode fast`（秒级，5-10 源），深度模式用 `--mode deep`（2-5 分钟，20+ 源）
   - **使用外部调研工具**（当需要 NotebookLM 不覆盖的平台时）：
     - `last30days`：舆论趋势、公众讨论
     - `agent-reach`：中文平台深度访问
     - `smart-search`：精确平台数据、专业讨论、学术搜索

4. 从源文件名或 URL 推断领域名称（用于 Notebook 标题和 Obsidian 笔记命名）：
   - 单个文件 → 使用文件名（去掉扩展名）
   - 文件夹 → 使用文件夹名
   - URL → 从页面标题或路径推断
   - 推断后通过 `AskUserQuestion` 让用户确认或修改

## 阶段 2：自动化知识库构建

### 2a. 创建 Notebook

```bash
notebooklm create "领域学习: {domain}" --json
```

从 JSON 输出中提取 `id` 作为 `notebook_id`。

### 2b. 设置语言

```bash
notebooklm language set zh_Hans
```

> 注意：全局设置，会影响所有 Notebook。

### 2c. 添加源文件

逐个添加，使用 `--notebook {notebook_id}` 指定目标：

```bash
notebooklm source add <file_or_url> --json --notebook {notebook_id}
```

从 JSON 输出中提取 `source_id`，记录到列表。

### 2d. 等待处理完成

使用 Task(general-purpose) 子代理并行等待所有源处理完成：

```bash
notebooklm source wait {source_id} -n {notebook_id} --timeout 600
```

**错误处理**：
- 单个源失败 → 跳过并记录
- 全部失败 → 终止并提示
- 至少 1 个源成功即可继续

### 2e. 确认就绪

```bash
notebooklm source list --json --notebook {notebook_id}
```

向用户报告成功/失败统计。

## 阶段 3：苏格拉底式问答循环

> 提示模板见 `references/socratic-prompts.md`

### 3a. 知识全景提取

向 NotebookLM 发送全景提取提示：

```bash
notebooklm ask "基于所有源材料，请提取以下内容并结构化输出：1. 核心概念（5-8个，每个一句话定义，用[[双链]]标注）2. 主要争议（2-3个，列出正反方）3. 演进时间线（关键里程碑）4. 入门学习路径（子主题列表，标注难度和依赖）。用中文回答。" -s {source_id_1} -s {source_id_2} --notebook {notebook_id}
```

> 如用户选择了部分源材料，使用 `-s` 参数指定选中的 source_id；如全选则不加 `-s`。

将 NotebookLM 的返回结果**原样展示**给用户，不做二次加工或格式化。

### 3b. 渐进式问答（不限轮数）

按知识地图中的学习路径子主题顺序推进。每个子主题执行循环：

#### 出题

根据子主题位置选择难度：
- 前 1-2 个 → **概念理解型**（入门）
- 中间 → **原理解释型 / 对比分析型**（中级）
- 最后 1-2 个 → **批判思考型**（高级）

使用 `references/socratic-prompts.md` 中对应的出题提示，让 NotebookLM 生成问题。

#### 提问

通过 `AskUserQuestion` 向用户展示问题，提供选项：
- 用户自由回答（选择"Other"输入）
- "跳过此主题"
- "结束学习"

#### 评估

使用 `references/socratic-prompts.md` 中的"回答评估"提示，发送用户回答给 NotebookLM 评估。

#### 判断

展示评估结果后：
- **覆盖核心要点** → 进入下一子主题
- **有明显遗漏** → 同一子主题换角度追问
- 用户主动选择"已理解" → 进入下一子主题

### 3c. 差距分析

所有子主题完成后，使用 `references/socratic-prompts.md` 中的"差距分析"提示生成分析报告，展示给用户。

## 阶段 4：Obsidian 笔记沉淀

### 4a. 生成结构化笔记

使用 `references/socratic-prompts.md` 中的"结构化笔记生成"提示，让 NotebookLM 生成 Obsidian 格式 Markdown。

### 4b. 查找关联笔记

调用 `vault-graph` skill 查找 vault 中已有的相关笔记，添加 `[[wikilink]]` 关联。

### 4c. 写入 Obsidian

存储路径：`06 阅记/{domain}/领域学习-{domain}.md`

按 `00 模板/领域学习模板.md` 格式组织内容，使用 Write 工具写入。

### 4d. 完成报告

向用户展示：
- Notebook ID（便于后续继续对话）
- 笔记文件路径
- 学习统计（问答轮数、覆盖子主题数）
- 知识差距摘要
