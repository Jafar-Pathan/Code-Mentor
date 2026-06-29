# Interview Tips & Strategy Guide

## Before the Interview

### Preparation Checklist
- [ ] Practice 50-100 problems on the topic areas you're weakest in
- [ ] Review time complexities of all common algorithms and data structures
- [ ] Practice explaining your thought process OUT LOUD
- [ ] Prepare 2-3 behavioral stories using STAR method
- [ ] Research the company and role
- [ ] Test your setup (IDE, mic, camera for virtual interviews)

### Study Order (by interview frequency)
1. **Arrays & Hashing** (most common first questions)
2. **Two Pointers & Sliding Window**
3. **Stack & Queue**
4. **Linked List**
5. **Binary Search**
6. **Trees & BST**
7. **Heap / Priority Queue**
8. **Graph BFS/DFS**
9. **Dynamic Programming (1D then 2D)**
10. **Backtracking**
11. **Trie**
12. **Advanced: Union-Find, Topological Sort**

---

## During the Interview

### The UMPIRE Framework

**U — Understand**
- Repeat the problem in your own words
- Ask clarifying questions:
  - "Can the array be empty?"
  - "Are there negative numbers?"
  - "Should I return the index or the value?"
  - "Can there be duplicates?"
- Confirm input/output format and constraints

**M — Match**
- Identify which data structures / patterns apply
- "This looks like a two-pointer problem because..."
- "Since we need O(1) lookup, a hash map would work"

**P — Plan**
- Write out your approach in plain English before coding
- State time and space complexity of your plan
- If multiple approaches: start simple, then optimize

**I — Implement**
- Write clean, readable code
- Use meaningful variable names
- Comment non-obvious logic
- Don't over-optimize while coding

**R — Review**
- Walk through your code with a small example
- Check for off-by-one errors, edge cases
- Verify the output matches expectations

**E — Evaluate**
- State final time and space complexity
- If asked to optimize, discuss trade-offs
- Mention alternative approaches you considered

---

## Problem-Solving Patterns Recognition

| When You Hear... | Think... |
|---|---|
| "Find a pair/triplet that..." | Two Pointers or Hash Map |
| "Maximum/minimum subarray/substring of size k" | Sliding Window |
| "Sorted array" | Binary Search |
| "Shortest path" | BFS (unweighted) or Dijkstra (weighted) |
| "All possible combinations/permutations" | Backtracking |
| "Optimal substructure, overlapping subproblems" | Dynamic Programming |
| "Dependent tasks, order matters" | Topological Sort |
| "Connected components" | BFS/DFS or Union-Find |
| "Top K elements" | Heap or Quick Select |
| "Prefix, autocomplete" | Trie |
| "Need O(1) lookup/insert/delete" | Hash Table |

---

## Time Management

| Time Given | Strategy |
|---|---|
| **30 min** | 5 min understand, 5 min plan, 15 min code, 5 min test |
| **45 min** | 8 min understand, 7 min plan, 20 min code, 10 min test |
| **60 min** | 10 min understand, 10 min plan, 25 min code, 15 min test |

**If stuck:**
1. Re-read the problem (you might have missed a constraint)
2. Try a brute force approach first
3. Look for patterns in examples
4. Simplify the problem (smaller input, fewer constraints)
5. Draw a diagram
6. Talk through your thought process with the interviewer

---

## Communication Tips

**DO:**
- Think out loud constantly
- Ask questions before diving in
- Name the pattern/technique you're using
- State time/space complexity after writing code
- Test with edge cases and explain your test

**DON'T:**
- Code in silence for 10+ minutes
- Jump to the optimal solution without explaining the naive one first
- Argue with the interviewer about approach
- Give up — even a partial solution with good communication beats silence

---

## Language-Specific Tips

### Python
- Use `collections.Counter`, `defaultdict`, `deque` freely
- `heapq` for heaps, `bisect` for binary search
- `@lru_cache` for memoization
- List/dict/set comprehensions for clean code

### Java
- Know Collections framework cold (`ArrayList`, `HashMap`, `PriorityQueue`)
- Use `StringBuilder` in loops
- Use `Integer.parseInt()` for string→number
- Mention `stream()` if it makes code cleaner

### JavaScript
- Use `Map` and `Set` (not plain objects for sets)
- `Array.sort()` needs a comparator
- Know `reduce`, `filter`, `map`, `forEach`
- `const` by default, `let` when needed

---

## Common Follow-Up Questions
After you solve a problem, interviewers often ask:
1. "Can you do it in O(1) space?" → Look for in-place solutions
2. "What if the input is a stream?" → Think heaps, sliding window
3. "What if the array is too large for memory?" → External sort, chunking
4. "Can you make it O(log n)?" → Binary search
5. "How would you test this?" → Unit test categories: normal, edge, error
6. "What are the trade-offs?" → Time vs space, readability vs performance