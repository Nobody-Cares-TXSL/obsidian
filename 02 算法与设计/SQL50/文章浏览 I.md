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

## 题解

> 查询浏览过自己文章的作者，即 `author_id = viewer_id` 的记录

```sql
-- DISTINCT 去重：同一作者可能多次浏览自己的文章
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id  -- 作者和浏览者是同一人
ORDER BY id;                 -- 按作者 ID 升序排列
```