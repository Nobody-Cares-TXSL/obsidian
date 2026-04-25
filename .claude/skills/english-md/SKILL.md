---
description: 获取新概念英语课程网页并按模板格式写入笔记
argument-hint: "<learnenai-course-url>"
allowed-tools: Bash, Skill, Read, Write, Glob, Grep, AskUserQuestion, mcp__web_reader__webReader
---

# 新概念英语笔记生成

根据用户提供的 learnenai.com 课程 URL，自动生成符合模板格式的英语学习笔记。

## 参数

- `$ARGUMENTS`：新概念英语课程页面 URL（如 `https://learnenai.com/nce-1/3`）

## 路径映射

从 URL 路径中的 `nce-{N}` 提取册数，映射为子目录名和标签：

| URL 路径 | 子目录 | 标签 |
|:---------|:-------|:-----|
| `nce-1` | `05 英语/新概念一/` | `NCE-1` |
| `nce-2` | `05 英语/新概念二/` | `NCE-2` |
| `nce-3` | `05 英语/新概念三/` | `NCE-3` |
| `nce-4` | `05 英语/新概念四/` | `NCE-4` |

**输出路径**：`05 英语/{子目录}/Lesson {N} - {Title}.md`

## 工作流程

### 1. 获取网页内容

两个数据源互补，**分别交给子代理并行获取**（在同一条消息中发起两个 Agent 调用）：

- **子代理 A — luzhenhua.cn**（课文正文 + Question + 权威标题）：
  1. 从 URL 路径提取课号（如 `/nce-1/3` → Lesson 3）
  2. 调用脚本获取数据：`bash .claude/skills/english-md/scripts/fetch-nce.sh <课号>`
  3. 脚本输出 `=== META ===`（TITLE、FILENAME）和 `=== CONTENT ===`（QUESTION、逐句 EN/CN）。**filename 是生成 URL 和文件名的权威来源，包含原始标点（如 `Nice to Meet You.` 末尾有 `.`）**

- **子代理 B — learnenai.com**（句型/语法讲解，仅作参考）：获取 `$ARGUMENTS`
  返回的是 learnenai.com 页面上的句型/语法讲解内容，作为编写**句型结构和语法要点**的参考素材，不作为原文和翻译的来源

### 2. 提取课程信息

- **课号**：从 URL 路径获取（如 `/nce-1/3` → Lesson 3）
- **Question**：从 luzhenhua.cn search_index.json 获取（见步骤 1）
- **Title**：使用 data.json 中的 `title` 字段，**保留原始标点**（如末尾的 `.`）
- **英文原文**：从 luzhenhua.cn 逐句提取，严禁自行改写
- **中文翻译**：从 luzhenhua.cn 逐句提取，**严禁自行翻译或改写**。luzhenhua.cn 的翻译是唯一权威来源，即使觉得原翻译不够通顺也不得修改
- **生词**：自行从原文中提取生词和释义，然后用 AskUserQuestion 询问用户是否需要补充未提及的生词
- **句型结构与语法要点**（可参考 learnenai.com 的语法讲解）：
  1. 从原文和 learnenai.com 语法讲解中提取所有候选句型和语法点
  2. 去重检查（不要逐篇读取全部笔记，用以下高效方式）：
     - 运行 vault-graph 技能（传入当前课程所在子目录路径，如 `05 英语/新概念一`）获取该册下已有 Lesson 文件的出链/入链关系
     - 用 Grep 在已有笔记中搜索当前候选知识点的关键词，确认是否已在前课详细讲过。**搜索规则**：
       - 使用**英文核心词或标准语法术语**搜索（如 `there be`、`present continuous`、`modal verb`），不要用中文表述
       - 每个候选知识点设计 2-3 个**宽泛匹配词**（如 `some.*any`、`mustn't|must not`、`for.*another`），避免因措辞差异漏匹配
       - 所有搜索必须使用 `grep -i`（忽略大小写）+ 正则表达式
       - README 索引表的"核心知识点"列也是快速参考：先用 grep 扫 README 确认大类是否已存在
  3. 按以下标准筛选：
     - **排除**已在之前课程中详细讲过的重复内容（首次出现时详细讲，后续课用 `[[Lesson X - Title]]` wikilink 引用或一句话带过）
     - **排除**纯词汇替换、不含结构规律的简单句
     - **排除**无任何语法/结构要点的日常用语
     - **排除**过于简单、无任何易错点的常识（如纯词汇层面的事实）
     - **保留**含新语法结构、固定搭配/惯用表达、涉及词形变化规则、容易混淆或用错的知识点
  4. 对保留的每个知识点，说明风格要求：
     - `>` 引用块：一句话点明定义/结构 + 适用场景（让用户秒懂用途）
     - 列表：只写核心用法要点，每条一行，不啰嗦
     - `**注意**`：只标注真正容易犯的错，不写显而易见的事实
     - 前课已讲过的相关内容，用 `[[Lesson X - Title]]` wikilink 引用

### 3. 按模板格式生成笔记

严格参照以下文件格式：
- 模板：读取 `00 模板/新概念英语模板.md`
- 已有示例：读取 `05 英语/{子目录}/` 下任意一个已有的 Lesson 文件（文件名格式为 `Lesson {N} - {Title}.md`）

**输出格式要点**：
- **不要输出模板中的"编写说明"callout**（`> [!note] 编写说明`），那是给 AI 的指引，不属于笔记内容
- 标题：`# Lesson {N}: {Question}`（Question 为 "Listen to the tape then answer this question." 的下一句）
- 链接：`> https://nce.luzhenhua.cn/lesson.html#NCE1/{filename}`，其中 filename 取自 data.json，**空格替换为 `%20`，末尾 `.` 替换为 `%2E`**（防止 markdown 解析器吞掉句号），其他字符保持原文
- 原文：每句英文独占一个段落，中间空行
- 中文翻译：放在 `<details><summary>中文翻译</summary>` 折叠块中，每句用 `  <br>` 换行
- frontmatter：包含 `lesson`（课号）、`title`（标题）、`tags`（使用对应册数标签如 `NCE-1`，用于 Dataview 跨仓库查询）、`vocabulary`（生词列表，格式 `- word 释义`），生词只放 frontmatter，正文中不再单独设置生词章节
- 句型结构：每个句型用 `###` 标题，加 `>` 一句话定义，列表写要点，`**注意**` 标注易错点
- 语法要点：每个语法点用 `###` 标题，加 `>` 一句话定义，列表写要点
- 各章节间用 `---` 分隔

### 4. 写入文件

将生成的笔记写入：`05 英语/{子目录}/Lesson {N} - {Title}.md`（子目录由路径映射决定，Title 取自 data.json 的 `title` 字段，**保留原始标点**）

使用 Write 工具写入文件。

### 5. 更新目录索引

笔记写入后，更新 `05 英语/{子目录}/README.md` 目录表，在最后一行后追加新条目：

```
| {课号} | [[Lesson {N} - {Title}]] | {核心知识点，用顿号分隔} |
```

核心知识点从本课"句型结构"和"语法要点"中提炼，每个知识点用简短名称概括（如"near 方位介词"、"There are + some + 复数名词"）。

## 输出原则

- **简洁**：句型结构和语法要点要言简意赅，一句话定义 + 核心要点列表，避免长段落
- **准确**：英文原文和中文翻译必须与网页内容一致
- **一致**：格式必须与已有 Lesson 文档保持一致
- **实用**：生词、句型、语法点提炼要抓住核心，去冗余
- **去重**：与前课重复的内容用 wikilink 引用，不重复展开
- **有用**：只保留有学习价值的知识点，排除过于简单或纯常识的内容
