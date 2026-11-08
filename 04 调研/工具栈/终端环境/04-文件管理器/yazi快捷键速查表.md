---
title: Yazi 快捷键速查表
created: 2026-05-18
updated: 2026-11-08
tags: [yazi, terminal, cheatsheet]
---

# Yazi 快捷键速查表

> 本机版本：Yazi 26.9.1
> 配置：~/.config/yazi/
> 详细配置与预览链路：[Yazi配置与预览系统](./Yazi%E9%85%8D%E7%BD%AE%E4%B8%8E%E9%A2%84%E8%A7%88%E7%B3%BB%E7%BB%9F.md)

## 核心操作速查

| 导航 | 选择 / 打开 | 文件操作 | 其他 |
|---|---|---|---|
| j / ↓：下移 | Space：选择 | y：复制 | ;：运行 Shell，:：阻塞运行 |
| k / ↑：上移 | v：可视选择 | x：剪切 | f：过滤列表 |
| h / ←：返回上级 | V：退出选择模式 | p：粘贴 | /：名称查找 |
| l / →：进入目录 | Enter / o：打开 | P：覆盖粘贴 | S：内容搜索 |
| gg：列表顶部 | Ctrl+a：全选 | Y / X：取消复制剪切 | z：fzf 模糊跳转 |
| G：列表底部 | Ctrl+r：反选 | d：移入回收站 | Z：zoxide 跳转 |
| H / L：目录历史后退 / 前进 | .：显示 / 隐藏文件 | D：永久删除 | t：新 Tab |

## 导航与标签页

- j / k 或方向键：移动光标。
- h：返回父目录；l：进入目录或打开选中目录。
- gg：跳到顶部；G：跳到底部。
- H / L：访问历史后退 / 前进。
- t：新建 Tab；1–9：切换对应 Tab；[ / ]：前后 Tab。

## 选择与文件操作

- Space：切换当前文件选择状态。
- v：进入 Visual 选择模式；V：退出或取消。
- Ctrl+a：全选；Ctrl+r：反选。
- y：复制；x：剪切；p：粘贴；P：覆盖粘贴。
- Y / X：取消复制 / 剪切状态。
- d：移入回收站；D：永久删除。
- r：重命名；a：新建文件，名称以 / 结尾表示目录。
- .：切换隐藏文件显示。

## 查找、预览与任务
- /：按名称查找；?：反向查找；n：下一个匹配。
- S：按内容搜索，调用 ripgrep。
- z：使用 fzf 在当前目录递归模糊跳转。
- Z：使用 zoxide 按历史频率跳转目录。
- J / K：预览区向下 / 向上翻 5 行。
- w：任务管理器。
- ~：帮助面板，按当前上下文显示可用键位。
- q：退出；Q：退出且不输出 cwd-file。

## 路径复制（按 c 后再按第二个键）

| 组合 | 结果 |
|---|---|
| c，然后 c | 完整绝对路径 |
| c，然后 d | 目录路径 |
| c，然后 f | 文件名 |
| c，然后 n | 不带扩展名的文件名 |

## 本机插件快捷键

| 按键 | 插件 | 功能 |
|---|---|---|
| c，然后 m | chmod | 修改选中文件权限 |
| T | toggle-pane | 最大化 / 恢复 Yazi 预览 Pane |
| + | zoom | 放大当前图片 |
| - | zoom | 缩小当前图片 |
| ,, | video-grid | tmux 缩放后的内部强制刷新，不作为日常操作键 |

注意：Yazi 的 T 最大化的是 Yazi 内部预览 Pane；tmux 的 Prefix + z 最大化的是 tmux Pane，两者不是同一层。

## 本机 Enter 行为

| 文件 | Enter 行为 |
|---|---|
| GIF | 右侧窗格完整动画预览；Enter 仍按普通打开规则处理 |
| 视频 | 右侧显示 3×3 静态九宫格；Enter 使用 VLC 播放原视频 |
| Markdown | md-read-hd 高清阅读器（Chrome App 窗口） |
| HTML | Google Chrome 新窗口 |
| 常见源码 / JSON | batcat 只读分页 |
| 其他文件 | Yazi 内置默认规则 |

视频九宫格是静态缩略图，不在预览窗格播放视频；VLC 独立播放原视频并正常输出声音。GIF 动画直接使用原始 GIF 文件和当前 X11 / ueberzugpp 图像后端。

## md-read-hd 阅读器操作
- 点击文中 Markdown 链接：在同一阅读窗口跳转，并写入阅读历史。
- 顶部“← 后退 / 前进 →”按钮：浏览阅读历史；不可用时按钮自动禁用。
- Alt + ←：后退；Alt + →：前进；Backspace：后退。
- 后退后打开新文档：清除当前位置之后的前进历史，和浏览器行为一致。
- 点击图片：单独打开原图。
- q 或 Ctrl+w：关闭阅读窗口，返回 Yazi。

## 终端内 fzf 示例

~~~bash
fd | fzf
fd -t f | fzf --preview 'batcat --color=always {}'
git branch -a | fzf
git log --oneline | fzf --preview 'git show --stat --color {1}'
~~~

当前没有启用 fzf 的 Zsh Shell 集成，因此 Ctrl+r / Ctrl+t / Alt+c 不是 fzf 的快捷键。

> Yazi 按键会受当前模式和焦点影响。遇到冲突时，以本机帮助面板（~）和 ~/.config/yazi/keymap.toml 为准。
