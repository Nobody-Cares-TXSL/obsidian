# [使用唯一标识码替换员工ID](https://leetcode.cn/problems/replace-employee-id-with-the-unique-identifier/)

## 题目

表: `Employees`

| Column Name | Type    |
|-------------|---------|
| id          | int     |
| name        | varchar |

在 SQL 中，id 是这张表的主键。
这张表的每一行分别代表了某公司其中一位员工的名字和 ID。

表: `EmployeeUNI`

| Column Name | Type |
|-------------|------|
| id          | int  |
| unique_id   | int  |

在 SQL 中，(id, unique_id) 是这张表的主键。
这张表的每一行包含了该公司某位员工的 ID 和他的唯一标识码（unique ID）。

展示每位用户的**唯一标识码（unique ID）**；如果某位员工没有唯一标识码，使用 null 填充即可。

你可以以**任意**顺序返回结果表。

## 题解

> 使用 LEFT JOIN 以 Employees 为主表关联 EmployeeUNI，没有匹配记录时 unique_id 自动为 null

```sql
SELECT ei.unique_id, es.name
FROM Employees es LEFT JOIN EmployeeUNI ei
on es.id = ei.id;
```

---

## SQL 流程

### 原始表

Employees 表（左表）AS es

| id | name     |
|----|----------|
| 1  | Alice    |
| 7  | Bob      |
| 11 | Meir     |
| 90 | Winston  |
| 3  | Jonathan |

EmployeeUNI 表（右表） AS ei

| id | unique_id |
|----|-----------|
| 3  | 1         |
| 11 | 2         |
| 90 | 3         |

### LEFT JOIN ON id（左表为主，右表无匹配填 NULL）

| es.id | es.name   | ei.id | ei.unique_id |
|------|----------|------|-------------|
| 1    | Alice    | NULL | NULL        |
| 7    | Bob      | NULL | NULL        |
| 11   | Meir     | 11   | 2           |
| 90   | Winston  | 90   | 3           |
| 3    | Jonathan | 3    | 1           |

> Alice（id=1）和 Bob（id=7）在 EmployeeUNI 中没有对应记录，LEFT JOIN 保留左表所有行，所以 ei.unique_id 为 NULL。如果用 INNER JOIN，这两行会被丢弃。

### SELECT ei.unique_id, es.name

| ei.unique_id | es.name     |
|-----------|----------|
| null      | Alice    |
| null      | Bob      |
| 2         | Meir     |
| 3         | Winston  |
| 1         | Jonathan |

---

## 关键要点

**LEFT JOIN vs INNER JOIN**

- `LEFT JOIN`：保留左表所有行，右表无匹配时填充 null — 适合"主表数据不能丢"的场景
- `INNER JOIN`：只保留两表都匹配的行 — 本题用 INNER JOIN 会丢失 Alice 和 Bob

**JOIN 类型选择口诀**：要保留左表全部 → LEFT JOIN，要保留右表全部 → RIGHT JOIN，两边都保留 → FULL JOIN
