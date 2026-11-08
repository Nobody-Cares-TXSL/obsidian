---
title: "tmux 终端多路复用器快捷键速查表 (Cheatsheet)"
source: "https://github.com/tmux/tmux/wiki/Getting-Started"
created: 2026-11-02
updated: 2026-11-08
description: "基于本机 tmux 3.4 与 ~/.tmux.conf 整理，涵盖 Pane、Window、Session、工作区插件、异常恢复和 Yazi 缩放刷新。"
tags:
  - clippings
  - tmux
  - terminal
  - cheatsheet
---

**tmux** 是终端多路复用器：一个 **Session（会话）** 包含多个 **Window（窗口）**，一个 Window 又可拆分成多个 **Pane（窗格）**。Detach 只断开显示，里面的程序继续运行。

> [!important] 本机按键规则
> - **前缀键（Prefix）是 `Ctrl+B`**：先按 `Ctrl+B`，**松开**，再按后面的键（例如 `z`），不是同时按三个键。
> - 已确认版本 **tmux 3.4**；配置文件 **`~/.tmux.conf`**。
> - 本机 **Window 和 Pane 都从 1 编号**；已启用 `mouse on`。
> - 下文以 **`Prefix`** 简写 `Ctrl+B`，并区分 **原生默认** 与 **本机自定义**。
> - tmux 配置、工作区插件和 Yazi 缩放刷新机制见 [tmux配置与工作区](./tmux%E9%85%8D%E7%BD%AE%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA.md)。

## 核心速查表

| 🧩 Pane（窗格） | 🗂️ Window（窗口） | 🔌 Session（会话） | 🛠️ 其他 |
| --- | --- | --- | --- |
| **`Prefix → z`**：放大/还原当前 Pane | **`Prefix → c`**：新建 Window | **`Prefix → d`**：正常分离（Detach） | **`Prefix → ?`**：查看按键帮助 |
| **`Prefix → \|`**：左右分屏（本机） | **`Prefix → n/p`**：下/上一个 Window | **`tmux ls`**：列出 Session | **`Prefix → :`**：输入 tmux 命令 |
| **`Prefix → _`**：上下分屏（本机） | **`Prefix → 1…9`**：按编号切换 | **`tmux attach`**：重新连接 | **`Prefix → [`**：复制/滚动模式 |
| **`Prefix → 方向键`**：切换 Pane | **`Prefix → w`**：窗口选择列表 | **`Prefix → s`**：会话选择列表 | **`Prefix → ]`**：粘贴 tmux 缓冲区 |
| **`Prefix → q`**：显示 Pane 编号 | **`Prefix → ,`**：重命名 Window | **`tmux new -s 名称`**：新建命名会话 | **`Prefix → Ctrl+Z` 后 `fg`**：挂起 / 恢复（Yazi 图片同步隐藏 / 显示） |
| **`Prefix → x`**：关闭 Pane（确认） | **`Prefix → &`**：关闭 Window（确认） | **`Prefix → $`**：重命名 Session | **`Prefix → Space`**：切换布局 |
| **`Prefix → F3`**：快速三屏（本机） | **`Prefix → 0`**：如存在可选 0 号窗口 | **`tmux attach -t 名称`**：连接指定会话 | **`Prefix → o`**：循环切换 Pane |
| **`Prefix → F4`**：快速四屏（本机） | **`Prefix → !`**：Pane 独立成 Window | **`tmux switch-client -t 名称`**：切换会话 | **`Prefix → {` / `}`**：交换 Pane |

> [!tip] 最常用的 4 个
> **分屏：`Prefix → |` / `_`**；**切换：`Prefix → 方向键`**；**最大化：`Prefix → z`**；**退出显示但保留任务：`Prefix → d`**。

---

## 详细操作

### 1. Pane：创建、切换、放大

| 操作 | 按键 / 命令 | 说明 |
| --- | --- | --- |
| 左右分屏 | `Prefix → \|` | 本机自定义；等价于 `split-window -h`；输入 `\|` 通常需要 `Shift+\` |
| 上下分屏 | `Prefix → _` | 本机自定义；等价于 `split-window -v`；输入 `_` 通常需要 `Shift+-` |
| 默认左右分屏 | `Prefix → %` | tmux 原生默认 |
| 默认上下分屏 | `Prefix → "` | tmux 原生默认 |
| 快速三屏 | `Prefix → F3` | 本机自定义：新增两个 Pane 并切为 main-vertical 布局 |
| 快速四屏 | `Prefix → F4` | 本机自定义：新增三个 Pane 并切为 tiled 布局 |
| 切换 Pane | `Prefix → ↑/↓/←/→` | 按方向切换焦点 |
| 循环切换 | `Prefix → o` | 跳到下一个 Pane |
| 显示 Pane 编号 | `Prefix → q` | 短暂显示数字，可按提示数字选择 |
| 放大 / 还原 | `Prefix → z` | **仅改变显示布局，不停止其他 Pane 的程序** |
| 关闭 Pane | `Prefix → x` | 需要确认；也可在 Pane 的 shell 里 `exit` |
| 交换 Pane | `Prefix → {` / `}` | 与前/后 Pane 交换位置 |
| 调整大小 | `Prefix → Ctrl+方向键` | 每次调整少量 |
| 较大幅度调整 | `Prefix → Alt+方向键` | 每次调整 5 格；取决于终端 Alt 按键传递 |
| 轮换布局 | `Prefix → Space` | 在预定义布局之间切换 |

> [!warning] F3 / F4 不是“重置为三/四屏”
> 本机这两组绑定会**继续新增** Pane。建议从**只有一个 Pane 的 Window** 中使用：`F3` 新增 2 个、`F4` 新增 3 个；如果窗口已经分屏，继续按会增加更多 Pane，并可能造成布局不符合预期。

### 2. Window：一个 Session 中的不同工作台

| 按键 | 功能 |
| --- | --- |
| `Prefix → c` | 新建 Window |
| `Prefix → 1…9` | 切到对应编号（本机默认从 1 起） |
| `Prefix → n` / `p` | 下一个 / 上一个 Window |
| `Prefix → w` | 从可选择列表中挑 Window |
| `Prefix → ,` | 重命名当前 Window |
| `Prefix → &` | 关闭当前 Window（确认） |
| `Prefix → !` | 将当前 Pane 拆到一个新的 Window |

### 3. Session：创建、分离、重连

```bash
tmux                         # 新建一个 Session（无显式名称）
tmux new -s dev              # 创建名为 dev 的 Session
tmux ls                      # 查看已有 Session
tmux attach                  # 连接一个已有 Session
tmux attach -t dev           # 连接 dev
tmux new -A -s dev           # 有 dev 就连接；没有则创建
tmux switch-client -t dev    # 已在 tmux 内时切换到 dev
tmux kill-session -t dev     # 终止整个 dev 会话（里面的任务也会结束！）
```

- `Prefix → Ctrl+Z`：先隐藏当前 Window 中的 ueberzugpp 图片叠加层，再执行 tmux 原生 `suspend-client`；Shell 中 `fg` 恢复同一个客户端并重新显示当前预览。
- `Prefix → d`：**Detach**，离开界面但 Session、Window、Pane 和运行中的程序都保留；ueberzugpp 通过自己的 `client-detached` Hook 隐藏图片，之后用 `tmux attach` 重连。
- `Prefix → s`：在 tmux 内浏览 / 切换 Session。
- `Prefix → $`：重命名当前 Session。
- **不要在 tmux 内反复输入 `tmux`** 来恢复旧界面；优先使用 `Prefix → s` 或在 tmux 外用 `tmux attach`。

### 4. 复制、搜索与滚动（本机默认 Emacs 模式）

本机 `mode-keys` 实测为 **emacs**，**不是 Vim 复制模式**。

| 操作 | 按键 |
| --- | --- |
| 进入复制/历史模式 | `Prefix → [` |
| 在历史中移动 | 方向键、`PageUp` / `PageDown` |
| 开始选择 | 复制模式中按 `Ctrl+Space` |
| 复制选中内容并退出 | 复制模式中按 `Alt+w` |
| 向上搜索 | 复制模式中按 `Ctrl+r` |
| 向下搜索 | 复制模式中按 `Ctrl+s` |
| 退出复制模式 | `q` 或 `Esc` |
| 粘贴 tmux 缓冲区 | `Prefix → ]` |

> [!note] 如果想使用 Vim 风格复制按键
> 可在 `~/.tmux.conf` 添加 `setw -g mode-keys vi`，重新加载配置后才使用 Vi 的 `Space` 开始选择、`Enter` 复制；**当前尚未如此配置**。

### 5. 鼠标与滚轮（本机自定义）

- 已开启 `set -g mouse on`：鼠标可以点选 Pane、拖动边界调整大小。
- 在普通 shell 中向上滚轮，进入 tmux 的历史 Copy Mode。
- 在 `less` / `batcat` 等全屏阅读器中，本机有滚轮映射，模拟方向键滚动。
- 在主动接收鼠标事件的 `vim`、`yazi` 等程序中，事件优先交给程序自身。
- 复制文字到系统剪贴板是否可用还取决于终端、tmux 和剪贴板配置，不能把 `Prefix → ]` 等同于系统 `Ctrl+V`。

> [!note] 在 vim 里复制到系统剪贴板
> 当前 `/usr/bin/vim` 已切换到 vim-gtk3（带 `+clipboard`），`~/.vimrc` 设置了 `clipboard=unnamedplus`，在 tmux 内普通 yank 即写入 X11 CLIPBOARD，实测可用。详见 [TUI与CLI工具](../05-%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7/TUI%E4%B8%8ECLI%E5%B7%A5%E5%85%B7.md) 的 Vim 小节。

---

## 异常恢复：tmux 被“退出”了怎么办？

| 现象 | 恢复方式 | 原因 |
| --- | --- | --- |
| `[1] + suspended tmux`，同一 shell 的 `jobs` 还能看到 | **`fg`** 或 `fg %1` | `Prefix → Ctrl+Z` 会隐藏 ueberzugpp 图片叠加层后挂起客户端；`fg` 恢复同一个客户端并重新显示当前预览。裸按 `Ctrl+Z` 仍会透传给 Pane 内程序 |
| 刚按了 `Prefix → d`，回到普通 shell | **`tmux attach`** | 正常分离 |
| 有多个 Session，不知道连哪个 | **`tmux ls`** 后 `tmux attach -t 名称` | 按会话名重连 |
| 屏幕只剩一个 Pane | **`Prefix → z`** | 可能是误放大了一个 Pane |
| 当前 Pane 的 shell 退出，Pane 消失 | 不能仅靠重新 attach 恢复已结束进程 | 程序已退出，不是简单分离 |

> [!danger] `exit` / `kill-pane` / `kill-session` 与 Detach 不同
> `exit` 可能导致当前 Pane 关闭；`kill-session` 会终止会话内全部任务。**想保留 Claude Code 等程序，按 `Prefix → d`。**

---

## tmux + Claude Code：三个 Pane 分别运行 Claude

建议从单 Pane 窗口开始，按 **`Prefix → F3`**，再在每个 Pane 中分别启动 `claude`：

```text
Session: dev
└── Window 1
    ├── Pane 1 → claude（需求 / 讨论）
    ├── Pane 2 → claude（实现）
    └── Pane 3 → claude（测试 / 审查）
```

日常操作：`Prefix → 方向键` 切换、`Prefix → z` 专注某一个 Claude、`Prefix → d` 暂时离开、`tmux attach` 恢复。

### 在终端查看其他 Pane

```bash
# 列出所有 Pane：Session:Window.Pane、稳定 Pane ID、正在运行的命令
tmux list-panes -a -F '#{session_name}:#{window_index}.#{pane_index} #{pane_id} #{pane_current_command}'

# 从指定 Pane 的滚动历史中取最近 100 行（示例 %1）
tmux capture-pane -p -t %1 -S -100

# 给指定 Pane 输入一行文本（只有确定目标后再使用）
tmux send-keys -t %1 -l '请报告当前进度'
tmux send-keys -t %1 Enter
```

- `%1` 是 **tmux Pane ID**，不是 Claude Code 的 Session ID / 名称；先通过 `list-panes` 确认目标。
- `capture-pane` 拿到的是终端可访问的屏幕/历史文本，**不是 Claude 的完整对话上下文**。
- `send-keys` 只是在目标 Pane 模拟键盘输入，可能对运行中的程序产生影响；发送前先确认当前 Pane 状态。
- 多个 Claude 共用同一仓库时，尽量让一个负责修改代码，其余负责只读审查，避免并发覆盖文件。

---

## 本机工作区插件

| 按键 / 命令 | 功能 |
|---|---|
| Prefix → t | 打开 / 关闭左侧 tmux-pane-tree 树形导航 |
| Prefix → T | 聚焦左侧树形导航；再次操作可返回主 Pane |
| Alt + e | 打开 tmux.expose，全局预览 Session 并切换 |
| Prefix → Ctrl+s | tmux-resurrect 保存当前环境 |
| Prefix → Ctrl+r | tmux-resurrect 恢复已保存环境 |
| Prefix → I | TPM 安装配置中声明的插件 |
| Prefix → U | TPM 更新插件 |
| Prefix → Alt+u | TPM 清理未在配置中声明的插件 |

配置文件内容、自检命令、插件说明见 [tmux配置与工作区](./tmux%E9%85%8D%E7%BD%AE%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA.md)。

## 本机桥接绑定

这几条不是普通配置，是把 tmux 和 Pane 内程序接起来的关键，改动前先读对应专题。

```tmux
# Prefix + Ctrl+Z：隐藏 ueberzugpp 图片 → 原生 suspend-client；fg 后恢复图片
bind-key C-z if-shell '/home/duan/.local/bin/tmux-suspend-ueberzug prepare "#{client_pid}" "#{pane_id}"' 'suspend-client' ''

# Prefix + z：放大 Pane；当前是 yazi 时额外触发 video-grid 重绘
bind-key z resize-pane -Z \; if-shell -F '#{==:#{pane_current_command},yazi}' "run-shell -b 'sleep 0.75; tmux send-keys -t #{pane_id} , ,'"
```

### Prefix + Ctrl+Z：挂起前隐藏图片层

不直接调用 `suspend-client`，而是先让 `tmux-suspend-ueberzug` 枚举当前 Window 各 Pane TTY 上的 `ueberzugpp layer -so x11` 进程，通过 ueberzugpp 的 tmux IPC 发送 `client-detached` 隐藏 X11 叠加层。外层 Shell `fg` 后 watcher 检测 client 从 stopped 恢复，再发 `client-session-changed` 让 ueberzugpp 决定是否重新显示。

不加这层，挂起再恢复后图片会错位或残影。


### Yazi 专用缩放刷新

本机 Prefix → z 除了放大 / 还原 Pane，还会在当前 Pane 运行 Yazi 时延迟刷新视频预览：tmux 等待 750ms 后发送内部组合键 ,,，Yazi 的 video-grid 插件强制重新绘制当前九宫格。正常使用不需要手动按 ,,。

> 注意：tmux 的 Prefix → z 是 tmux Pane 放大；Yazi 内的 T 是最大化 Yazi 预览 Pane。两者层级不同。
