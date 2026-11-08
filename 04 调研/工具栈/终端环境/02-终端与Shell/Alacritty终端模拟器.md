---
title: Alacritty 终端模拟器配置
updated: 2026-11-08
tags: [alacritty, terminal, x11]
---

# Alacritty 终端模拟器

## 当前状态

| 项目 | 当前值 |
|---|---|
| 版本 | 0.17.0 |
| 当前 PATH 命中 | /home/duan/.cargo/bin/alacritty |
| 安装方式 | Cargo / Rustup 工具链 |
| 配置文件 | ~/.config/alacritty/alacritty.toml |
| APT 旧版本 | 0.13.2-1ubuntu1，仍安装但不是默认启动版本 |
| 桌面启动器 | ~/.local/share/applications/Alacritty.desktop |

## GNOME 默认终端入口

GNOME 的 Ctrl + Alt + T 已切换为直接启动 Cargo 版本。

当前设置：
- org.gnome.desktop.default-applications.terminal.exec = /home/duan/.cargo/bin/alacritty
- exec-arg = -e
- 用户级 Desktop Entry 的 Exec 同样指向 /home/duan/.cargo/bin/alacritty。

2026-11-08 已实际触发 Ctrl + Alt + T，并检查新进程的 /proc/PID/exe，确认指向 /home/duan/.cargo/bin/alacritty，版本为 0.17.0。

修改入口的命令：

~~~bash
gsettings set org.gnome.desktop.default-applications.terminal.exec '/home/duan/.cargo/bin/alacritty'
gsettings get org.gnome.desktop.default-applications.terminal.exec
~~~

已打开的旧窗口不会因为修改默认启动入口而升级；只有新启动的窗口会使用新版本。

## 当前配置摘要

配置文件：~/.config/alacritty/alacritty.toml

| 配置项 | 当前值 |
|---|---|
| 普通 / 粗体 / 斜体字体 | FiraCode Nerd Font |
| 字号 | 12.0 |
| 窗口透明度 | 0.95 |
| 窗口内边距 | x=8、y=8 |
| 初始尺寸 | 140 列 × 40 行 |
| 标题 | dynamic_title = true |
| 滚动历史 | 100000 行 |
| 光标 | Beam，关闭闪烁 |
| 输入时鼠标 | 自动隐藏 |
| 选中复制 | save_to_clipboard = true |

## 自定义快捷键

| 按键 | 行为 |
|---|---|
| Ctrl + Insert | 复制 |
| Shift + Insert | 粘贴 |
| Shift + Enter | 发送 ESC + CR，供支持该输入方式的 CLI 使用 |

Shift + Enter 是特意保留的输入行为。更换终端时必须重新测试多行输入、换行和提交行为。

## 字体

- 主字体：FiraCode Nerd Font。
- 系统可匹配：FiraCode Nerd Font、Fira Code Retina、Noto Sans Mono CJK SC。
- 中文字符依赖系统字体回退。

核验：

~~~bash
fc-match "FiraCode Nerd Font"
~~~

## 图片预览与终端协议

当前 Yazi 在 Alacritty + tmux + X11 环境中的实际适配器为 X11 / ueberzugpp。

- ueberzugpp 在终端窗口上方创建独立的 X11 透明叠加窗口。
- 它依赖本地 X11 Display；普通无图形 SSH 会话不能直接复用这条本地叠加链路。
- Chafa 是字符块渲染后备方案，不等同于像素级图片显示。
- resvg 用于 SVG 渲染。
- tmux 透传配置见 [tmux配置与工作区](../03-%E7%BB%88%E7%AB%AF%E5%A4%8D%E7%94%A8/tmux%E9%85%8D%E7%BD%AE%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA.md)。
- Yazi 的完整图片 / GIF / 视频链路见 [Yazi媒体预览](../04-%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E5%99%A8/Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md)。

更换终端时不能只看产品是否宣称支持某种图像协议。必须在实际 tmux 环境里运行 Yazi 并核验适配器、滚动、缩放和图片重绘。

## 安装来源与版本并存

Cargo 版本由 Rustup 管理，位于 ~/.cargo/bin；APT 版 0.13.2 仍留在 /usr/bin。

这两套程序并存不代表正在运行的窗口会自动切换。命令行版本与已打开窗口版本是两件事：

~~~bash
command -v alacritty
type -a alacritty
alacritty --version

# 对正在运行的 GUI 窗口，先找到 PID，再检查实际 executable
pgrep -a -x alacritty
readlink /proc/PID/exe
/proc/PID/exe --version
~~~

不要用当前 Shell 的 PPID 直接推断终端进程；在 tmux、子 Shell 等场景中，父进程可能是 tmux 或其他程序。

APT 旧版是否卸载属于单独的维护决策，当前没有卸载。
