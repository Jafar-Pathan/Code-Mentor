# SQL Cheatsheet — Interview Reference

## Query Basics

### SELECT, WHERE, ORDER BY, LIMIT
```sql
-- Select specific columns with conditions
SELECT name, salary
FROM employees
WHERE department = 'Engineering'
  AND salary > 80000
ORDER BY salary DESC
LIMIT 10;
```

### DISTINCT, AS, CASE
```sql
-- Count distinct values
SELECT COUNT(DISTINCT department) AS dept_count
FROM employees;

-- Conditional logic with CASE
SELECT name,
       CASE
         WHEN salary >= 100000 THEN 'Senior'
         WHEN salary >= 70000  THEN 'Mid'
         ELSE 'Junior'
       END AS level
FROM employees;
```

---

## Aggregation & Grouping

### GROUP BY with HAVING
```sql
-- Departments with more than 5 employees
SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;
```

### Aggregate Functions
| Function | Description |
|---|---|
| `COUNT(*)` | Count all rows |
| `COUNT(col)` | Count non-null values |
| `SUM(col)` | Sum of values |
| `AVG(col)` | Average |
| `MIN(col)` / `MAX(col)` | Minimum / Maximum |
| `GROUP_CONCAT(col)` | Concatenate values (SQLite) |

---

## JOINs

```sql
-- INNER JOIN: Only matching rows
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT JOIN: All from left + matching from right
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;

-- Self JOIN: Join table with itself
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
```

### JOIN Cheat Sheet
| JOIN Type | Rows Returned |
|---|---|
| `INNER JOIN` | Only matching pairs |
| `LEFT JOIN` | All left + matching right (NULL if no match) |
| `RIGHT JOIN` | All right + matching left |
| `FULL OUTER JOIN` | All rows from both sides |
| `CROSS JOIN` | Cartesian product (every combination) |

---

## Subqueries & CTEs

### Subquery in WHERE
```sql
-- Employees earning above average salary
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### CTE (Common Table Expression)
```sql
WITH dept_stats AS (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
)
SELECT e.name, e.salary, d.avg_salary
FROM employees e
JOIN dept_stats d ON e.department = d.department
WHERE e.salary > d.avg_salary;
```

### Window Functions
```sql
-- Rank employees by salary within each department
SELECT name, department, salary,
       RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
       SUM(salary) OVER (PARTITION BY department) AS dept_total,
       LAG(salary) OVER (PARTITION BY department ORDER BY salary DESC) AS prev_salary
FROM employees;
```

| Window Function | Description |
|---|---|
| `ROW_NUMBER()` | Unique sequential number (1, 2, 3...) |
| `RANK()` | Same rank for ties, skips numbers (1, 1, 3) |
| `DENSE_RANK()` | Same rank for ties, no skips (1, 1, 2) |
| `LAG(col, n)` | Value from n rows before |
| `LEAD(col, n)` | Value from n rows after |
| `SUM/AVG OVER()` | Running aggregate |

---

## Data Manipulation

### INSERT
```sql
INSERT INTO employees (name, department, salary) VALUES
    ('Alice', 'Engineering', 95000),
    ('Bob', 'Marketing', 72000);
```

### UPDATE
```sql
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'Engineering'
  AND salary < 100000;
```

### DELETE
```sql
DELETE FROM employees
WHERE department = 'Temp'
  AND hire_date < '2023-01-01';
```

---

## Common Interview Queries

### Second Highest Salary
```sql
-- Method 1: LIMIT OFFSET (MySQL/PostgreSQL/SQLite)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Method 2: Subquery
SELECT MAX(salary)
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

### Duplicate Emails
```sql
SELECT email
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

### Employees Who Earn More Than Their Manager
```sql
SELECT e1.name
FROM employees e1
JOIN employees e2 ON e1.manager_id = e2.id
WHERE e1.salary > e2.salary;
```

### Nth Highest Salary (generic)
```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET (N - 1);
```

### Consecutive Numbers
```sql
-- Find numbers that appear at least 3 times consecutively
SELECT DISTINCT num AS ConsecutiveNums
FROM (
    SELECT num,
           LEAD(num) OVER (ORDER BY id) AS next1,
           LEAD(num, 2) OVER (ORDER BY id) AS next2
    FROM logs
) t
WHERE num = next1 AND num = next2;
```