# Data Structures & Algorithms — Complete Syllabus

## Course Overview
Complete DSA curriculum for coding interviews and competitive programming.
Duration: 16 weeks | Difficulty: Beginner → Advanced

---

## Module 1: Foundations (Week 1-2)

### 1.1 Time & Space Complexity
- Big O, Big Omega, Big Theta notation
- Best / Average / Worst case analysis
- Amortized analysis basics
- Common complexities: O(1), O(log n), O(n), O(n log n), O(n²), O(2^n)
- How to analyze nested loops, recursion with Master Theorem

### 1.2 Arrays & Strings
- Static vs dynamic arrays
- Array operations: access, search, insert, delete
- String manipulation: reverse, substring, anagrams
- Two-pointer technique
- Sliding window technique
- Prefix sum arrays

**Prerequisites:** Basic programming in any language
**Difficulty:** Beginner

---

## Module 2: Linear Structures (Week 3-4)

### 2.1 Linked Lists
- Singly linked list: creation, traversal, insertion, deletion
- Doubly linked list
- Circular linked list
- Fast & slow pointer (Floyd's cycle detection)
- Reverse a linked list (iterative & recursive)
- Merge two sorted linked lists

### 2.2 Stacks
- LIFO principle
- Array-based vs linked-list implementation
- Applications: expression evaluation, balanced parentheses, monotonic stack
- Next Greater Element problem

### 2.3 Queues
- FIFO principle
- Circular queue
- Deque (double-ended queue)
- Applications: BFS, scheduling
- Priority Queue / Heap (brief intro)

**Prerequisites:** Module 1
**Difficulty:** Beginner-Intermediate

---

## Module 3: Hashing (Week 5)

### 3.1 Hash Tables
- Hash function design
- Collision handling: chaining, open addressing
- Load factor and rehashing
- Applications: two-sum, frequency counting, grouping anagrams

### 3.2 Sets & Maps
- Built-in implementations per language
- When to use set vs map vs list
- Ordered maps / TreeMaps

**Prerequisites:** Module 1
**Difficulty:** Beginner-Intermediate

---

## Module 4: Trees (Week 6-7)

### 4.1 Binary Trees
- Tree terminology: root, leaf, depth, height
- Traversals: inorder, preorder, postorder, level-order (BFS)
- Binary Search Tree (BST): insert, search, delete, validate
- Balanced BST: AVL tree (concept), Red-Black tree (concept)

### 4.2 Advanced Trees
- Heap / Priority Queue: min-heap, max-heap, heapify
- Trie (prefix tree): insert, search, autocomplete
- Segment Tree (concept)
- Binary Indexed Tree / Fenwick Tree (concept)

**Prerequisites:** Module 2 (recursion)
**Difficulty:** Intermediate

---

## Module 5: Graphs (Week 8-9)

### 5.1 Graph Representations
- Adjacency matrix vs adjacency list
- When to use which

### 5.2 Graph Traversal
- BFS (Breadth-First Search): shortest path in unweighted graph
- DFS (Depth-First Search): cycle detection, topological sort, connected components

### 5.3 Shortest Path
- Dijkstra's algorithm
- Bellman-Ford (negative weights)
- Floyd-Warshall (all pairs)

### 5.4 Minimum Spanning Tree
- Kruskal's algorithm (Union-Find)
- Prim's algorithm

### 5.5 Advanced
- Topological sorting
- Strongly Connected Components (Kosaraju's / Tarjan's)
- Detecting cycles in directed/undirected graphs

**Prerequisites:** Module 4 (queues, recursion)
**Difficulty:** Intermediate-Advanced

---

## Module 6: Sorting & Searching (Week 10)

### 6.1 Sorting Algorithms
- Bubble Sort, Selection Sort, Insertion Sort
- Merge Sort (divide & conquer)
- Quick Sort (partition, pivot selection)
- Heap Sort
- Counting Sort, Radix Sort (non-comparison)
- When to use which sort

### 6.2 Searching
- Binary Search (on sorted arrays)
- Binary Search on answer (optimization problems)
- Search in rotated sorted array

**Prerequisites:** Module 1
**Difficulty:** Beginner-Intermediate

---

## Module 7: Dynamic Programming (Week 11-13)

### 7.1 DP Fundamentals
- Overlapping subproblems, optimal substructure
- Top-down (memoization) vs Bottom-up (tabulation)
- State, transition, base case identification

### 7.1 Classic 1D DP
- Fibonacci, Climbing Stairs, House Robber
- Coin Change
- Longest Increasing Subsequence (LIS)

### 7.2 Classic 2D DP
- Longest Common Subsequence (LCS)
- Edit Distance
- 0/1 Knapsack
- Matrix Chain Multiplication

### 7.3 Advanced DP
- DP on Trees
- DP on Graphs
- Bitmask DP
- String DP (Regular expression matching, word break)

**Prerequisites:** Module 4, Module 6
**Difficulty:** Advanced

---

## Module 8: Greedy & Backtracking (Week 14)

### 8.1 Greedy Algorithms
- Activity Selection Problem
- Huffman Coding
- Fractional Knapsack
- When greedy works vs doesn't

### 8.2 Backtracking
- N-Queens Problem
- Sudoku Solver
- Subset / Permutation / Combination generation
- Word Search in Grid

**Prerequisites:** Module 6, Module 7
**Difficulty:** Intermediate-Advanced

---

## Module 9: Advanced Topics (Week 15-16)

### 9.1 Bit Manipulation
- Bitwise operators: AND, OR, XOR, NOT, shifts
- Common tricks: check power of 2, count set bits, swap without temp

### 9.2 Math for CP
- GCD, LCM, Prime Sieve (Sieve of Eratosthenes)
- Modular arithmetic, fast exponentiation
- Combinatorics: nCr, permutations

### 9.3 String Algorithms
- KMP Pattern Matching
- Rabin-Karp (rolling hash)
- Z-Algorithm
- Manacher's Algorithm (palindromes)

### 9.4 System Design Basics
- Scalability fundamentals
- Load balancing, caching, database sharding
- Common system design patterns

**Prerequisites:** All previous modules
**Difficulty:** Advanced