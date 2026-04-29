# Anki 同步面板
> **Obsidian（前端知识库）+ Anki（后端记忆引擎）**  
> 前置条件：Anki 已打开且安装了 [AnkiConnect](https://ankiweb.net/shared/info/2055492159)。

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

