# [文章浏览 I](https://leetcode.cn/problems/article-views-i/)

## 题目
`Views` 表：

| Column Name | Type    |
|-------------|---------|
| article_id  | int     |
| author_id   | int     |
| viewer_id   | int     |
| view_date   | date    |
此表可能会存在重复行。（换句话说，在 SQL 中这个表没有主键）
此表的每一行都表示某人在某天浏览了某位作者的某篇文章。
请注意，同一人的 author_id 和 viewer_id 是相同的。

请查询出所有浏览过自己文章的作者。

结果按照作者的 `id` 升序排列。

---

## 题解

> 查询浏览过自己文章的作者，即 `author_id = viewer_id` 的记录

```sql
-- DISTINCT 去重：同一作者可能多次浏览自己的文章
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id  -- 作者和浏览者是同一人
ORDER BY id;                 -- 按作者 ID 升序排列
```

---

## SQL 流程

### 原始表

Views 表（无主键，可能有重复行）

| article_id | author_id | viewer_id | view_date  |
|------------|-----------|-----------|------------|
| 1          | 3         | 5         | 2019-08-01 |
| 1          | 3         | 6         | 2019-08-02 |
| 2          | 7         | 7         | 2019-07-22 |
| 2          | 7         | 6         | 2019-08-02 |
| 4          | 7         | 1         | 2019-07-22 |
| 3          | 4         | 4         | 2019-07-21 |
| 3          | 4         | 4         | 2019-07-21 |

### WHERE author_id = viewer_id（筛选自己浏览自己的记录）

| article_id | author_id | viewer_id | view_date  |
|------------|-----------|-----------|------------|
| 2          | 7         | 7         | 2019-07-22 |
| 3          | 4         | 4         | 2019-07-21 |
| 3          | 4         | 4         | 2019-07-21 |

> author_id=4 的记录出现了 2 次（同一人同一天浏览同一篇文章），不去重会返回重复结果。

### DISTINCT（去重）

| author_id → id |
|----------------|
| 4              |
| 7              |