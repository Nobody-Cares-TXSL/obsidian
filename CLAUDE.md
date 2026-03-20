# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 仓库概述

这是一个用于存储学习笔记的 Obsidian 仓库，主要包含面试准备（八股文）、LeetCode 题解、设计模式和 SQL 练习。

---

## 笔记格式规范

模板文件位于 `00 模板/` 目录，使用 `@` 引用：

- @00 模板/LeetCode算法题模板.md
- @00 模板/LeetCode SQL题模板.md
- @00 模板/设计模式模板.md

**核心要点：**
- 代码块必须指定语言标识（`java`、`sql`、`text`）
- 保留实际方法名（如：暴力枚举、哈希表），不使用"方法一"、"方法二"
- 使用 `>` 引用块添加思路说明
- 章节根据实际需要可选添加

---

## Obsidian 插件配置

### 已安装插件
- **claudian** - Claude AI 集成
- **obsidian-excalidraw-plugin** - 手绘风格图表
- **dataview** - 数据查询和索引
- **cm-editor-syntax-highlight-obsidian** - 代码语法高亮

### 快捷键
- `Ctrl+Alt+B` - 打开 Claudian 视图

---

## Git 忽略规则

@./gitignore

---

## 自定义技能

仓库包含以下 Obsidian 相关的自定义技能（位于 `.claude/skills/`）：

- **obsidian-canvas-creator** - 将文本内容转换为 Obsidian Canvas（思维导图、自由布局）
- **obsidian-markdown** - 创建和编辑 Obsidian Flavored Markdown（wikilinks、callouts、frontmatter）
- **excalidraw-diagram** - 生成 Excalidraw 格式图表
- **json-canvas** - 编辑 JSON Canvas 文件
- **mermaid-visualizer** - 将文本转换为 Mermaid 图表
- **obsidian-bases** - 创建和编辑 Obsidian Bases 数据库

---

## 代码语言偏好

- LeetCode 解题：优先使用 **Java**
- SQL：使用标准 SQL 注释（`--`）

---

## 自动记忆

Claude 会将稳定的模式、架构决策和用户偏好保存到自动记忆目录，实现跨对话持久化：

- 路径：`/home/duan/.claude/projects/-home-duan-Project-obsidian/memory/`
- 内容自动加载到每个对话的上下文
- 记录项目规范、用户偏好、解决方案模式等
