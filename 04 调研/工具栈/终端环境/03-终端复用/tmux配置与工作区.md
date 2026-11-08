---
title: tmux 配置与工作区
updated: 2026-11-09
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

当前 Alacritty + tmux + X11 下，Yazi 的图片走 ueberzugpp 的 X11 叠加方案，**不走任何终端图片协议**。三件事互相独立，容易混为一谈：

| 机制 | 实际作用 | 与图片预览的关系 |
|---|---|---|
| allow-passthrough on | 允许应用把终端控制序列透传给外层终端 | **不是**当前 ueberzugpp 预览的必要条件。图片由终端窗口外部的 X11 叠加窗口绘制，不经过 tmux 的字符通道 |
| update-environment TERM / TERM_PROGRAM | 客户端重连时同步外层终端标识 | 影响 Yazi 选择哪个 image adapter，与透传无关 |
| ueberzugpp | X11 叠加窗口的实际绘制者 | 真正让预览在 tmux 里可见的组件，依赖 DISPLAY 与 X11 会话 |

推论：只有在切换到 Kitty Graphics / Sixel / iTerm2 Inline Images 这类走字符通道的协议时，allow-passthrough 才变成关键。判断当前到底用哪种方式，必须在 tmux 内跑 Yazi 看 `ya env`，不能只看终端支持列表。

当前 server 的 update-environment 实测为 10 项：DISPLAY、KRB5CCNAME、SSH_ASKPASS、SSH_AUTH_SOCK、SSH_AGENT_PID、SSH_CONNECTION、WINDOWID、XAUTHORITY、TERM、TERM_PROGRAM，其中 TERM 与 TERM_PROGRAM 各一份，无重复。

但 .tmux.conf 用的是 `set -ga` 追加语义，这个写法不幂等：在同一 server 上反复 `source-file` 会把同一项重复追加进去。核对命令 `tmux show-options -g update-environment`，若要整理应改为幂等赋值，不要盲目重复追加。

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

当前 `@plugin` 共 4 项（tpm、tmux-workspace-expose、resurrect、continuum）。列举时请用 `grep -o "@plugin '[^']*'" ~/.tmux.conf`，**不要**用 `tmux show-options -g @plugin`：tmux 对重名用户选项只保留最后一个值，show-options 只返回 continuum 一条，看起来像只装了一个插件。

2026-11-09 已卸载 tmux-pane-tree：配置项、`~/.tmux/plugins/tmux-pane-tree/` 目录、它注册的键位与 hooks 都已清除。`Prefix + t` 因此恢复为 tmux 内置的 `clock-mode`（时钟），不再切换树形导航。归档在 `~/.local/state/tmux-pane-tree-uninstall.ASMlAk/`（插件目录 + 当时的 tmux.conf，约 9 MiB），回滚步骤见 [安装来源与维护决策](../07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md)。

TPM 自己不受这个限制影响。它的 `scripts/helpers/plugin_functions.sh` 第 76–77 行把配置文件全文 `cat` 出来后用 **awk** 提取（`_tmux_conf_contents "full"` + `awk '/^[ \t]*set(-option)? +-g +@plugin/ { ... print $4 }'`），走文本解析而不是选项查询，所以重复的 `set -g @plugin` 每一条都算数。同一文件里的 `sed` 属于 `_sourced_files()`，用途是找 `source` 出来的其他文件，与插件列表无关。

`Prefix + Alt+u`（`clean_plugins.sh`）会 `rm -rf` 插件目录下任何未在配置中声明的副本，`tpm` 自身除外。判断方式：

~~~bash
case "${plugins}" in
    *"${plugin}"*) : ;;
~~~

`${plugin}` 在双引号内，展开结果**按字面量匹配**，目录名里的 `.` 不会变成通配符。执行前仍建议先看它准备删什么——它是直接 `rm -rf`，没有确认步骤。2026-11-09 之后 `~/.tmux/plugins/` 下只剩 4 个已声明目录，`Prefix + Alt+u` 当前没有可清理对象。

| 插件 | 作用 | 本机设置 / 状态 |
|---|---|---|
| tmux-workspace-expose | 类 Mission Control 的 Session / Window 预览与切换 | 上游 tmux.expose 的二开版，由 TPM 从公开仓库加载；Alt + e / Alt + w / Ctrl + , |
| tmux-resurrect | 手动保存 / 恢复 tmux 环境 | 默认 Prefix + Ctrl+s 保存，Prefix + Ctrl+r 恢复 |
| tmux-continuum | 定时保存与启动时恢复 | @continuum-restore = on |
| TPM | 安装、更新、卸载 tmux 插件 | Prefix + I 安装，Prefix + U 更新，Prefix + Alt+u 清理 |

### tmux-workspace-expose 的入口与键位

这是上游 `cesarferreira/tmux.expose` 的二开版本，已发布为公开仓库并由 TPM 加载。~/.tmux.conf 第 74–75 行：

~~~tmux
set -g @tmux-expose-command '/home/duan/.cargo/bin/tmux-expose'
set -g @plugin 'Nobody-Cares-TXSL/tmux-workspace-expose'
~~~

三个入口都在 **root 表**（不需要 Prefix），2026-11-08 用 `tmux list-keys -T root` 实测确认：

| 按键 | 模式参数 | 打开 |
|---|---|---|
| `Alt + e` | 0 | 全局 Session 总览 |
| `Alt + w` | 2 | 当前 Session 的 Window 总览 |
| `Ctrl + ,` | 1 | 设置界面（全屏弹出） |

`Ctrl + ,` 这一行有个不显然的机制：tmux 里实际绑的是 `S-F12`，因为 Alacritty 把 `Ctrl + ,` 发成 tmux 3.4 识别为 Shift+F12 的终端序列。也就是说这个键位是**终端与 tmux 版本共同决定的**，换终端后可能失效——绑定本身不会报错，只是按了没反应。

2026-11-09 起源码树、TPM 插件副本、部署二进制**三处已对齐到 `43a570e`**：副本与源码树的 `src/`、入口脚本、`Cargo.toml` 逐字节一致，二进制 MD5 `e09c223f…`。这是靠一次人工操作达成的，不是自动同步——将来任何一处单独变动都会重新产生偏差，核对方法见 [安装来源与维护决策](../07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md)。

2026-11-09 已移出旧版 TPM 目录并卸载旧 Cargo 二进制。备份位置和核验结果见 [旧版副本清理](../07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md#旧版副本清理)。

### Agent 状态标记

卡片上的 working / waiting / attention 徽标来自**显式命令**，插件不读终端文本猜测状态：

~~~bash
tmux-expose agent-status working    # 或 waiting / attention / clear
~~~

Hook 子进程继承 `$TMUX_PANE`，命令把状态写进该 Pane 的选项。用下面两条命令读回状态和时间戳，清除后两项都应为空。

~~~bash
tmux show-options -pqv -t "$TMUX_PANE" @agent_status
tmux show-options -pqv -t "$TMUX_PANE" @agent_status_since
~~~

本机 Claude Code 已配置五个事件。事件映射和真实会话验收步骤见 [Claude Code 的 tmux 状态 Hook](../06-%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7%E9%93%BE/%E5%BC%80%E5%8F%91%E8%BF%90%E8%A1%8C%E6%97%B6%E4%B8%8EAI-CLI.md#claude-code-的-tmux-状态-hook)。长期停在 `attention` 时按 [状态诊断与清理](../07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md#agent-状态诊断与清理) 排查。

构建链路、四种名字（包名 / 库名 / 命令名 / 本机部署名）和清理建议见 [安装来源与维护决策](../07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md)。

### 插件边界

- tmux-workspace-expose 展示 Session / Window 的实时文本缩略图，用于视觉化切换工作区；设置界面持久化到 ~/.config/tmux-expose/（目录名沿用上游旧名，不是新仓库名）。
- tmux-resurrect 保存 Session、Window、Pane、布局和部分程序状态。
- tmux-continuum 依赖 resurrect，默认每 15 分钟后台保存；自动恢复只在 tmux server 启动时发生。
- tmux-pane-tree 已于 2026-11-09 卸载。它的树形导航曾与总览插件职责重叠，且会额外注册键位与 hooks；卸载后 Claude Code 状态完全由本机手动配置的 hook 写入。Codex 的自动状态接入未再核实。

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

