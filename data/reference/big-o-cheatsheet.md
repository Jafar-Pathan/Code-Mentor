# Big-O Complexity Cheat Sheet

## Data Structure Operations

| Data Structure | Access | Search | Insert | Delete | Space |
|---|---|---|---|---|---|
| **Array** | O(1) | O(n) | O(n) | O(n) | O(n) |
| **Sorted Array** | O(1) | O(log n) | O(n) | O(n) | O(n) |
| **Linked List** | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| **Doubly Linked List** | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| **Stack** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Queue** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Hash Table** | N/A | O(1) avg | O(1) avg | O(1) avg | O(n) |
| **BST (balanced)** | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| **BST (worst)** | O(n) | O(n) | O(n) | O(n) | O(n) |
| **AVL/Red-Black Tree** | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| **Heap (min/max)** | O(1) top | O(n) | O(log n) | O(log n) | O(n) |
| **Trie** | O(m)** | O(m)** | O(m)** | O(m)** | O(ALPHABET × n) |

*If pointer to node is known
**m = length of key/string

---

## Sorting Algorithms

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | O(1) | No |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) | No* |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| **Counting Sort** | O(n + k) | O(n + k) | O(n + k) | O(k) | Yes |
| **Radix Sort** | O(nk) | O(nk) | O(nk) | O(n + k) | Yes |

*Can be made stable with extra space
k = range of values in counting sort, digit count in radix sort

### When to Use Which Sort?
- **Nearly sorted data** → Insertion Sort (O(n) best case)
- **General purpose, stable** → Merge Sort
- **General purpose, in-place** → Quick Sort (with random pivot)
- **Memory constrained** → Heap Sort
- **Small range of integers** → Counting Sort
- **Python/Java built-in** → Timsort (merge + insertion hybrid)

---

## Graph Algorithms

| Algorithm | Time | Space | Use Case |
|---|---|---|---|
| **BFS** | O(V + E) | O(V) | Shortest path (unweighted), level-order |
| **DFS** | O(V + E) | O(V) | Cycle detection, topological sort, connectivity |
| **Dijkstra** | O((V + E) log V) | O(V) | Shortest path (weighted, no negatives) |
| **Bellman-Ford** | O(V × E) | O(V) | Shortest path (handles negative weights) |
| **Floyd-Warshall** | O(V³) | O(V²) | All-pairs shortest path |
| **Kruskal (MST)** | O(E log E) | O(V) | Minimum spanning tree |
| **Prim (MST)** | O((V + E) log V) | O(V) | Minimum spanning tree |
| **Topological Sort** | O(V + E) | O(V) | DAG ordering, scheduling |
| **Union-Find** | O(α(n)) ≈ O(1) | O(n) | Connected components, cycle detection |

---

## Common Algorithm Patterns

| Pattern | Time | Problems |
|---|---|---|
| **Two Pointers** | O(n) | Two Sum (sorted), Palindrome, Container w/ Water |
| **Sliding Window** | O(n) | Max Sum Subarray, Longest Substring, Min Window |
| **Binary Search** | O(log n) | Search in Sorted, Lower/Upper Bound, Search on Answer |
| **Prefix Sum** | O(1) query | Range Sum, Equilibrium, Subarray Sum Equals K |
| **Monotonic Stack** | O(n) | Next Greater, Daily Temperatures, Largest Rectangle |
| **Hash Map** | O(n) avg | Two Sum, Frequency Count, Group Anagrams |
| **Divide & Conquer** | O(n log n) | Merge Sort, Quick Sort, Closest Pair |
| **Greedy** | Varies | Activity Selection, Huffman, Interval Scheduling |
| **Backtracking** | O(2ⁿ) or O(n!) | N-Queens, Sudoku, Subsets, Permutations |
| **1D DP** | O(n) or O(n × k) | Fibonacci, Climbing Stairs, Coin Change, LIS |
| **2D DP** | O(n × m) | LCS, Edit Distance, Knapsack, Grid Paths |
| **Bitmask DP** | O(n × 2ⁿ) | TSP, Assignment Problem |

---

## Space Complexity Quick Reference

| Pattern | Space |
|---|---|
| In-place array modification | O(1) |
| Hash map/set | O(n) |
| Recursion stack depth | O(depth) — O(n) worst, O(log n) for balanced |
| 1D DP array | O(n) |
| 2D DP table | O(n × m) |
| BFS queue | O(V) |
| Adjacency list | O(V + E) |
| Adjacency matrix | O(V²) |

---

## Master Theorem Quick Reference

For recurrences of form: T(n) = aT(n/b) + O(nᵈ)

| Condition | Complexity |
|---|---|
| d < log_b(a) | O(n^log_b(a)) |
| d = log_b(a) | O(nᵈ × log n) |
| d > log_b(a) | O(nᵈ) |

**Common examples:**
- Merge Sort: T(n) = 2T(n/2) + O(n) → d=1, log₂2=1 → **O(n log n)**
- Binary Search: T(n) = T(n/2) + O(1) → d=0, log₂1=0 → **O(log n)**
- Strassen's: T(n) = 7T(n/2) + O(n²) → d=2, log₂7≈2.81 → **O(n^2.81)**