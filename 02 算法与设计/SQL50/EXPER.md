# SQL50 经验总结

从刷题中积累的 SQL 知识点和易错经验。

---

## NULL 的判断

> 判断 NULL 必须用 `IS NULL` / `IS NOT NULL`，**不能用** `= NULL` 或 `!= NULL`。

```sql
-- 正确
WHERE referee_id IS NULL OR referee_id != 2

-- 错误：= NULL 永远返回空结果
WHERE referee_id = NULL
```

原因：NULL 表示"未知"，任何与 NULL 的比较（=、!=、>、<）结果都是 NULL（即 falsy），只有 `IS NULL` / `IS NOT NULL` 能正确判断。

> 来源：[[寻找用户推荐人]]

---

## DISTINCT 去重

> 同一记录可能出现多次时，用 `DISTINCT` 去重。

```sql
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id
ORDER BY id;
```

- 表没有主键时（如 Views 表），可能出现重复行，`DISTINCT` 保证结果唯一
- `DISTINCT` 作用于 SELECT 后的所有列

> 来源：[[文章浏览 I]]

---

## ROUND 四舍五入

> `ROUND(number, decimals)` 对数值四舍五入保留指定位小数。

- `ROUND(0.8945, 3)` → 0.895
- `ROUND(2.5, 0)` → 3（MySQL 默认标准四舍五入）
- 不指定 decimals 时默认取整：`ROUND(3.7)` → 4

> 来源：[[每台机器的进程平均运行时间]]

---

## IF() vs CASE WHEN

> `IF()` 是 MySQL 特有函数，`CASE WHEN` 是标准 SQL 语法，跨数据库优先用后者。

| 写法 | 语法 | 兼容性 |
|------|------|--------|
| `IF(cond, a, b)` | `IF(条件, 真值, 假值)` | MySQL 独有 |
| `CASE WHEN` | `CASE WHEN cond THEN a ELSE b END` | 所有数据库 |

- 简单二选一用 `IF()` 更简洁，多条件分支用 `CASE WHEN`
- 生产环境推荐 `CASE WHEN`，保证可移植性

> 来源：[[每台机器的进程平均运行时间]]

---

## 字符串长度：CHAR_LENGTH vs LENGTH

> 计算字符数用 `CHAR_LENGTH()`，计算字节数用 `LENGTH()`。

- `CHAR_LENGTH(str)` — 返回**字符数**（推荐用于长度判断）
- `LENGTH(str)` — 返回**字节数**（包含中文等多字节字符时结果不同）
- 纯 ASCII 场景两者相同，但有中文/emoji 时会不一致

> 来源：[[无效的推文]]

---

## DATEDIFF 日期差

> `DATEDIFF(date1, date2)` 返回 `date1 - date2` 的天数，可用于比较相邻日期。

- MySQL 中 `DATEDIFF('2015-01-03', '2015-01-01')` = 2
- 只取日期部分，忽略时间
- 替代写法：`date1 = DATE_ADD(date2, INTERVAL 1 DAY)`

> 来源：[[上升的温度]]

---

## COUNT(*) vs COUNT(DISTINCT)

> `COUNT(*)` 计算所有行数，`COUNT(DISTINCT column)` 计算某列去重后的唯一值数。

- `COUNT(*)` 包含所有行（含 NULL 行）
- `COUNT(DISTINCT column)` 先去重再计数，忽略 NULL
- 当"每组固定行数"的前提可能被打破时（如数据缺失），`COUNT(DISTINCT)` 更安全

> 来源：[[每台机器的进程平均运行时间]]

---

## 条件聚合（Conditional Aggregation）

> 在聚合函数（SUM、AVG、COUNT）内嵌套条件判断，实现"按条件筛选后再聚合"，避免写子查询或 JOIN。

```sql
-- 模式
SUM(IF(条件, 值, 0))
SUM(CASE WHEN 条件 THEN 值 ELSE 0 END)
AVG(CASE WHEN 条件 THEN 值 END)  -- 不匹配返回 NULL，AVG 自动忽略
```

- 适用场景：同一列不同行代表不同含义（start/end、收入/支出），需分别处理后再聚合
- `CASE WHEN` 不匹配时返回 NULL，聚合函数自动忽略 NULL

> 来源：[[每台机器的进程平均运行时间]]

---

## JOIN 类型

> 核心区别在于对**不匹配行**的处理方式。

| JOIN 类型 | 匹配的行 | 左表无匹配 | 右表无匹配 |
|-----------|---------|-----------|-----------|
| **INNER JOIN** | 保留 | 丢弃 | 丢弃 |
| **LEFT JOIN** | 保留 | 保留（右表填 NULL） | 丢弃 |
| **RIGHT JOIN** | 保留 | 丢弃 | 保留（左表填 NULL） |

**选择口诀**：主表不能丢 → LEFT JOIN，严格匹配 → INNER JOIN，RIGHT JOIN 很少用（换个顺序就能用 LEFT JOIN 替代）

> 来源：[[产品销售分析 I]]、[[使用唯一标识码替换员工ID]]
