---
description: 从 LeetCode SQL 题目 URL 生成格式统一的 SQL 笔记
argument-hint: "<leetcode-sql-url>"
allowed-tools: Bash, Skill, Read, Write, Glob, Grep, AskUserQuestion, mcp__web_reader__webReader
---

# LeetCode SQL 题目笔记生成

根据用户提供的 LeetCode SQL 题目 URL，自动生成符合模板格式的 SQL 笔记。

## 参数

- `$ARGUMENTS`：LeetCode SQL 题目 URL（如 `https://leetcode.cn/problems/invalid-tweets/description/`）

## 工作流程

### 1. 获取网页内容

开启代理并获取网页内容：

```bash
source ~/.zshrc && proxy-on
```

优先使用 agent-reach 方式获取：`curl -s "https://r.jina.ai/$ARGUMENTS"`
若 agent-reach 失败，退回 webReader MCP 工具（`return_format: markdown`，`retain_images: false`）。

### 2. 提取题目信息

从网页内容中提取：
- **题目名称和 URL**：从页面标题和链接获取，提取精简 URL 格式 `https://leetcode.cn/problems/{slug}/`
- **表结构**：提取所有表名、列名、类型，转为 markdown 表格
- **题目描述**：提取完整的题目要求

### 3. 生成 SQL 题解

分析题目要求，编写 SQL 解答：
- 用 `>` 引用块简述解题思路
- SQL 代码块内用 `--` 注释逐行解释关键逻辑
- 如有多种解法，保留实际方法名（如：子查询、JOIN、窗口函数），不使用"方法一"、"方法二"

### 4. 按模板格式生成笔记

严格参照以下文件格式：
- 模板：读取 `00 模板/LeetCode SQL题模板.md`
- 已有示例：读取 `02 算法与设计/SQL50/` 下的已有笔记

**输出格式要点**：
- 标题：`# [题目名称](精简URL)`
- 题目：表结构用 markdown 表格呈现，后接题目描述
- 题解：`>` 引用块写思路，代码块指定语言标识 `sql`，内含 `--` 注释
- 关键要点：可选章节，用 `## 关键要点` 深化 SQL 知识点

### 5. 写入文件

将生成的笔记写入：`02 算法与设计/SQL50/{题目名称}.md`

使用 Write 工具写入文件。

## 输出原则

- **准确**：表结构和题目描述必须与原题一致
- **简洁**：思路说明言简意赅，注释点到关键逻辑
- **一致**：格式必须与已有 SQL50 笔记保持一致
- **实用**：关键要点提炼核心 SQL 技巧，去冗余
