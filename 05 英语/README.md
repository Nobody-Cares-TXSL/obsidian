# Obsidian 英语全流程文档

> **Obsidian（知识库）→ AnkiConnect（API 桥梁）→ Anki（间隔复习）**

英语学习工作流的核心痛点：**笔记中积累了大量生词，但缺乏有效的复习手段**。
单纯记录不等于掌握，没有间隔重复的记忆会快速遗忘。
这套系统将 Obsidian 作为知识管理前端，在阅读课文或文章时自然地提取和积累生词；同时打通 Anki 作为记忆引擎后端，利用科学的间隔重复算法实现高效复习。
**Obsidian 只负责记录，不负责生词复习记忆**——让笔记归笔记，让生词复习归Anki 算法。

## 目录结构

- 05 英语/
  - README.md
  - Anki 同步.md
  - 语法.md
  - 新概念一/
  - 新概念二/（待建）
  - 新概念三/（待建）
  - 新概念四/（待建）

## 日常工作流

### 1. 生成笔记

使用`Claude Code CLI` 的自定义 `/english-md <url>` skill 技能从 learnenai.com 抓取课程并生成笔记 。  
笔记会参考[[新概念英语模板]]并自动写入对应新概念子目录。

### 2. 同步到 Anki

打开 [[Anki 同步]] 面板，点击需要同步的对应新概念按钮，单词自动导入 Anki 对应牌组，并去重。

### 3. 三端同步

- 电脑端 Anki 点**同步** → AnkiWeb 云端
- 手机 AnkiDroid 点**同步** → 从云端拉取到本地
- 笔记通过 Git 同步至 Gitee 远程仓库备份，并配置[.gitattributes](../.gitattributes)，统一Windows/Linux 跨平台换行符。

## 数据格式

### frontmatter格式

```yaml
lesson: {{Lesson Number}}
title: {{Title}}
tags:
  - NCE-{{N}}
vocabulary:
  - { word: {{word1}}, trans: {{释义1}} }
  - { word: {{word2}}, trans: {{释义2}} }
```

- `vocabulary 生词`用对象格式，支持 Dataview 查询和 AnkiConnect 同步
- 多词短语用双引号包裹

### tags体系

| 标签 | 映射 |
|:-----|:-----|
| `NCE-1` | 新概念第一册 |
| `NCE-2` | 新概念第二册 |
| `NCE-3` | 新概念第三册 |
| `NCE-4` | 新概念第四册 |

## Anki 配置

从零开始配置 **Obsidian（前端知识库）+ Anki（后端记忆引擎）** 一键同步系统的全流程。

这是一套极其优雅且高度可控的学习工作流，配置完成后，你只需专注于在 Obsidian 中记录，复习工作全部交给 Anki 的间隔重复算法。

---

### 第一阶段：Obsidian 数据准备（规范格式）

为了让数据结构化，方便未来提取和扩展，我们需要在 Obsidian 笔记的 Frontmatter（YAML 区）中采用标准的**对象数组（Key-Value）**格式。

**1. 笔记的基础格式要求：**
在你平常的课文笔记中（例如新概念英语），像这样记录生词：

```yaml
---
lesson: 71
title: He's Awful
tags:
  - NCE-1
vocabulary:
  - { word: awful, trans: 糟糕的，极坏的 }
  - { word: telephone, trans: 打电话（动词） }
  - { word: the day before yesterday, trans: 前天 }
  - { word: typing letters, trans: 打信件 }
---
```
*(注：如果你的单词或翻译中包含冒号、逗号等 YAML 敏感字符，建议用双引号将内容包裹，如 `{ word: "look for", trans: "寻找" }`)*

**2. 开启 DataviewJS：**
你需要安装并启用 Obsidian 的 **Dataview** 插件，并在插件设置中，将 **Enable JavaScript Queries（启用 JavaScript 查询）** 的开关打开。

---

### 第二阶段：Anki 环境配置与打通后台

这一步是为了让 Anki 能够在本地开启一个 API 服务，接收来自 Obsidian 的数据。

**1. 安装 Anki 电脑端**
下载并安装 [Anki 桌面版](https://apps.ankiweb.net/)。

**2. 安装 AnkiConnect 插件**
1. 打开 Anki，点击顶部菜单栏的 `工具 (Tools)` -> `插件 (Plugins)`。
2. 点击 `获取插件...`，输入代码 **`2055492159`**，点击确定安装。
3. **完全关闭并重启 Anki**。

**3. 配置跨域白名单 (CORS)**
由于 Obsidian 是基于 Electron 的应用，其发出的请求带有 `app://obsidian.md` 的源头标记，默认会被 AnkiConnect 拦截，必须配置放行：
1. 重启Anki后，再次进入 `工具` -> `插件`，选中 `AnkiConnect`，点击右侧的 **`插件设置 (Plugin Config)`**。
2. 找到 `"webCorsOriginList"` 这一行， 第一行 `http://localhost` 的末尾必须加一个**英文逗号 **，再增加`"app://obsidian.md"`：
   ```json
   "webCorsOriginList":[
       "http://localhost",
	   "app://obsidian.md"
   ]
   ```
3. 保存后，**必须再次重启 Anki** 让配置生效。
*(测试连接：可以在终端的`Obsidian 仓库路径下`运行 `curl localhost:8765 -X POST -d '{"action": "version", "version": 6}'`，若返回版本号说明服务已完美运行。)*

---

### 第三阶段：Anki 接收端准备（牌组与模板）

代码向 Anki 发送数据时，必须有对应的“接收容器”。

1. **新建牌组**：在 Anki 主界面点击“创建牌组”，命名为 **`新概念一`**。
2. **确认卡片模板**：
   * 确保你有一个卡片类型叫做 **`Basic`**（需根据你的卡片类型修改后续代码中的`MODEL_NAME 配置项`）。
   * 确保该模板有两个字段：正面叫 **`Front`**，背面叫 **`Back`**。

---

### 第四阶段：部署 Obsidian 同步控制面板

在 Obsidian 中新建一篇专门用于管理的笔记（例如命名为 `Anki 同步.md`），将这套脚本粘贴进去：

````markdown
# Anki 同步面板

> 前置条件：Anki 已打开且安装了 [AnkiConnect](https://ankiweb.net/shared/info/2055492159)，牌组名为 `新概念一`。

```dataviewjs
// === 配置区 ===
const DECK_NAME = "新概念一";
const MODEL_NAME = "Basic";
const FIELD_FRONT = "Front";
const FIELD_BACK = "Back";
// ============

const btn = dv.el("button", "🚀 同步新概念一结构化单词到 Anki");
btn.style.padding = "10px 20px";
btn.style.backgroundColor = "#4CAF50";
btn.style.color = "white";
btn.style.border = "none";
btn.style.borderRadius = "8px";
btn.style.fontWeight = "bold";
btn.style.cursor = "pointer";
btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

btn.onclick = async () => {
    btn.innerText = "⏳ 正在同步中 (0/" + "...)";
    btn.style.backgroundColor = "#FF9800";

    let pages = dv.pages("#NCE-1");
    let notesToAdd = [];

    for (let page of pages) {
        if (page.vocabulary) {
            let tag = page.lesson ? `Lesson-${page.lesson}` : "NCE";

            for (let item of page.vocabulary) {
                if (item && item.word && item.trans) {
                    notesToAdd.push({
                        deckName: DECK_NAME,
                        modelName: MODEL_NAME,
                        fields: {
                            [FIELD_FRONT]: String(item.word).trim(),
                            [FIELD_BACK]: String(item.trans).trim()
                        },
                        tags: [tag]
                    });
                }
            }
        }
    }

    if (notesToAdd.length === 0) {
        btn.innerText = "⚠️ 没有找到格式正确的单词";
        btn.style.backgroundColor = "#9E9E9E";
        return;
    }

    let addedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (let i = 0; i < notesToAdd.length; i++) {
        if (i % 50 === 0) {
            btn.innerText = `⏳ 正在同步中 (${i}/${notesToAdd.length})...`;
        }

        try {
            let resp = await fetch("http://127.0.0.1:8765", {
                method: "POST",
                body: JSON.stringify({
                    action: "addNote",
                    version: 6,
                    params: { note: notesToAdd[i] }
                })
            });

            let result = await resp.json();

            if (result.error) {
                if (String(result.error).includes("duplicate")) {
                    duplicateCount++;
                } else {
                    errorCount++;
                    console.error("添加失败:", notesToAdd[i].fields[FIELD_FRONT], result.error);
                }
            } else if (result.result) {
                addedCount++;
            }
        } catch (e) {
            errorCount++;
            console.error("请求失败:", notesToAdd[i].fields[FIELD_FRONT], e);
        }
    }

    if (errorCount > 0) {
        btn.innerText = `⚠️ 新增 ${addedCount} 词，跳过 ${duplicateCount} 词，失败 ${errorCount} 词`;
        btn.style.backgroundColor = "#FF9800";
    } else {
        btn.innerText = `✅ 同步成功！新增 ${addedCount} 词，跳过 ${duplicateCount} 词`;
        btn.style.backgroundColor = "#2196F3";
    }
};
```
````

---

### 第五阶段：闭环

1. **一键发送**：同步单词时，确保**电脑端 Anki 处于打开状态**。进入 Obsidian 同步面板点击同步按钮，新单词将自动进入 Anki。
    
2. **云端同步**：在电脑端 Anki 点击“同步”将数据推送到 AnkiWeb。
    
3. **移动端复习**：手机打开 AnkiDroid，点击同步后即可利用碎片时间开启间隔重复复习。

**如何扩展到其他课本：**  
未来学习《新概念二》时，只需复制一份上述代码块，并将配置区中的 DECK_NAME = "新概念二"，以及查询语句 dv.pages("#NCE-2") 即可。