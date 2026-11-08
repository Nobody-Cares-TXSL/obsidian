---
title: tmux 配置与工作区
updated: 2026-11-08
tags: [tmux, terminal, workspace, multiplexer]
---

# tmux 配置与工作区

## 当前状态

- 版本：tmux 3.4。
- 程序：/usr/bin/tmux，APT 管理。
- 配置：~/.tmux.conf。
- Prefix：Ctrl + B（默认）。
- Window 与 Pane 编号均从 1 开始。
- mouse：on。

快捷键请看 [tmux快捷键速查表](./tmux%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%80%9F%E6%9F%A5%E8%A1%A8.md)；本文件记录配置结构、插件和工作区行为。

## 核心配置

| 配置 | 当前值 | 作用 |
|---|---|---|
| mouse | on | 鼠标选择 Pane、调整大小、滚动 |
| allow-passthrough | on | 允许应用透传终端控制序列 |
| update-environment | TERM、TERM_PROGRAM | 创建 / 重新附加时同步终端标识 |
| base-index | 1 | Window 从 1 开始 |
| pane-base-index | 1 | Pane 从 1 开始 |

自定义分屏：
- Prefix + |：左右分屏。
- Prefix + _：上下分屏。
- Prefix + F3：创建三屏布局。
- Prefix + F4：创建四屏布局。

F3 / F4 会继续新增 Pane，不是把已有布局重置为三屏或四屏。建议从单 Pane Window 使用。

## 图片协议与 Yazi 兼容

当前 Alacritty + tmux + X11 下，Yazi 走 ueberzugpp 的 X11 叠加方案。

- allow-passthrough on：允许应用控制序列透传。
- update-environment 中同步 TERM 与 TERM_PROGRAM：让 tmux 在创建 Session 或重新附加时同步外层终端标识。
- 是否真正使用某种原生图片协议，必须在 tmux 内运行 Yazi 检查，不能只看终端支持列表。

当前 .tmux.conf 使用 set -ga 追加 TERM 和 TERM_PROGRAM。实际全局选项里曾观察到重复项，这是多次 source-file 后重复追加的结果；目前功能正常，但配置有清理空间。后续若整理，应先用 tmux show-options -g update-environment 核对，再以幂等方式设置，不要盲目重复追加。

## Prefix + z：Yazi 视频预览刷新

普通情况下 Prefix + z 放大 / 还原当前 Pane。

本机额外处理：
1. tmux 执行 resize-pane -Z。
2. 如果当前 Pane 的前台命令是 yazi，延迟 750ms。
3. 向该 Pane 发送 Yazi 内部按键 ,,。
4. Yazi 的 keymap 将 ,, 绑定到 plugin video-grid。
5. 插件入口调用 ya.emit("peek", { force = true })，强制刷新当前预览。

该机制用于解决 tmux 改变 Pane 尺寸后，Yazi 已经重排布局但没有重新绘制当前九宫格的问题。连续放大 / 还原已实际验收通过。

注意：,, 是内部刷新组合键，不是日常交互快捷键；不要在其他插件中重复占用。完整 GIF / 视频预览实现见 [Yazi媒体预览](../04-%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E5%99%A8/Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md)。

## Prefix + Ctrl+Z：挂起时隐藏、fg 后恢复图片

本机保留 tmux 原生的挂起 / 恢复语义，不把挂起改成分离：

1. 按 Prefix + Ctrl+Z 时，tmux 先执行 `~/.local/bin/tmux-suspend-ueberzug prepare`。
2. 脚本枚举当前 Window 的 Pane，定位各 Pane TTY 上的 `ueberzugpp layer -so x11` 进程。
3. 通过 ueberzugpp 内部 tmux IPC 发送 `client-detached`，只隐藏 X11 图片叠加层，不杀 Yazi 或 ueberzugpp。
4. 启动独立 Session 的轻量 watcher，确认 watcher 已就绪后，tmux 执行原生 `suspend-client`。
5. 用户在外层 Shell 执行 `fg` 后，watcher 检测 tmux client 从 stopped 状态恢复，再发送 `client-session-changed`，由 ueberzugpp 根据当前 Session / Window 状态决定是否重新显示。

与分离的区别：
- Prefix + Ctrl+Z：tmux client 进入 job-control stopped 状态；Shell 中 `fg` 恢复同一个客户端。
- Prefix + d：正常 detach；Session 留在后台，之后用 `tmux attach` 重新连接。ueberzugpp 自带 `client-detached` hook 负责隐藏图片。

实现文件：`~/.local/bin/tmux-suspend-ueberzug`；日志：`~/.cache/tmux-suspend-ueberzug.log`。如果 watcher 无法启动，脚本会先尝试恢复图片并中止挂起准备，不应留下“隐藏后无法恢复”的状态。

该修复已在独立临时 tmux Session 中完成真实 job-control 测试：客户端状态从 `T` 经 `fg` 恢复，日志确认隐藏与恢复 IPC 均执行；临时测试使用独立 ueberzugpp layer 验证生命周期，不等同于用户桌面上真实视频九宫格的最终视觉验收。

## 已安装的 TPM 插件

TPM 目录：~/.tmux/plugins/tpm。配置文件末尾通过 run 初始化 TPM。

| 插件 | 作用 | 本机设置 / 状态 |
|---|---|---|
| tmux-pane-tree | 左侧 Session / Window / Pane 树形导航，可显示 Agent 状态 | 宽度 25；自动修改 Agent 配置的 hooks 关闭 |
| tmux.expose | 类 Mission Control 的 Session 预览与切换 | Alt + e；tmux-expose 0.8.0 已安装 |
| tmux-resurrect | 手动保存 / 恢复 tmux 环境 | 默认 Prefix + Ctrl+s 保存，Prefix + Ctrl+r 恢复 |
| tmux-continuum | 定时保存与启动时恢复 | @continuum-restore = on |
| TPM | 安装、更新、卸载 tmux 插件 | Prefix + I 安装，Prefix + U 更新，Prefix + Alt+u 清理 |

### 插件边界

- tmux-pane-tree 提供树形导航，不等同于全局缩略图预览。
- tmux.expose 展示 Session 的实时文本缩略图，用于视觉化切换工作区。
- tmux-resurrect 保存 Session、Window、Pane、布局和部分程序状态。
- tmux-continuum 依赖 resurrect，默认每 15 分钟后台保存；自动恢复只在 tmux server 启动时发生。
- pane-tree 的 Agent hooks 当前关闭，不应假设 Claude / Codex 状态徽标已经自动接入。

## 会话与工作区模型

- Session：一组独立工作环境。
- Window：Session 内的工作台页面。
- Pane：Window 内的分屏终端。
- Detach：离开 tmux 客户端，但 Session 内程序继续运行。
- Resurrect / Continuum：解决 tmux server 或机器重启后的环境恢复问题。
tmux 不是完整的图形桌面工作区管理器；它保存的是终端工作环境，不会自动恢复桌面上的浏览器、GUI IDE 等所有窗口。

## 鼠标滚轮

配置区分普通 Shell、Copy Mode 和全屏 TUI：
- 普通 Shell 向上滚动进入 tmux Copy Mode。
- 处于应用鼠标模式或 tmux 模式时，优先将事件交给应用。
- 全屏备用屏幕中，滚轮模拟方向键，每次移动 3 行。

## 常用核验与维护

~~~bash
tmux -V
tmux show-options -g mouse
tmux show-options -g allow-passthrough
tmux show-options -g update-environment
tmux list-keys -T prefix
tmux list-sessions
tmux source-file ~/.tmux.conf
bash -n ~/.local/bin/tmux-suspend-ueberzug
tail -f ~/.cache/tmux-suspend-ueberzug.log
~~~

重新加载配置不会自动重启 tmux server，也不会让现有 Pane 中的进程自动获得新的环境变量。不要为了应用小改动直接执行 tmux kill-server；先评估当前会话中的任务。

