---
title: Zsh 与 Starship 配置
updated: 2026-11-08
tags: [zsh, oh-my-zsh, starship, shell]
---

# Zsh 与 Starship

## 当前状态

| 项目 | 当前值 |
|---|---|
| 登录 Shell | /usr/bin/zsh |
| Zsh 版本 | 5.9 |
| 主配置 | ~/.zshrc |
| 环境配置 | ~/.zshenv |
| 框架 | ~/.oh-my-zsh |
| Prompt | Starship 1.27.0 |
| Starship 配置 | ~/.config/starship.toml |
| EDITOR | vim |

Oh My Zsh 的主题设置为空，提示符交给 Starship。

## Oh My Zsh 插件

当前启用：
- git：Git 别名与补全。
- zsh-autosuggestions：历史命令建议。
- zsh-syntax-highlighting：命令语法着色。

插件目录位于 ~/.oh-my-zsh/custom/plugins。

## PATH 与目录跳转

- .zshrc 使用 typeset -U PATH path 去重，保留先出现的路径。
- zoxide 初始化方式为 zoxide init zsh --cmd cd。
- cd 被 zoxide 接管；cdi 用于交互式目录选择。
- 当前没有启用 zoxide 的 z 命令别名。

## 常用 Shell 行为

| 项目 | 当前行为 |
|---|---|
| 编辑器 | EDITOR=vim |
| cat | alias cat=batcat，仅交互式 Shell 生效 |
| y | 启动 Yazi，退出后把 Shell 当前目录切换到 Yazi 最终目录 |
| proxy-on | 设置 http_proxy、https_proxy、all_proxy 为 127.0.0.1:7890 |
| proxy-off | 清除上述三个代理变量 |
| SSH Agent | SSH_AUTH_SOCK 为空时启动 ssh-agent，并尝试加载 ~/.ssh/id_ed25519 |
| fastfetch | .zshrc 中启动语句已注释，不会每次开 Shell 自动运行 |

Shell 函数 y 的用途与 Yazi 内部的 y 复制操作不同：前者在 Shell 中启动文件管理器，后者在 Yazi 界面中复制所选文件。

## NVM 懒加载

NVM 目录：~/.nvm。当前 Node.js 为 v24.14.0。

以下入口通过代理函数延迟加载 nvm.sh：
- nvm、node、npm、npx、pnpm
- mcporter、xreach、codex、codebuddy、agent-reach

首次调用时加载成功后，代理函数会移除，再执行真实命令。这样可以减少每次启动 Zsh 时的初始化开销。

opencli 使用独立包装函数：首次运行时确保 NVM 已加载；若静态补全文件不存在，则尝试生成 Zsh 补全。

## 其他环境变量与工具路径

- ~/.local/bin 加入 PATH；Claude 环境变量 CLAUDE_CODE_NO_FLICKER=1。
- RTK_TELEMETRY_DISABLED=1。
- JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64。
- MAVEN_HOME=/opt/maven。
- JMETER_HOME=/opt/jmeter。
- BUN_INSTALL=~/.bun，并把 ~/.bun/bin 加入 PATH。
- ~/.opencode/bin 加入 PATH。
- ~/.cargo/bin 加入 PATH。
- Conda 通过 conda init 区块初始化。
- ~/.zshenv 设置 TMPDIR=~/tmp。

## Starship

配置文件：~/.config/starship.toml

当前只有两个主要超时设置：
- scan_timeout = 100 ms。
- command_timeout = 1000 ms。

没有额外启用大量提示符模块，整体保持精简。

## 已知维护事项
1. .zshrc 中 Bun 补全文件 ~/.bun/_bun 被 source 两次：一次使用 BUN_INSTALL 变量，一次使用硬编码路径。功能上重复，后续可删除其中一处。
2. Conda 初始化每次交互 Shell 启动时都会执行 conda shell.zsh hook；如要精简启动时间，应先测量，再评估懒加载。
3. SSH Agent 启动逻辑也在 Shell 初始化阶段运行，可作为启动时间优化候选。
4. .zshrc 中存在 DB_PASS 环境变量，供 Harlequin 配置读取。变量值属于敏感信息，不在文档中记录；当前做法是明文放在 Shell 启动文件，后续应迁移到权限受限的秘密文件或系统密钥管理方案。

## 常用核验

~~~bash
echo "$SHELL"
zsh --version
command -v zsh
command -v node
node --version
time zsh -i -c exit
~~~

涉及修改 .zshrc 时先备份；不要为了清理重复配置而一次性重写整份 Shell 初始化文件。
