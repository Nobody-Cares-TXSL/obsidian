# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 这个库

ThinkPad E480 / Ubuntu 24.04 / X11 上的终端环境文档。目的是让新机器能装出同一套工作流——**复现工具和它们之间的连接，不是复刻版本号**。

纯 Markdown，无构建、测试、lint。上层 vault 规范见 `@../../../CLAUDE.md`。

`README.md` 是导航，登记全部 12 篇文档，增删移动时同步更新。

## 写文档时优先写什么

单个工具的版本号、配置项，读配置文件和跑命令就能得到，价值低。**真正值得写的是工具之间手工接起来的缝**，因为这些没写在任何工具的文档里，换机器必踩：

- Yazi 的 `.md` Enter 走 `~/.local/bin/md-read-hd`，不是默认 pager。链路是 pandoc 转 HTML → Python 本地 HTTP 服务 → Chrome app 窗口，依赖五项：`python3`（脚本 shebang 本体）、`pandoc`、`bs4`、`google-chrome`、`xdotool`（脚本用 `xdotool search --name` 判断阅读窗口是否已存在，缺了不会报错，只会误判后退出）。转换结果只存在进程内存和页面 JS 缓存里，不落盘。这是本机专用脚本，必须连脚本一起拷贝。
- 工作区预览由 TPM 加载二开版插件脚本，`@tmux-expose-command` 指向 `~/.cargo/bin/tmux-workspace-expose`。2026-11-09 改名后包名、bin 名、部署名已统一。**二进制从 TPM 副本目录构建**（不是开发目录），保证脚本与二进制同源：`Prefix + U` 拉取后 `cargo install --locked --path ~/.tmux/plugins/tmux-workspace-expose`。见 [安装来源与维护决策](./07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md#tmux-workspace-expose工作区预览)。
- 核对 Claude Code 的 tmux 状态 Hook 时，按 [事件映射与验收](./06-%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7%E9%93%BE/%E5%BC%80%E5%8F%91%E8%BF%90%E8%A1%8C%E6%97%B6%E4%B8%8EAI-CLI.md#claude-code-的-tmux-状态-hook) 分别确认配置、注册和实际状态。遇到陈旧徽标、写入失败或旧二进制清理，查 [维护决策](./07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md#agent-状态诊断与清理)，以目标 Pane 的读回结果为准。
- Yazi 的 GIF / 视频预览是本机 Lua 插件（`gif-preview`、`video-grid`），且默认 preloader 被设为 `noop`，否则内置预加载器生成的静态首帧会覆盖自定义效果。
- 图片走 X11 + ueberzugpp，不是 Kitty 协议——这是预览能在 tmux 里工作的前提。
- tmux 挂起前要先跑 `tmux-suspend-ueberzug` 隐藏图片层，否则恢复后错位。tmux 放大在 yazi 里时会 `send-keys ,,` 触发重绘。这两处是 tmux 与 Yazi 之间的硬编码联动。
- Shell 的 `y` 函数用 `--cwd-file` 把 Yazi 退出目录回传给 Shell。

这些接缝的完整说明在各专题文档里，本文件只列清单，避免重复。

## 复现时的盲区

装工具本身不难，难在**没有包管理器记录的部分**：

- `/usr/local/bin` 下的 Yazi + ya、lazygit、starship 是 GitHub Release 手工部署的，升级靠手动换二进制。
- `~/.local/bin` 下的 `md-read-hd`、`tmux-suspend-ueberzug`、`mimeapps-guard.sh`、`check-hard-updates` 是本机脚本，无上游来源，只能连文件拷贝。
- `tmux-workspace-expose` 有公开来源（`Nobody-Cares-TXSL/tmux-workspace-expose`），但**不在 crates.io**，必须从源码 `cargo install --path` 安装。包名与命令名现已一致。
- 2026-11-09 已清理全部旧二进制（`tmux-expose`、`tmux-expose-workspace` 及其 `.bak`），本机只剩 `~/.cargo/bin/tmux-workspace-expose` 一个命令。备份在 `~/.local/state/tmux-expose-cleanup-20261109-042939/`。若日后 `cargo install --list` 又显示多个 bin，说明残留记录回来了——那通常是改名或换安装方式后 cargo 的 bins 列表累积所致，按 mtime 与 `--help` 文本判断哪个是真身。
- `~/.config/tmux-expose/` 下的 `appearance.conf`、`grid.conf` 是插件设置，目录名沿用上游旧名，无包管理器记录，只能拷贝。
- `fd`→`fdfind`、`magick`→`convert` 是手工软链，补上游包名与命令名的差异。
- ueberzugpp 来自 OBS 第三方源，不是 Ubuntu 官方源。

其余工具的安装渠道见 `07-安装与维护/安装来源与维护决策.md`。

## 改文档前取证

不凭印象写版本和路径：

| 要确认 | 命令 |
|---|---|
| 命令命中哪个二进制 | `command -v`、`type -a` |
| 软链指向 | `readlink -f` |
| 二进制属于哪个包 | `dpkg -S` |
| alternatives 当前值 | `update-alternatives --query` |
| GUI 进程实际二进制 | `pgrep -a -x` → `readlink /proc/PID/exe` |
| tmux 重复用户选项的**全部**取值 | `grep` 配置文件；`show-options -g @opt` 只返回最后一条，会少报 |
| 某插件/二进制是否真在用 | 同时查：配置文件引用、PATH 命中、`--version` 实际输出。三者可以互相矛盾 |

**禁止为探测能力反复启动 GUI 应用。** 先 `file` 或 `readlink -f` 判断目标性质——`~/.local/bin/obsidian` 就是 Electron 本体，跑一次就弹窗。

区分四件事：已安装、PATH 命中、GUI 进程在跑、GNOME 默认入口。它们可以互不相同。

## 改文档的硬规则

- 中文和空格路径必须 URL 编码：`python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "../05-命令行工具/TUI与CLI工具.md"`
- 移动文件前搜全库入链，改完再搜旧路径；同时更新源文档出链、其他文档入链、README、本文件。
- 同一内容不抄两处，用相对链接。主题过大按 Yazi 的方式拆"导航页 + 专题页"。
- frontmatter 含 `title`、`updated`、`tags`，`updated` 用 `YYYY-MM-DD`，实质修改后更新。
- 候选、停用、实验文件不写成现役：`plugins/` 下带 `.disabled-`、`.bak-` 后缀的都不是运行入口。
- 不记录密码、Token、Cookie、私钥，只记变量名、位置、风险。
- 未验证的结论标"待核实"。
- 用户没要求改系统配置时，只改文档。
- 改配置前先备份，不覆盖用户原有快捷键或配置段落。
