# SSO 单点登录

**SSO** = Single Sign On

## 什么是 SSO

SSO 是在多个应用系统中，用户只需要登录一次就可以访问所有相互信任的应用系统。

```
SSO = 一次登录，处处通行
```

### 好处

| 角度 | 好处 |
|------|------|
| **用户** | 一次登录多次使用，无需记录多套账号密码 |
| **管理员** | 只需维护一个统一的账号中心 |
| **新系统** | 直接对接统一账号中心，简化开发 |

## SSO 系统设计

### 核心模块

| 模块 | 说明 |
|------|------|
| **前台站点** | 需要登录的站点 |
| **SSO 站点** | 提供登录/登出页面 |
| **SSO 服务** | 提供登录/校验/登出服务 |
| **数据库** | 存储用户账户信息 |
| **缓存** | 存储用户登录信息（Redis） |

### 登录状态存储

| 对象 | 说明 |
|------|------|
| **AuthToken** | UUID/GUID，存于客户端 Cookie |
| **登录信息** | UserId、UserName，存于 Redis |

> 💡 **推荐**：使用 Redis 集群存储登录信息，支持高可用和水平扩展。

## 同域登录流程

### 登录

```mermaid
sequenceDiagram
    participant User as 用户
    participant Site as 前台站点
    participant SSO as SSO 服务
    participant Redis as Redis
    participant DB as 数据库

    User->>Site: 1. 访问需要登录的页面
    Site-->>User: 2. 302 重定向到 SSO（带 returnUrl）
    User->>SSO: 3. 访问 SSO 登录页
    SSO->>Redis: 4. 查询 Cookie 中的 AuthToken
    Redis-->>SSO: 5. 未登录
    SSO-->>User: 6. 显示登录表单
    User->>SSO: 7. 提交用户名密码
    SSO->>DB: 8. 验证用户信息
    DB-->>SSO: 9. 验证成功
    SSO->>Redis: 10. 存储登录信息（生成 AuthToken）
    SSO-->>User: 11. 设置 Cookie（domain=.test.com）
    SSO-->>User: 12. 302 重定向到 Site（带 AuthToken）
    User->>Site: 13. 访问原页面（带 AuthToken）
    Site->>SSO: 14. 校验 AuthToken
    SSO->>Redis: 15. 查询登录信息
    Redis-->>SSO: 16. 返回用户信息
    SSO-->>Site: 17. 校验成功，返回用户信息
    Site-->>User: 18. 显示页面内容
```

### 登录状态校验

```mermaid
sequenceDiagram
    participant Site as 前台站点
    participant SSO as SSO 服务
    participant Redis as Redis

    Site->>SSO: 1. 校验 AuthToken
    SSO->>Redis: 2. 查询登录信息
    Redis-->>SSO: 3. 返回结果

    opt Token 有效
        SSO-->>Site: 4. 返回校验成功 + 用户信息
    end

    opt Token 无效/过期
        SSO-->>Site: 4. 返回校验失败
    end
```

### 登出

```mermaid
sequenceDiagram
    participant User as 用户
    participant Site as 前台站点
    participant SSO as SSO 服务
    participant Redis as Redis

    User->>Site: 1. 点击登出
    Site->>SSO: 2. 调用登出接口（带 AuthToken）
    SSO->>Redis: 3. 删除登录信息
    Redis-->>SSO: 4. 删除成功
    SSO-->>Site: 5. 返回登出成功
    Site-->>User: 6. 清除 Cookie，跳转首页
```

## 跨域登录流程

### 核心思路

Cookie 跨域无法直接共享，通过**回调**方式传递 AuthToken：

| 场景 | 解决方案 |
|------|----------|
| **跨域登录** | 登录完成后回调，将 AuthToken 传递给其他域，各域自行存储 |
| **跨域登出** | 登出完成后回调，调用其他域的登出接口 |

### 跨域登录（主域名已登录）

> 假设：用户已在站点 A（a.com）登录，现在访问站点 B（b.com）

```mermaid
sequenceDiagram
    participant User as 用户
    participant SiteB as 站点B (b.com)
    participant SSO as SSO 系统 (sso.com)
    participant SiteA as 站点A (a.com)

    User->>SiteB: 1. 访问站点 B
    SiteB-->>User: 2. 302 重定向到 SSO（带 returnUrl=b.com）
    User->>SSO: 3. 访问 SSO（带 a.com 的 Cookie）
    SSO->>SSO: 4. 验证 a.com 的 AuthToken（有效）
    Note over SSO: 用户已在 a.com 登录
    SSO-->>User: 5. 302 重定向到 a.com/callback（带 redirect=b.com）
    User->>SiteA: 6. 访问 a.com/callback
    SiteA-->>SSO: 7. 返回 AuthToken（通过 URL 参数或 postMessage）
    SSO-->>User: 8. 302 重定向到 b.com/callback（带 AuthToken）
    User->>SiteB: 9. 访问 b.com/callback
    SiteB->>SiteB: 10. 存储 AuthToken 到 Cookie
    SiteB-->>User: 11. 跳转到原页面，登录成功
```

### 跨域登录（主域名未登录）

流程与同域登录类似，登录完成后：
1. SSO 通过回调将 AuthToken 传递给各站点
2. 各站点收到后自行存储到本地 Cookie

### 跨域登出

```mermaid
sequenceDiagram
    participant User as 用户
    participant Site as 当前站点
    participant SSO as SSO 系统
    participant SiteA as 站点A
    participant SiteB as 站点B

    User->>Site: 1. 点击登出
    Site->>SSO: 2. 调用全局登出接口
    par 并行通知所有站点
        SSO->>SiteA: 3a. 回调 /sso/logout（清除 Cookie）
        SSO->>SiteB: 3b. 回调 /sso/logout（清除 Cookie）
    end
    SSO->>SSO: 4. 删除 Redis 登录信息
    Note over SSO,SiteB: 即使部分站点失败，中心登录状态也已清除
    SSO-->>Site: 5. 返回登出成功
    Site-->>User: 6. 清除本地 Cookie，跳转首页
```

## 技术要点

| 要点 | 说明 |
|------|------|
| **Cookie Domain** | 设置为主域名（如 `.test.com`）实现同域共享 |
| **AuthToken** | 使用 UUID/GUID，或加密 UserName+时间戳 |
| **存储** | Redis 集群，支持高可用和水平扩展 |
| **安全性** | APP 访问需增加签名验证 |
| **跨域方案** | 回调方式传递 Token，各域自行存储 |
| **重定向** | 使用 HTTP 302 状态码，携带回调地址 |

## SSO vs OAuth

| 对比维度 | SSO | OAuth 2.0 |
|----------|-----|-----------|
| **用途** | 同一系统多应用统一登录 | 第三方授权登录 |
| **场景** | 企业内部系统多应用 | 微信登录、Google 登录 |
| **用户体系** | 统一用户体系 | 不同系统用户体系 |
| **关系** | 可结合使用 | 可用 JWT 作为 Token |

## 参考资料

- [JavaGuide - SSO 单点登录详解](https://javaguide.cn/system-design/security/sso-intro.html)
- [ken.io - SSO 设计与实现](https://ken.io/note/sso-design-implement)
