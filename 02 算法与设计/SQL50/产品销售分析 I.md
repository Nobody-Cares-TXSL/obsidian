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

---

## SQL 流程

### 原始表

Sales 表（左表）

| sale_id | product_id | year | quantity | price |
|---------|------------|------|----------|-------|
| 1       | 100        | 2008 | 10       | 5000  |
| 2       | 100        | 2009 | 12       | 5000  |
| 7       | 200        | 2011 | 15       | 9000  |

Product 表（右表）

| product_id | product_name |
|------------|--------------|
| 100        | Nokia        |
| 200        | Apple        |
| 300        | Samsung      |

### LEFT JOIN ON product_id（以 Sales 为主，补充产品名）

| S.sale_id | S.product_id | S.year | S.price | P.product_id | P.product_name |
|-----------|--------------|--------|---------|--------------|----------------|
| 1         | 100          | 2008   | 5000    | 100          | Nokia          |
| 2         | 100          | 2009   | 5000    | 100          | Nokia          |
| 7         | 200          | 2011   | 9000    | 200          | Apple          |

> Sales 中所有 product_id 在 Product 中都有匹配，所以没有 NULL 行。Samsung（product_id=300）因为没有销售记录，不会出现在结果中。

### SELECT product_name, year, price

| product_name | year | price |
|--------------|------|-------|
| Nokia        | 2008 | 5000  |
| Nokia        | 2009 | 5000  |
| Apple        | 2011 | 9000  |

---

## 关键要点

> **JOIN** 用于关联两张表，`ON` 指定关联条件。核心区别在于对**不匹配行**的处理方式。
