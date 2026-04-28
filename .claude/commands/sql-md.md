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
- **示例数据**：提取示例输入中的表数据和示例输出

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
- SQL 流程：`## SQL 流程`，用示例数据逐步演示 SQL 每一步的中间结果，放在题解下方、关键要点上方，用 `---` 分隔。每步用 `### 步骤名（一句话概括）`，`>` 引用块标注要点或易错点，简单查询可省略
  - **必须按 SQL 逻辑执行顺序拆解**：FROM → JOIN+ON → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。永远不要从 SELECT 开始，顺着数据库的底层流水线执行顺序展开
  - 每一步展示该阶段处理后的中间结果表（用 markdown 表格），让读者看到数据形态的变化
  - SELECT 是最后一步，所有计算逻辑（聚合函数、条件表达式、别名、ROUND 等）都在这一步完成并展示
  - 如果有多个解法，每个解法各自按执行顺序独立展示完整流程
- 关键要点：可选章节，用 `## 关键要点` 深化 SQL 知识点，适合函数对比、JOIN 差异、NULL 陷阱等，纯简单查询可省略

### 5. 写入文件

将生成的笔记写入：`02 算法与设计/SQL50/{题目名称}.md`

使用 Write 工具写入文件。

### 6. 更新 README

将 `[[{题目名称}]]` 追加到 `02 算法与设计/README.md` 的 SQL50 列表末尾。如果文件中已有该条目则跳过。

### 7. 更新经验总结

读取 `02 算法与设计/SQL50/EXPER.md`，判断当前题解是否包含该文件中**尚未覆盖**的有价值 SQL 经验。

**判断标准**：
- 新的 SQL 函数或语法（如 DATEDIFF、COALESCE 等）
- 新的解题模式（如 LEFT JOIN + IS NULL、自连接、子查询等）
- 新的易错点或陷阱（如 NULL 比较的特殊行为）
- 与已有经验互补的新视角（如更深入的同主题对比）

**更新格式**：
- 按已有格式添加新章节：`## 经验主题` + `>` 核心结论 + 可选代码块/表格
- 章节末尾用 `> 来源：[[{题目名称}]]` 标注来源
- 用 `---` 与前后章节分隔
- 如果题解没有新经验则跳过此步骤

**插入位置**（按类别归入对应区块，同类内按难度从低到高）：
1. **基础概念**：易错陷阱、基础语法（NULL 判断、DISTINCT 等）
2. **标量函数**：单个值处理函数（ROUND、IF/CASE WHEN、字符串函数、日期函数等）
3. **聚合函数对比**：COUNT/AVG/SUM 等聚合函数的差异与选择
4. **高级技巧**：综合运用模式（条件聚合、自连接、子查询等）
5. **JOIN 类型**：多表关联相关（JOIN 差异、LEFT JOIN + IS NULL 等）

新经验应插入对应类别的末尾，而非文件末尾。若属于新类别，则按上述顺序追加到合适位置。

## 输出原则

- **准确**：表结构和题目描述必须与原题一致
- **简洁**：思路说明言简意赅，注释点到关键逻辑
- **一致**：格式必须与已有 SQL50 笔记保持一致
- **实用**：关键要点提炼核心 SQL 技巧，去冗余
