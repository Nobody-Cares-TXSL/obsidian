# JWT

**JWT** = JSON Web Token

## 什么是 JWT

JWT 是目前最流行的跨域认证解决方案，是一种基于 Token 的认证授权机制。

```
JWT = JSON 格式的规范化 Token
```

### 核心特点

| 特点 | 说明 |
|------|------|
| **无状态** | 自包含所有验证信息，服务端无需存储 |
| **防 CSRF** | 存储在 localStorage，不涉及 Cookie |
| **跨语言** | 标准 JSON 格式，各语言通用 |
| **适合移动端** | 不依赖 Cookie |
| **单点登录友好** | 存在客户端，无跨域问题 |

## JWT 组成

JWT 本质是一组字符串，通过 `.` 分隔三部分：

```
xxxxx.yyyyy.zzzzz
 Header.Payload.Signature
```

### Header（头部）

定义签名算法和 Token 类型。

```json
{
  "alg": "HS256",  // 签名算法
  "typ": "JWT"     // 令牌类型
}
```

### Payload（载荷）

存放实际需要传递的数据，包含声明（Claims）。

| 字段 | 全称 | 说明 |
|------|------|------|
| `iss` | Issuer | JWT 签发方 |
| `sub` | Subject | JWT 主题（用户 ID） |
| `aud` | Audience | JWT 接收方 |
| `exp` | Expiration | 过期时间 |
| `iat` | Issued At | 签发时间 |
| `jti` | JWT ID | 唯一标识 |

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "exp": 1732323232,
  "iat": 1516239022
}
```

> ⚠️ **安全警告**：Payload 默认不加密，绝对不要存放隐私信息！

### Signature（签名）

对前两部分的签名，防止 JWT 被篡改。

```
签名 = HMACSHA256( base64UrlEncode(Header) + "." + base64UrlEncode(Payload), Secret )
```

**验证原理**：服务端以 Secret 为密钥，用签名算法对 Header.Payload 重新计算签名，对比 JWT 中的 Signature。

> 💡 **关键**：只要 Secret 不泄露，JWT 就无法被伪造。

### 完整示例

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.          // Header
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  // Signature
```

## JWT 身份验证流程

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant Server as 服务端

    Client->>Server: 1. 登录请求（用户名+密码）
    Server->>Server: 2. 验证凭据
    Server->>Server: 3. 计算签名并生成 JWT
    Server->>Client: 4. 返回 JWT
    Client->>Client: 5. 存储 JWT（localStorage）
    Client->>Server: 6. 携带 JWT 请求资源
    Server->>Server: 7. 验证 JWT 签名
    Server->>Client: 8. 返回资源数据
```

### 请求头格式

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## JWT vs Session

| 对比维度 | Session | JWT | 推荐 |
|----------|---------|-----|------|
| 存储位置 | 服务端 | 客户端 | 服务器资源紧张选 JWT |
| 状态 | 有状态 | 无状态 | 分布式选 JWT |
| 分布式 | 需要共享 Session | 天然支持 | 分布式选 JWT |
| 安全性 | CSRF 风险 | XSS 风险 | 看防护能力 |
| 可控性 | 立即失效 | 无法主动失效 | 需要强控制选 Session |
| 移动端 | 依赖 Cookie | 天然支持 | 移动端选 JWT |

## 安全要点

| 类别 | 要点 |
|------|------|
| **存储** | localStorage（需防 XSS） > Memory > Cookie |
| **内容** | 不存隐私、必须设置 exp、精简 Payload |
| **密钥** | 足够复杂、定期更换、环境变量管理 |
| **传输** | 使用 HTTPS、验证签发方（iss） |
| **XSS 防护** | 输入过滤、输出转义、CSP 策略 |

## 优缺点分析

### 优势

| 优势 | 说明 |
|------|------|
| 无状态 | 服务端无需存储，减轻压力 |
| 防 CSRF | 不依赖 Cookie |
| 跨语言 | 标准 JSON 格式 |
| 适合移动端 | 不依赖 Cookie |
| 单点登录友好 | 无跨域问题 |

### 劣势

| 劣势 | 说明 |
|------|------|
| 不可控 | 有效期内无法主动失效 |
| 续签复杂 | 需要额外方案 |
| 体积较大 | Base64 编码 + 三段式 |
| Payload 可见 | 不宜存放敏感信息 |

## 常见问题

### Q1: 注销登录后 JWT 仍然有效？

| 解决方案 | 优点 | 缺点 |
|----------|------|------|
| **Redis 黑名单** ✓ | 简单直接 | 违背无状态 |
| Redis 白名单 | 控制精确 | 违背无状态 |
| 用户密钥 | 无需额外存储 | 多端冲突 |
| 短期有效 | 降低风险 | 体验差 |
| 密码哈希签名 | 改密即失效 | 需重新设计 |

### Q2: JWT 如何续签？

| 方案 | 评价 |
|------|------|
| 快过期时更新 | 体验差 |
| 每次返回新 JWT | 开销大 |
| **双 Token 机制** ✓ | **推荐** |

**双 Token**：accessJWT（30 分钟，访问 API）+ refreshJWT（1 天，获取 accessJWT）。客户端定时提前刷新。

### Q3: JWT 体积太大？

| 方案 | 说明 |
|------|------|
| 精简 Payload | 只保留必要字段 |
| 压缩传输 | 使用 GZIP |
| 普通 Token + Redis | Token = ID，信息存服务端 |

## 总结与选型

> JWT 不是银弹，具体选择要看项目需求。

| 场景 | 推荐方案 |
|------|----------|
| 传统单体应用 | Session |
| 分布式/微服务 | JWT + Redis 黑名单 |
| 移动端 App | JWT |
| 需要强控制 | Session / Token + Redis |
| 单点登录 | JWT |

## JWT vs OAuth 2.0

| | JWT | OAuth 2.0 |
|--|-----|-----------|
| 定义 | Token 格式 | 授权框架 |
| 关系 | OAuth 可用 JWT 作为 Token | JWT 可用于 OAuth |
| 用途 | 认证 + 信息传递 | 授权（第三方登录） |

## 参考资料

- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
- [jwt.io - JWT 调试工具](https://jwt.io/)
- [JavaGuide - JWT 基础概念详解](https://javaguide.cn/system-design/security/jwt-intro.html)
- [JavaGuide - JWT 身份认证优缺点分析](https://javaguide.cn/system-design/security/advantages-and-disadvantages-of-jwt.html)
