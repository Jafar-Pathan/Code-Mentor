# Common Mistakes in Programming Interviews

## 1. Off-by-One Errors
**Mistake:** Using `<=` when you should use `<`, or vice versa.
```python
# WRONG — goes out of bounds
for i in range(len(arr)):  # i goes 0 to n-1
    for j in range(i, len(arr)):  # fine
        pass

# Common: binary search boundary
wrong:  left, right = 0, len(arr)  # right should be len(arr) - 1
right:  left, right = 0, len(arr) - 1
```
**Fix:** Always trace with n=1 and n=2 test cases.

---

## 2. Modifying Array While Iterating
**Mistake:** Removing elements during iteration causes index shifting.
```python
# WRONG — skips elements
for item in my_list:
    if item == target:
        my_list.remove(item)

# CORRECT — iterate backwards or use filter
my_list = [x for x in my_list if x != target]
# OR
for i in range(len(my_list) - 1, -1, -1):
    if my_list[i] == target:
        my_list.pop(i)
```

---

## 3. Integer Overflow
**Mistake:** Assuming int won't overflow (common in Java).
```java
// WRONG — overflows for large arrays
int sum = 0;
for (int num : nums) sum += num;

// CORRECT — use long for potentially large sums
long sum = 0;
for (int num : nums) sum += num;
```
**Rule:** Use `long` for sum, product, or any accumulation that could exceed 2³¹-1.

---

## 4. Python Mutable Default Arguments
**Mistake:** Using mutable default arguments.
```python
# WRONG — shared list across all calls
def add_item(item, items=[]):
    items.append(item)
    return items

# CORRECT
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

---

## 5. String Concatenation in Loops
**Mistake:** O(n²) string concatenation.
```python
# WRONG — creates new string each time: O(n²)
result = ""
for ch in s:
    result += ch

# CORRECT — use list + join: O(n)
chars = []
for ch in s:
    chars.append(ch)
result = "".join(chars)
```
**Java equivalent:** Use `StringBuilder` instead of `+` in loops.

---

## 6. Forgetting Base Case in Recursion
**Mistake:** Infinite recursion → Stack Overflow.
```python
# WRONG — no base case
def factorial(n):
    return n * factorial(n - 1)

# CORRECT
def factorial(n):
    if n <= 1:  # Base case!
        return 1
    return n * factorial(n - 1)
```

---

## 7. Comparing Objects with `==`
**Mistake:** Using `==` to compare object values.
```java
// WRONG — compares references, not values
if (str1 == str2) { ... }

// CORRECT
if (str1.equals(str2)) { ... }
// Or for null-safe:
if (Objects.equals(str1, str2)) { ... }
```

---

## 8. Not Handling Edge Cases
**Commonly missed edge cases in interviews:**
- Empty array/string: `[]`, `""`
- Single element: `[1]`
- All same elements: `[2, 2, 2]`
- Negative numbers
- Zero in input
- Already sorted / reverse sorted
- Duplicate elements
- Very large input (need efficient algorithm)
- Null/None input

**Tip:** Before coding, list all edge cases and mention them to the interviewer.

---

## 9. Wrong Hash Map Key for Counting
**Mistake:** Using a complex object as key without proper `hashCode/equals`.
```java
// In Java, if you use a custom object as HashMap key,
// you MUST override hashCode() and equals()
class Point {
    int x, y;
    // Must override:
    @Override
    public boolean equals(Object o) { ... }
    @Override
    public int hashCode() { return Objects.hash(x, y); }
}
```

---

## 10. Shallow vs Deep Copy
**Mistake:** Modifying a "copy" affects the original.
```python
# WRONG — shallow copy, inner lists are shared
board_copy = [row[:] for row in board]

# For nested structures, use deepcopy
import copy
board_copy = copy.deepcopy(board)
```

---

## 11. DFS Without Visited Set (Infinite Loop)
**Mistake:** Forgetting to mark nodes as visited in graph traversal.
```python
# WRONG — infinite loop on cycles
def dfs(node):
    for neighbor in graph[node]:
        dfs(neighbor)

# CORRECT — track visited
def dfs(node, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return
    visited.add(node)
    for neighbor in graph[node]:
        dfs(neighbor, visited)
```

---

## 12. Quick Sort Pivot Issues
**Mistake:** Always choosing first/last element as pivot → O(n²) on sorted input.
```python
# BETTER — use random pivot
import random
pivot_idx = random.randint(left, right)
arr[pivot_idx], arr[right] = arr[right], arr[pivot_idx]
pivot = arr[right]
```

---

## 13. Forgetting to Return in Recursive Calls
```python
# WRONG — inner return doesn't propagate
def search(node, target):
    if not node:
        return None
    if node.val == target:
        return node
    search(node.left, target)   # ← Return value is ignored!
    search(node.right, target)  # ← Return value is ignored!

# CORRECT
def search(node, target):
    if not node: return None
    if node.val == target: return node
    left = search(node.left, target)
    if left: return left
    return search(node.right, target)
```