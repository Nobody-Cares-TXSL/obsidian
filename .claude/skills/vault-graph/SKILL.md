---
name: vault-graph
description: 通过 Obsidian CLI 获取仓库的关系图谱（出链、入链、标签、属性），让 AI 快速了解仓库全貌。当用户想查看仓库结构、关系图谱、笔记关联时使用。触发词：关系图谱、graph、笔记关联、仓库结构。
allowed-tools: Bash(obsidian eval:*) Read
---

# Vault Graph - 仓库关系图谱

通过 `obsidian eval` 调用 Obsidian 内部 API 一次性获取整个仓库的关系图谱，包含出链、入链、标签和属性值。

## 何时使用

- 用户想了解仓库笔记之间的关联关系
- 用户想查看哪些笔记是孤立的
- AI 需要快速掌握仓库全局结构，避免逐篇读取全文
- 用户提到"关系图谱"、"graph"、"笔记关联"、"仓库结构"

## 运行方式

读取脚本内容后通过 `obsidian eval` 执行。

**扫描全仓库（默认）：**

```bash
SCRIPT=$(cat {baseDir}/scripts/vault-graph.js) && obsidian eval code="$SCRIPT"
```

**扫描指定目录：** 将 `BASE_PATH` 替换为目标路径（如 `05 英语/新概念一`）：

```bash
SCRIPT=$(sed 's|const BASE_PATH = null;|const BASE_PATH = "05 英语/新概念一";|' {baseDir}/scripts/vault-graph.js) && obsidian eval code="$SCRIPT"
```

脚本位于 `scripts/vault-graph.js`。

> 指定路径时，只输出该目录下的文件，但链接解析仍覆盖全仓库（会显示指向仓库其他位置的出链/入链）。

## 输出结构

```json
{
  "stats": {
    "total": 37,
    "withLinks": 12,
    "withBacklinks": 20,
    "orphans": 9
  },
  "graph": [
    {
      "path": "04 调研/十五五笔记/十五五-第一篇-总论.md",
      "tags": ["#十五五规划"],
      "properties": {
        "title": "十五五第一篇 - 总论",
        "tags": ["十五五规划", "宏观政策"],
        "date": "2026-04-11"
      },
      "links": [
        { "display": "科技自立自强", "target": "04 调研/十五五笔记/十五五-第三篇-科技自强.md" }
      ],
      "backlinks": [
        { "source": "04 调研/十五五笔记/README.md", "display": "十五五-第一篇-总论" }
      ]
    }
  ],
  "orphans": ["path/to/orphan.md"]
}
```

### 字段说明

| 字段 | 说明 |
|------|------|
| `stats.total` | 仓库中 markdown 文件总数 |
| `stats.withLinks` | 有出链的文件数 |
| `stats.withBacklinks` | 有入链的文件数 |
| `stats.orphans` | 孤立文件数（无入链也无出链，不含模板） |
| `graph[].tags` | 文件中使用的标签 |
| `graph[].properties` | frontmatter 属性键值对（已过滤 `position`） |
| `graph[].links` | 出链列表（`display` 为显示文本，`target` 为解析后的目标路径） |
| `graph[].backlinks` | 入链列表（`source` 为来源文件路径，`display` 为显示文本） |
| `orphans` | 不参与任何链接关系的文件路径列表 |

## 注意事项

- 需要 Obsidian 正在运行且 CLI 插件已启用
- 通过 `metadataCache` 读取，不需要逐个解析文件，速度很快
- 模板文件默认已过滤
- 重复链接已自动去重
