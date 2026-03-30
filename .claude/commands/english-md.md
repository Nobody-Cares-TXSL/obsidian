---
description: 获取新概念英语课程网页并按模板格式写入笔记
argument-hint: "<learnenai-course-url>"
allowed-tools: Bash, Skill, Read, Write, Glob, Grep, AskUserQuestion, mcp__web_reader__webReader
---

# 新概念英语笔记生成

根据用户提供的 learnenai.com 课程 URL，自动生成符合模板格式的英语学习笔记。

## 参数

- `$ARGUMENTS`：新概念英语课程页面 URL（如 `https://learnenai.com/nce-1/3`）

## 工作流程

### 1. 获取网页内容

开启代理并获取网页内容：

```bash
source ~/.zshrc && proxy-on
```

优先使用 agent-reach 方式获取：`curl -s "https://r.jina.ai/$ARGUMENTS"`
若 agent-reach 失败，退回 webReader MCP 工具（`return_format: markdown`，`retain_images: false`）。

### 2. 提取课程信息

从网页内容中提取以下信息：
- **课号和标题**：从 URL 路径（如 `/nce-1/3` → Lesson 3）和页面标题获取
- **英文原文**：逐句提取英文文本
- **中文翻译**：逐句提取中文翻译
- **生词**：自行从原文中提取生词和释义，然后用 AskUserQuestion 询问用户是否需要补充未提及的生词
- **句型结构**：提取关键句型及其用法说明
- **语法要点**：提取语法知识点

### 3. 按模板格式生成笔记

严格参照以下文件格式：
- 模板：读取 `00 模板/新概念英语模板.md`
- 已有示例：读取 `05 英语/Lesson 1 - Excuse me!.md`

**输出格式要点**：
- 标题：`# Lesson {N}: {Title}`
- 链接：`> {URL}`
- 原文：每句英文独占一个段落，中间空行
- 中文翻译：放在 `<details><summary>中文翻译</summary>` 折叠块中，每句用 `  <br>` 换行
- 生词：用无序列表，格式 `- word 释义`
- 句型结构：每个句型用 `###` 标题，加 `>` 一句话定义，列表写要点，`**注意**` 标注易错点
- 语法要点：每个语法点用 `###` 标题，加 `>` 一句话定义，列表写要点
- 各章节间用 `---` 分隔

### 4. 写入文件

将生成的笔记写入：`05 英语/Lesson {N} - {Title}.md`

使用 Write 工具写入文件。

## 输出原则

- **简洁**：句型结构和语法要点要言简意赅，避免长段落
- **准确**：英文原文和中文翻译必须与网页内容一致
- **一致**：格式必须与已有 Lesson 文档保持一致
- **实用**：生词、句型、语法点提炼要抓住核心，去冗余
