---
title: TUI 与 CLI 工具清单
updated: 2026-11-08
tags: [tui, cli, terminal-tools]
---

# TUI 与 CLI 工具

本文件记录运行在终端里的独立应用和辅助命令。它们不属于 Alacritty 或 Zsh 本体，更换终端模拟器时通常可以原样保留。

## 交互式 TUI 应用

| 工具 | 版本 | 路径 / 来源 | 用途 |
|---|---|---|---|
| Yazi | 26.9.1 | /usr/local/bin/yazi | 文件管理与预览，详见 [Yazi配置与预览系统](../04-%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E5%99%A8/Yazi%E9%85%8D%E7%BD%AE%E4%B8%8E%E9%A2%84%E8%A7%88%E7%B3%BB%E7%BB%9F.md) |
| tmux | 3.4 | /usr/bin/tmux，APT | Session / Window / Pane |
| lazygit | 0.66.2 | /usr/local/bin/lazygit | Git 提交、分支、暂存区 |
| btop | 1.3.0 | /usr/bin/btop，APT | CPU、内存、磁盘、网络、进程 |
| glow | 3.0.0 | /usr/bin/glow，APT | 终端 Markdown 阅读 |
| Harlequin | 2.16.2 | ~/.local/bin/harlequin，uv tool | 数据库终端 IDE |
| hsql | 2.16.2 | ~/.local/bin/hsql，同一 uv tool | Harlequin 附带的 SQL CLI |
| fastfetch | 2.59.0 | /usr/bin/fastfetch，APT | 系统信息展示，当前未自动启动 |

## Shell / CLI 辅助工具

| 工具 | 版本 | 命令 / 路径 | 用途 |
|---|---|---|---|
| Starship | 1.27.0 | /usr/local/bin/starship | Prompt，详见 [Zsh与Starship](../02-%E7%BB%88%E7%AB%AF%E4%B8%8EShell/Zsh%E4%B8%8EStarship.md) |
| zoxide | 0.9.3 | /usr/bin/zoxide | 智能目录跳转 |
| fzf | 0.74.5 | ~/.local/bin/fzf | 模糊筛选 |
| fd | 9.0.0 | /usr/local/bin/fd → /usr/bin/fdfind | 文件查找 |
| ripgrep | 14.1.0 | /usr/bin/rg | 内容搜索 |
| batcat | 0.24.0 | /usr/bin/batcat | 语法高亮文件查看 |
| jq | 1.7 | /usr/bin/jq | JSON 处理 |
| Vim | 9.1 | /usr/bin/vim → /usr/bin/vim.gtk3，APT | 终端编辑器，带 X11 剪贴板支持 |
| resvg | 0.49.0 | ~/.local/bin/resvg | SVG 渲染，供 Yazi 使用 |
| RTK | 1.1.0 | ~/.local/bin/rtk | 面向 Agent / CLI 输出的过滤与 Token 优化 |
| crapper | 0.1.0 | ~/.local/bin/crapper → ub-tools | CRAP 复杂度分数 |
| dryer | 0.1.0 | ~/.local/bin/dryer → ub-tools | 重复代码检测 |
| mutator | 0.1.0 | ~/.local/bin/mutator → ub-tools | 变异测试 |

## 常见命令名差异

- Ubuntu 的 bat 包提供 batcat，不提供 bat；当前交互式 Zsh 另有 cat=batcat 的 alias。
- Ubuntu 的 fd-find 包提供 fdfind；/usr/local/bin/fd 是指向 fdfind 的兼容软链。
- fzf 的 APT 版本为 0.44.1，PATH 当前优先命中用户目录 0.74.5。
- /usr/local/bin/magick 是指向 /usr/bin/convert 的手工软链；实际是 ImageMagick 6.9.12，不是 ImageMagick 7。
- eza、exa、nvim、yq 当前未安装。

## 工具配置摘要

### Harlequin

配置：~/.harlequin.toml。当前 profile 指向本机 127.0.0.1:3306，使用 root 账号并设置 read_only=true；密码由 .zshrc 中的 DB_PASS 环境变量提供。文档不记录密码值，迁移秘密存储的事项见 [安装来源与维护决策](../07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md)。

### btop

配置：~/.config/btop/btop.conf

- Default 主题、truecolor、圆角边框。
- Braille 图表。
- CPU、内存、网络、进程、Swap、磁盘、频率和温度信息。
- 刷新间隔 2000ms。
- 进程按 CPU 排序。

### fastfetch

配置：~/.config/fastfetch/config.jsonc
- 从 ~/.config/fastfetch/Logo 随机选择文本 Logo。
- 展示系统、主机、内核、Shell、桌面、终端、CPU、GPU、内存、Swap、磁盘、网络、电池和 Locale。
- .zshrc 中自动启动语句已注释。

### glow

配置：~/.config/glow/glow.yml
- style=auto。
- mouse=false。
- pager=false。
- width=80。
- all=false。

### lazygit

配置：~/.config/lazygit/config.yml，目前为空文件；当前基本使用程序默认配置。

### RTK

配置：~/.config/rtk/config.toml 和 filters.toml。
- 遥测关闭。
- 启用 Token 使用统计，历史保留 90 天。
- 对 .git、node_modules、target、dist、build、.cache 等目录过滤。
- 失败时保留原始日志，最多 20 个文件，单文件上限 1 MiB。
- 对 curl、wget、git rebase、git cherry-pick、docker exec 等命令设置排除规则。

### Vim

`/usr/bin/vim` 经 alternatives 手动指向 `vim.gtk3`（Ubuntu 默认的 `vim.basic` 不带 `+clipboard`），`~/.vimrc` 设 `clipboard=unnamedplus`，yank 直接进 X11 剪贴板。代价是连带装了 ruby、libruby 等约 46 MiB 依赖，`vi`、`view`、`gvim` 等一组名字也一并改指向。

版本变体、回滚方法和未核实的剪贴板持久性见 [安装来源与维护决策](../07-%E5%AE%89%E8%A3%85%E4%B8%8E%E7%BB%B4%E6%8A%A4/%E5%AE%89%E8%A3%85%E6%9D%A5%E6%BA%90%E4%B8%8E%E7%BB%B4%E6%8A%A4%E5%86%B3%E7%AD%96.md)。

### crapper / dryer / mutator

unclebob 的三件套，用于代码质量度量。三者共享同一套语言识别和函数边界定义（tree-sitter），只比较同语言内的代码。

| 工具 | 作用 | 产出 |
|---|---|---|
| crapper | CRAP 分数 = CC² × (1−coverage)³ + CC | 终端表格 + `.metrics/crap.edn` |
| dryer | 找重复代码，结构指纹的 Jaccard 相似度，默认阈值 0.82 | 终端输出候选对 |
| mutator | 变异测试，killed / (killed + survived) | `.metrics/mutate/<namespace>.edn` |

支持 Clojure、Java、Go、TypeScript、Rust、Python。

部署方式：源码在 `~/.local/share/ub-tools/<工具名>/`（各自是独立 git 仓库，来自 `github.com/unclebob/<工具名>`），`~/.local/bin/<工具名>` 是三行的 `exec` 包装脚本。**首次运行时脚本自动创建 `.venv` 并 `pip install -e` 本仓库**，所以首次执行会慢。

mutator 的约束：crapper 必须检出在它的相邻目录（`../crapper`），因为函数名和 namespace 从 crapper 取。三者都跳过 `test`、`spec`、`vendor`、`node_modules`、`target`。

常用参数：

~~~bash
crapper --no-coverage              # 只算复杂度
crapper --changed                  # 只算 git 改动
mutator --scan src/                # 只列变异点，不跑测试
mutator --test-command "pytest -q" # 指定测试命令
~~~

## fzf 的使用边界

当前 fzf 0.74.5 可在 Yazi 中用于模糊跳转，也可在 Shell 管道中使用。
~~~bash
fd | fzf
fd -t f | fzf --preview 'batcat --color=always {}'
git branch -a | fzf
git log --oneline | fzf --preview 'git show --stat --color {1}'
~~~

当前没有启用 fzf 的 Zsh Shell 集成，因此 Ctrl+R、Ctrl+T、Alt+C 不是 fzf 的快捷键。