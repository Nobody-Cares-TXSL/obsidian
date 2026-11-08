---
title: Yazi 配置与预览系统导航
updated: 2026-11-08
tags: [yazi, file-manager, index]
---

# Yazi 配置与预览系统

Yazi 相关信息拆成三份，避免主配置、媒体预览实现和快捷键混在一起。

## 文档入口

- [Yazi基础配置](./Yazi%E5%9F%BA%E7%A1%80%E9%85%8D%E7%BD%AE.md)：安装位置、配置文件、布局、打开规则、插件清单、Shell 目录联动、Markdown 阅读器。
- [Yazi媒体预览](./Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md)：X11 / ueberzugpp、完整 GIF、Video Grid、VLC、tmux 缩放刷新、依赖与回滚。
- [yazi快捷键速查表](./yazi%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%80%9F%E6%9F%A5%E8%A1%A8.md)：日常导航、文件操作、插件快捷键和 Enter 行为。

## 当前概况

| 项目 | 当前值 |
|---|---|
| Yazi / ya | 26.9.1 |
| 主程序 | /usr/local/bin/yazi |
| 配置目录 | ~/.config/yazi/ |
| 上游插件 | git、chmod、toggle-pane、zoom |
| 本机自定义插件 | gif-preview、video-grid |
| 图像后端 | X11 / ueberzugpp 2.9.11 |

## 维护原则

- 日常改快捷键，更新快捷键速查表与 keymap 相关说明。
- 改 yazi.toml 的布局、opener 或预览规则，更新 [Yazi基础配置](./Yazi%E5%9F%BA%E7%A1%80%E9%85%8D%E7%BD%AE.md)。
- 改 GIF、FFmpeg、VLC、缓存或 tmux 缩放刷新，更新 [Yazi媒体预览](./Yazi%E5%AA%92%E4%BD%93%E9%A2%84%E8%A7%88.md)。
- 恢复环境时备份整个 ~/.config/yazi/，不要只复制 yazi.toml。
