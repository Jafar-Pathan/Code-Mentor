# Graphs — Code Examples & Patterns

## Graph Representations

### Adjacency List (Python)
```python
from collections import defaultdict

# Using dict of lists
graph = defaultdict(list)
graph[0].append(1)
graph[0].append(2)
graph[1].append(3)
graph[2].append(3)
# graph = {0: [1, 2], 1: [3], 2: [3]}

# For weighted graphs: dict of dict
weighted = defaultdict(dict)
weighted[0][1] = 4
weighted[0][2] = 1
weighted[2][1] = 2
```

### Adjacency List (Java)
```java
import java.util.*;

// Unweighted
Map<Integer, List<Integer>> graph = new HashMap<>();
graph.computeIfAbsent(0, k -> new ArrayList<>()).add(1);
graph.computeIfAbsent(0, k -> new ArrayList<>()).add(2);

// Weighted
Map<Integer, List<int[]>> weighted = new HashMap<>();
weighted.computeIfAbsent(0, k -> new ArrayList<>()).add(new int[]{1, 4});
```

---

## BFS (Breadth-First Search)

### Template
```python
from collections import deque

def bfs(graph, start):
    """Standard BFS. Returns visited nodes in BFS order."""
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result
```

### Shortest Path in Unweighted Graph
```python
from collections import deque

def shortest_path(graph, start, end):
    """BFS finds shortest path in unweighted graph. O(V + E)."""
    queue = deque([(start, [start])])
    visited = {start}

    while queue:
        node, path = queue.popleft()
        if node == end:
            return path
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return []  # No path
```

---

## DFS (Depth-First Search)

### Recursive Template
```python
def dfs(graph, node, visited=None):
    """Standard recursive DFS."""
    if visited is None:
        visited = set()
    visited.add(node)
    # Process node here
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited
```

### Iterative Template
```python
def dfs_iterative(graph, start):
    """Iterative DFS using explicit stack."""
    visited = set()
    stack = [start]

    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        # Process node here
        for neighbor in reversed(graph[node]):  # Reverse for natural order
            if neighbor not in visited:
                stack.append(neighbor)
    return visited
```

### Number of Connected Components
```python
def count_components(n, edges):
    """Count connected components in undirected graph."""
    from collections import defaultdict
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()
    count = 0

    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)

    for i in range(n):
        if i not in visited:
            dfs(i)
            count += 1
    return count
```

---

## Cycle Detection

### In Undirected Graph (DFS)
```python
def has_cycle_undirected(graph):
    visited = set()
    def dfs(node, parent):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                return True
        return False

    for node in graph:
        if node not in visited:
            if dfs(node, -1):
                return True
    return False
```

### In Directed Graph (DFS with 3 states)
```python
def has_cycle_directed(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph}

    def dfs(node):
        color[node] = GRAY
        for neighbor in graph[node]:
            if color.get(neighbor) == GRAY:
                return True  # Back edge = cycle
            if color.get(neighbor, WHITE) == WHITE:
                if dfs(neighbor):
                    return True
        color[node] = BLACK
        return False

    for node in graph:
        if color[node] == WHITE:
            if dfs(node):
                return True
    return False
```

---

## Topological Sort
```python
from collections import deque

def topological_sort(n, edges):
    """Kahn's algorithm (BFS-based). Returns ordering or empty if cycle."""
    # Build graph and in-degree
    graph = defaultdict(list)
    in_degree = [0] * n
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    # Start with nodes of 0 in-degree
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return result if len(result) == n else []  # Empty = cycle detected
```

---

## Dijkstra's Shortest Path
```python
import heapq

def dijkstra(graph, start):
    """Single-source shortest path. O((V + E) log V)."""
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    heap = [(0, start)]

    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue  # Already found shorter path
        for neighbor, weight in graph[node].items():
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))
    return dist
```

---

## Union-Find (Disjoint Set Union)
```python
class UnionFind:
    """Union-Find with path compression and union by rank."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False  # Already connected
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)
```