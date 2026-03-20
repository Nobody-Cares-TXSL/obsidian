# Restful API设计

**REST** = REpresentational State Transfer（表现层状态转移）

## 什么是 RESTful API

RESTful API 也叫 REST API，是一种符合 REST 架构风格的 API 设计规范。

```
RESTful API = HTTP 方法 + URL 资源 + HTTP 状态码
```

## RESTful API 规范

### HTTP 方法

| 方法 | 说明 | 幂等性 |
|------|------|--------|
| `GET` | 获取资源 | ✓ |
| `POST` | 创建新资源 | ✗ |
| `PUT` | 更新资源（全量替换） | ✓ |
| `PATCH` | 更新资源（部分更新） | ✗ |
| `DELETE` | 删除资源 | ✓ |

> **幂等性**：多次执行相同操作，结果保持不变。

### URL 路径设计

1. **使用名词复数**：`/users` 而非 `/user` 或 `/getUsers`
2. **使用小写字母**：推荐 `/user-profiles` 而非 `/UserProfiles`
3. **使用连字符**：推荐 `/user-profiles` 而非 `/user_profiles`
4. **版本化 API**：如 `/api/v1/users`
5. **避免动词**：资源本身代表名词，HTTP 方法代表动作

**示例对比**：

| ❌ 不推荐 | ✓ 推荐 |
|---------|--------|
| `/getUsers` | `GET /users` |
| `/createUser` | `POST /users` |
| `/updateUser` | `PUT /users/{id}` |
| `/deleteUser` | `DELETE /users/{id}` |

### 过滤与分页

使用 URL 参数进行过滤、排序和分页。

**示例**：

```bash
# 分页查询
GET /users?page=1&size=10

# 条件过滤
GET /users?status=active&role=admin

# 排序
GET /users?sort=createdAt:desc

# 组合使用
GET /users?page=1&size=10&status=active&sort=name:asc
```

**常用参数**：

| 参数 | 说明 |
|------|------|
| `page` | 页码 |
| `size` / `limit` | 每页数量 |
| `sort` | 排序字段（可加 `:asc` 或 `:desc`） |
| `filter` / `search` | 搜索关键词 |

### HTTP 状态码

| **2xx 成功** | **3xx 重定向** | **4xx 客户端错误** | **5xx 服务器错误** |
|:------------:|:--------------:|:-----------------:|:-----------------:|
| 200 OK 成功 | 301 永久重定向 | 400 错误请求 | 500 服务器错误 |
| 201 Created 创建 | 304 资源未修改 | 401 未授权 | 502 网关错误 |
| 204 No Content 无内容 | | 403 禁止访问 | 503 服务不可用 |
| | | 404 未找到 | 504 网关超时 |
| | | 405 请求方法不对 | |
| | | 409 资源冲突 | |
| | | 422 请求格式正确但语义错误 | |
| | | 429 请求过多 | |

## HATEOAS

> **Hypermedia as the Engine of Application State**（超媒体作为应用状态引擎）

### 核心思想

客户端只需要知道一个入口 URL，后续所有可做的操作、能去的状态，都由服务器在响应里用"链接"等超媒体控制动态告诉客户端。

### 对比示例

#### ❌ 没有 HATEOAS

```json
{
  "id": "123",
  "status": "pending",
  "amount": 99.00
}
```

> 问题：客户端需要硬编码 URL（如 `POST /orders/123/pay`）

#### ✓ 有 HATEOAS

```json
{
  "id": "123",
  "status": "pending",
  "amount": 99.00,
  "_links": {
    "self": { "href": "/orders/123" },
    "payment": { "href": "/orders/123/pay", "method": "POST" },
    "cancel": { "href": "/orders/123/cancel", "method": "POST" }
  }
}
```

> 优势：服务器可动态调整 API 结构，客户端自动适应
