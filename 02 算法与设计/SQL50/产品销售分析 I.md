# [产品销售分析 I](https://leetcode.cn/problems/product-sales-analysis-i/)

## 题目

表：`Sales`

| Column Name | Type    |
|-------------|---------|
| sale_id     | int     |
| product_id  | int     |
| year        | int     |
| quantity    | int     |
| price       | int     |

`(sale_id, year)` 是 `Sales` 表的主键（具有唯一值的列的组合）。
`product_id` 是关联到 `Product` 表的外键（reference 列）。
该表的每一行显示 `product_id` 在某一年的销售情况。
`price` 表示每单位价格。

表：`Product`

| Column Name  | Type    |
|--------------|---------|
| product_id   | int     |
| product_name | varchar |

`product_id` 是 `Product` 表的主键（具有唯一值的列）。
该表的每一行表示每种产品的产品名称。

编写解决方案，以获取 `Sales` 表中所有 `sale_id` 对应的 `product_name` 以及该产品的所有 `year` 和 `price`。

返回结果表**无顺序要求**。

## 题解

> 通过 `product_id` 关联两张表，从 `Sales` 取 `year` 和 `price`，从 `Product` 取 `product_name`。

```sql
SELECT
	Product.product_name, Sales.year, Sales.price
FROM Sales LEFT JOIN Product
ON Sales.product_id = Product.product_id;
```

## 关键要点

> **JOIN** 用于关联两张表，`ON` 指定关联条件。核心区别在于对**不匹配行**的处理方式。

### 三种 JOIN 对比

以本题 `Sales`（左表）和 `Product`（右表）为例，假设 Sales 中有一条 product_id=400 的记录，但 Product 表中不存在该产品：

| JOIN 类型 | 匹配的行 | Sales 无匹配的 product_id=400 | Product 无对应 Sales 的 product_id=300 |
|-----------|---------|------|------|
| **INNER JOIN** | 保留 | 丢弃 | 丢弃 |
| **LEFT JOIN** | 保留 | 保留（右表列填 NULL） | 丢弃 |
| **RIGHT JOIN** | 保留 | 丢弃 | 保留（左表列填 NULL） |

```sql
-- INNER JOIN：只返回两表都能匹配上的行
SELECT p.product_name, s.year, s.price
FROM Sales s
JOIN Product p ON s.product_id = p.product_id;

-- LEFT JOIN：保留左表（Sales）所有行，右表无匹配则填 NULL
SELECT p.product_name, s.year, s.price
FROM Sales s
LEFT JOIN Product p ON s.product_id = p.product_id;
-- 若 Sales 有 product_id=400 但 Product 没有，结果中 product_name=NULL

-- RIGHT JOIN：保留右表（Product）所有行，左表无匹配则填 NULL
SELECT p.product_name, s.year, s.price
FROM Sales s
RIGHT JOIN Product p ON s.product_id = p.product_id;
-- 若 Product 有 product_id=300 但 Sales 没有对应记录，结果中 year=NULL, price=NULL
```

### 使用场景

- **INNER JOIN**：只需要**两边都有的数据**。例：查有销售记录的产品
- **LEFT JOIN**：以左表为主，补充右表信息。例：查所有销售记录对应的产品名（产品被删除的记录也不丢）— **实际开发中最常用，推荐默认使用**
- **RIGHT JOIN**：以右表为主，补充左表信息。例：查所有产品中哪些有销售记录（没卖过的产品也列出）。等同于把表换个位置写 `LEFT JOIN`

> **实用建议**：日常开发优先用 `LEFT JOIN`，需要严格匹配时用 `INNER JOIN`，`RIGHT JOIN` 很少用（换个表顺序就能用 LEFT JOIN 替代）
