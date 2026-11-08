# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 这个库

ThinkPad E480 / Ubuntu 24.04 / X11 上的终端环境文档。目的是让新机器能装出同一套工作流——**复现工具和它们之间的连接，不是复刻版本号**。

纯 Markdown，无构建、测试、lint。上层 vault 规范见 `@../../../CLAUDE.md`。

`README.md` 是导航，登记全部 12 篇文档，增删移动时同步更新。

## 写文档时优先写什么

单个工具的版本号、配置项，读配置文件和跑命令就能得到，价值低。**真正值得写的是工具之间手工接起来的缝**，因为这些没写在任何工具的文档里，换机器必踩：

- Yazi 的 `.md` Enter 走 `~/.local/bin/md-read-hd`，不是默认 pager。链路是 pandoc 转 HTML → Python 本地 HTTP 服务 → Chrome app 窗口，依赖 `pandoc`、`bs4`、`google-chrome`。这是本机专用脚本，必须连脚本一起拷贝。
- Yazi 的 GIF / 视频预览是本机 Lua 插件（`gif-preview`、`video-grid`），且默认 preloader 被设为 `noop`，否则内置预加载器生成的静态首帧会覆盖自定义效果。
- 图片走 X11 + ueberzugpp，不是 Kitty 协议——这是预览能在 tmux 里工作的前提。
- tmux 挂起前要先跑 `tmux-suspend-ueberzug` 隐藏图片层，否则恢复后错位。tmux 放大在 yazi 里时会 `send-keys ,,` 触发重绘。这两处是 tmux 与 Yazi 之间的硬编码联动。
- Shell 的 `y` 函数用 `--cwd-file` 把 Yazi 退出目录回传给 Shell。

这些接缝的完整说明在各专题文档里，本文件只列清单，避免重复。

## 复现时的盲区

装工具本身不难，难在**没有包管理器记录的部分**：

- `/usr/local/bin` 下的 Yazi + ya、lazygit、starship 是 GitHub Release 手工部署的，升级靠手动换二进制。
- `~/.local/bin` 下的 `md-read-hd`、`tmux-suspend-ueberzug`、`mimeapps-guard.sh` 是本机脚本，无来源，只能拷贝。
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
