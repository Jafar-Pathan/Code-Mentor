# Trees — Code Examples & Patterns

## Binary Tree Node

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}
```

---

## Tree Traversals

### Inorder (Left, Root, Right) — Gives sorted order for BST
```python
def inorder(root: TreeNode) -> list[int]:
    result = []
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        result.append(node.val)
        traverse(node.right)
    traverse(root)
    return result

# Iterative
def inorder_iterative(root: TreeNode) -> list[int]:
    result, stack = [], []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result
```

### Preorder (Root, Left, Right) — Used for serialization
```python
def preorder(root: TreeNode) -> list[int]:
    result = []
    def traverse(node):
        if not node:
            return
        result.append(node.val)
        traverse(node.left)
        traverse(node.right)
    traverse(root)
    return result
```

### Postorder (Left, Right, Root) — Used for deletion
```python
def postorder(root: TreeNode) -> list[int]:
    result = []
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        traverse(node.right)
        result.append(node.val)
    traverse(root)
    return result
```

### Level Order (BFS)
```python
from collections import deque

def level_order(root: TreeNode) -> list[list[int]]:
    """Returns list of levels, each level is a list of values."""
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
```

---

## Binary Search Tree (BST)

### Validate BST
```python
def is_valid_bst(root: TreeNode) -> bool:
    """Check if a binary tree is a valid BST."""
    def validate(node, low, high):
        if not node:
            return True
        if node.val <= low or node.val >= high:
            return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root, float('-inf'), float('inf'))
```

### Search in BST — O(h) where h is height
```python
def search_bst(root: TreeNode, val: int) -> TreeNode:
    if not root or root.val == val:
        return root
    if val < root.val:
        return search_bst(root.left, val)
    return search_bst(root.right, val)
```

### Insert into BST
```python
def insert_bst(root: TreeNode, val: int) -> TreeNode:
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_bst(root.left, val)
    elif val > root.val:
        root.right = insert_bst(root.right, val)
    return root
```

### LCA (Lowest Common Ancestor) in BST
```python
def lca_bst(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    if p.val < root.val and q.val < root.val:
        return lca_bst(root.left, p, q)
    if p.val > root.val and q.val > root.val:
        return lca_bst(root.right, p, q)
    return root
```

---

## Binary Heap / Priority Queue

### Min Heap in Python
```python
import heapq

# Create min heap
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 2)
heapq.heappush(heap, 8)
print(heapq.heappop(heap))  # 2 (smallest)

# Heapify a list
nums = [3, 1, 4, 1, 5, 9, 2, 6]
heapq.heapify(nums)  # Now nums is a min-heap

# Max heap trick: negate values
max_heap = []
heapq.heappush(max_heap, -5)  # Push -5 to get max-heap behavior
largest = -heapq.heappop(max_heap)  # 5
```

### Top K Elements
```python
import heapq

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """Find k most frequent elements. O(n log k)."""
    from collections import Counter
    count = Counter(nums)
    # Use min-heap of size k
    return heapq.nlargest(k, count.keys(), key=count.get)
```

---

## Trie (Prefix Tree)

```python
class TrieNode:
    def __init__(self):
        self.children = {}   # char -> TrieNode
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True

    def autocomplete(self, prefix: str) -> list[str]:
        """Return all words with given prefix."""
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []
            node = node.children[ch]
        results = []
        def dfs(n, path):
            if n.is_end:
                results.append(prefix + path)
            for ch, child in n.children.items():
                dfs(child, path + ch)
        dfs(node, "")
        return results
```