---
title: Yazi 媒体预览与刷新链路
updated: 2026-11-08
tags: [yazi, gif, video, ffmpeg, ueberzugpp]
---

# Yazi 媒体预览与刷新链路

> Yazi 版本：26.9.1
> 主配置：[Yazi基础配置](./Yazi%E5%9F%BA%E7%A1%80%E9%85%8D%E7%BD%AE.md)
> 快捷键：[yazi快捷键速查表](./yazi%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%80%9F%E6%9F%A5%E8%A1%A8.md)
> tmux 配置：[tmux配置与工作区](../03-%E7%BB%88%E7%AB%AF%E5%A4%8D%E7%94%A8/tmux%E9%85%8D%E7%BD%AE%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8C%BA.md)

## 当前图像渲染链路

当前实际链路：
Yazi → X11 image adapter → ueberzugpp → X11 叠加窗口。

- ueberzugpp 2.9.11：/usr/bin/ueberzugpp，APT 第三方 OBS 源。
- Chafa 1.14.0：字符块渲染后备，不等同于像素级图片显示。
- resvg 0.49.0：~/.local/bin/resvg，用于 SVG 渲染。
- 依赖 X11 会话和可用 DISPLAY。

ueberzugpp 不直接在终端字符网格内绘制图片，而是在终端窗口上方创建透明 X11 窗口。当前不是 Kitty Graphics、Sixel 或 iTerm2 Inline Images 原生图像协议链路。

## GIF：完整原始动画

插件：~/.config/yazi/plugins/gif-preview.yazi/main.lua

- 直接将原始 GIF 路径交给 ya.image_show()。
- 不经过静态图片 precache，不转码、不裁剪帧数。
- 动画显示依赖当前 X11 / ueberzugpp 后端。
- 不启动额外播放器或后台守护进程。
- image/gif 的默认 preloader 设为 noop，避免 Yazi 默认预加载器只生成静态首帧。

此前通过连续帧像素差异验证过 GIF 确实在变化，而不是静态首帧。

## 视频：Video Grid

插件：~/.config/yazi/plugins/video-grid.yazi/main.lua

右侧预览显示 3 列 × 3 行、共 9 帧的静态联系表：
- ffprobe 读取视频时长。
- FFmpeg 在 0%、约 11%、22%……约 89% 的时间点分别 seek 并抽帧。
- 每个缩略图约 320×180，单格标注 HH:MM:SS 时间戳。
- 生成 PNG 联系表，缓存到 Yazi cache。
- 缓存签名包含源文件修改时间和大小；源视频变化后生成新缓存。
- 预览过程不启动播放器，不播放声音。

首次生成需要抽取 9 帧；此前 20 秒 1080p 测试视频生成耗时约 3.88 秒。缓存命中后直接显示。

## Enter：VLC 播放

yazi.toml 将 video/* 的打开规则优先交给 VLC：
- 命令：vlc --started-from-file。
- orphan = true，VLC 独立于 Yazi 运行。
- Enter 打开原视频并正常播放声音。
- 右侧 Video Grid 始终是静态九宫格，不在后台持续播放视频。

## tmux 缩放后的预览刷新

tmux Prefix + z 放大 / 还原 Pane 会改变 Yazi 可用区域。Yazi 可能已重排布局，但因为文件没有变化而跳过当前预览重绘。

当前修复链路：
1. ~/.tmux.conf 在 Prefix + z 后执行 resize-pane -Z。
2. 如果当前 Pane 的前台命令是 yazi，则延迟 750ms。
3. tmux 向该 Pane 发送内部组合键 ,,。
4. ~/.config/yazi/keymap.toml 将 ,, 绑定到 plugin video-grid。
5. video-grid 插件入口使用 ya.emit("peek", { force = true }) 强制刷新当前预览。

2026-11-08 已通过连续放大 / 还原验收。此前尝试的 ya.mgr_emit 已不适用于当前 Yazi 版本，不能恢复旧调用。

## 依赖清单

| 用途 | 程序 | 版本 |
|---|---|---|
| 图片叠加 | ueberzugpp | 2.9.11 |
| 字符块后备 | chafa | 1.14.0 |
| SVG | resvg | 0.49.0 |
| 视频元信息 / 抽帧 | ffprobe / FFmpeg | 6.1.1 |
| 视频播放 | VLC | 3.0.20 |
| 文件类型识别 | file | 5.45 |
| 图片 / 视频依赖诊断 | ya env | Yazi 26.9.1 |

其他预览依赖：fzf 0.74.5、fd/fdfind 9.0.0、ripgrep 14.1.0、magick 6.9.12-98、jq 1.7、7z 23.01、pdftoppm 24.02.0。

## 相关实验与限制

- 当前已验证环境为 Alacritty 0.17.0 + tmux 3.4 + X11 + Yazi 26.9.1 + ueberzugpp 2.9.11 + FFmpeg 6.1.1 + VLC 3.0.20。
- 视频九宫格是静态图片，不是右侧实时播放；Enter 才启动 VLC。
- GIF 的动画由 ueberzugpp 后端处理；不代表所有终端 / 图形会话都支持同样效果。
- 当前链路验证的是 X11；Wayland 尚未验证。
- ffprobe 无法读取时长时，九宫格会显示错误，但 Enter 仍可交给 VLC 尝试播放。
- Yazi 已运行进程不会自动加载新 Lua 或配置，修改插件后需重新启动 Yazi。

## 回滚

### 回滚视频九宫格

1. 从 yazi.toml 删除 video/* 的 prepend_previewers 规则。
2. 删除 video/* 对应的 noop preloader 规则。
3. 删除 video-grid 插件目录。
4. 删除 vlc opener 和 video/* open 规则（若要恢复默认打开行为）。
5. 从 ~/.tmux.conf 删除 Prefix + z 后发送 ,, 的 Yazi 专用逻辑。
6. 从 keymap.toml 删除 ,, 绑定。

### 回滚 GIF 动画

1. 从 yazi.toml 删除 image/gif 自定义 previewer 和 noop preloader。
2. 删除 gif-preview 插件目录。

## 历史文件

- live-media.yazi.disabled-20261107-231719：旧实验插件，停用保留。
- force-peek.yazi：早期诊断插件，无快捷键绑定。
- video-grid.yazi/main.lua.bak-*：调试备份，不是运行入口。
