---
title: Yazi 基础配置
updated: 2026-11-08
tags: [yazi, file-manager, configuration]
---

# Yazi 基础配置

> 当前版本：Yazi / ya 26.9.1
> 主程序：/usr/local/bin/yazi
> 配置目录：~/.config/yazi/
> 媒体预览与 tmux 刷新：[Yazi媒体预览](./Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md)
> 快捷键：[yazi快捷键速查表](./yazi%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%80%9F%E6%9F%A5%E8%A1%A8.md)

## 安装与配置文件

Yazi 当前通过 GitHub Release 手动部署到 /usr/local/bin，不由 APT 管理。升级时需要手动替换 yazi 和 ya。

| 文件 / 目录 | 职责 |
|---|---|
| yazi.toml | 布局、预览规则、打开规则、Fetcher |
| keymap.toml | 自定义快捷键 |
| init.lua | 插件初始化 |
| package.toml | 上游插件 revision / hash 锁定 |
| plugins/ | 上游插件与本机自定义插件 |

## 文件列表与预览布局

yazi.toml 当前关键值：
- show_hidden = true。
- ratio = [1, 3, 4]：父目录、当前目录、预览区域。
- linemode = size。
- scrolloff = 5。
- preview.wrap = no，tab_size = 4。
- max_width / max_height = 1200。
- cache_dir = ~/.cache/yazi。
- ueberzug_scale = 1。

当前布局偏向预览区域；文本不自动折行，保留代码原始横向结构。

## 预览规则组织方式

主配置通过 prepend_previewers / prepend_preloaders 追加规则，不整体覆盖 Yazi 内置规则。

| MIME / 类型 | 当前规则 |
|---|---|
| image/gif | gif-preview 自定义插件，见 [Yazi媒体预览](./Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md) |
| video/* | video-grid 自定义插件，见 [Yazi媒体预览](./Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md) |
| application/json、application/ndjson | json 内置预览器 |
| 常见压缩包 | archive 内置预览器 |
| 其他 | 保留 Yazi 默认预览规则 |

GIF 与视频对应的默认 preloader 设为 noop，避免默认预加载器生成静态首帧缓存，干扰自定义预览。

## 文件打开规则

当前 open.prepend_rules 按顺序匹配，命中后停止：

| 顺序 | 匹配 | Enter 首选行为 |
|---|---|---|
| 1 | mime = video/* | VLC 播放原视频 |
| 2–3 | *.md / *.markdown | md-read-hd 高清阅读器 |
| 4 | *.html / *.htm | Google Chrome 新窗口 |
| 5–7 | text/x-*、text/javascript、application/json/ndjson | batcat 只读分页 |
| 8 | 源码与配置扩展名白名单 | batcat 只读分页 |
| 其他 | 未匹配文件 | Yazi 内置默认规则 |

源码扩展名白名单包括 py、js、jsx、ts、tsx、vue、java、rs、go、c、h、cpp、hpp、sh、zsh、lua、css、xml、json、jsonc、yaml、yml、toml、ini、sql、mdx。

## Opener

| opener | 命令 / 行为 |
|---|---|
| vlc | vlc --started-from-file；orphan=true，独立运行 |
| edit | 使用 EDITOR（当前 Vim），也可选 code；block=true |
| view_code | batcat --color=always --style=numbers,header --paging=always；只读分页 |
| md_read_hd | ~/.local/bin/md-read-hd；block=true |
| html_render | google-chrome --new-window |

查看源码和编辑源码是两种行为：Enter 默认使用只读 batcat，编辑通过 o 菜单选择 EDITOR 或 VS Code。

## 自定义快捷键

| 按键 | 插件 | 功能 |
|---|---|---|
| c，然后 m | chmod | 修改选中文件权限 |
| T | toggle-pane max-preview | 最大化 / 恢复 Yazi 预览 Pane |
| + / - | zoom | 放大 / 缩小图片 |
| ,, | video-grid | 内部刷新键，细节见 [Yazi媒体预览](./Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md) |
Yazi 的 T 操作的是 Yazi 内部预览 Pane；tmux 的 Prefix + z 操作的是 tmux Pane，两者不是同一层。

## 插件清单

上游插件通过 package.toml 锁定 revision / hash：
- git：文件列表显示 Git 状态；init.lua 中 require("git"):setup。
- chmod：修改文件权限。
- toggle-pane：隐藏、显示或最大化目录 / 预览 Pane。
- zoom：图片缩放。

本机自定义插件：
- gif-preview：原始 GIF 动画预览，见 [Yazi媒体预览](./Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md)。
- video-grid：视频九宫格，见 [Yazi媒体预览](./Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md)。

package.toml 中的上游插件锁定信息：

| 插件 | revision | hash |
|---|---|---|
| git | 9166202 | 347cc6b190eb0c2fd60513cc7ae37412 |
| chmod | 9166202 | 87472b05a8c420100f6a2b9cde1e7746 |
| toggle-pane | 9166202 | 5b2fbef7d1513ce38ff72623a071a5e |
| zoom | 9166202 | 558bbb58e3dd36d488280a8f10e7b904 |

自定义插件不在 package.toml 的上游依赖锁定列表中，必须连同源码和 README 一起备份。

常用插件管理命令：
~~~bash
ya pkg list
ya pkg upgrade
ya pkg add yazi-rs/plugins:<插件名>
ya pkg delete <插件名>
~~~

历史或实验目录：
- live-media.yazi.disabled-20261107-231719：旧实验插件，已停用。
- force-peek.yazi：早期诊断插件，没有绑定快捷键，不属于当前刷新链路。
- video-grid.yazi/main.lua.bak-*：调试备份，不是运行入口。

## Git 状态联动

init.lua 中初始化 git 插件，并设置 order=1500。yazi.toml 为普通文件和目录分别注册 Git Fetcher，group 为 git，用于显示未跟踪、已暂存、未暂存、删除、更新等状态。

## Shell 与 Yazi 目录联动

~/.zshrc 定义 Shell 函数 y：
1. 创建临时文件。
2. 启动 yazi，并通过 --cwd-file 保存退出时目录。
3. 退出后读取目录。
4. 若目录有效且发生变化，则在当前 Shell 中 cd 到新目录。
5. 删除临时文件。

因此，想让“Yazi 里进入哪个目录，退出后 Shell 就停在哪个目录”，在 Shell 中使用 y，而不是直接执行 yazi。

## Markdown 高清阅读器

脚本：~/.local/bin/md-read-hd。

- Pandoc 将 Markdown 转为 HTML5。
- Python 临时服务仅监听 127.0.0.1。
- Chrome 以独立 App 窗口展示。
- Markdown 链接可在同一 App 窗口内继续跳转，图片可单独打开。
- 顶部提供“后退 / 前进”按钮，按阅读历史切换文档；没有对应历史时按钮禁用。
- 快捷键：Alt + ← 后退、Alt + → 前进、Backspace 后退。
- 后退后若打开新文档，会丢弃原有的前进分支，行为与浏览器历史一致。
- 文档按需转换，结果只存在 Python 进程的 dict 和页面 JS 的 Map 里；关闭窗口后停止本地 HTTP 服务，释放进程内转换缓存。**不产生持久化的 HTML 转换文件**。脚本自述即为 "on-demand conversion, no persistent cache"。

外部依赖五项，缺一不可，且缺失表现各不相同：

| 依赖 | 用途 | 缺失后果 |
|---|---|---|
| python3 | 脚本本体（`#!/usr/bin/env python3`） | 无法启动 |
| pandoc | Markdown → HTML5（`--from=gfm --to=html5 --standalone`） | 抛 RuntimeError，报转换失败 |
| bs4 (BeautifulSoup) | 改写 pandoc 输出的 HTML | import 失败，直接崩 |
| google-chrome | `--new-window --start-maximized --app=<url>` 展示 | 打不开窗口 |
| xdotool | `xdotool search --name <marker>` 判断阅读窗口是否已存在 | **不报错**，误判为"未启动"后退出，最难排查 |

这不是直接让 Chrome 打开 Markdown 原文件，而是本机专用的转换与阅读流程。迁移新机器时 `xdotool` 是最容易漏的一项，因为 Ubuntu 桌面默认不带。
## 备份要求

恢复 Yazi 时至少备份：
- yazi.toml、keymap.toml、init.lua、package.toml。
- 整个 plugins/ 目录，包括自定义插件源码和 README。
- 使用 flavor 时，还要备份 flavor 目录。

只备份 yazi.toml 会丢失插件实现和 package.toml 的 revision / hash 锁定信息。
