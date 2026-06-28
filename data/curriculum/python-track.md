# Python Learning Track — CodeMentor AI

## Track Overview
Progressive Python curriculum from basics to interview-ready.
Tracks with: Data Structures & Algorithms syllabus

---

## Level 1: Python Fundamentals (Week 1-3)

### 1.1 Setup & Basics
- Python installation, pip, virtual environments
- `print()`, `input()`, variables
- Dynamic typing, `type()`, `isinstance()`
- Comments, docstrings

### 1.2 Data Types
- `int`, `float`, `complex`, `bool`
- `str` — creation, slicing, methods, f-strings
- `list` — creation, indexing, methods
- `tuple` — immutability, unpacking
- `dict` — creation, methods, comprehension
- `set` — uniqueness, set operations
- `None` type

### 1.3 Control Flow
- `if/elif/else`, ternary expression
- `for` loops, `range()`, `enumerate()`, `zip()`
- `while` loops, `break`, `continue`, `pass`
- `match/case` (Python 3.10+)

### 1.4 Functions
- `def`, parameters, default args, `*args`, `**kwargs`
- Return values, multiple returns
- `lambda` functions
- Decorators basics
- Scope: LEGB rule

---

## Level 2: Python OOP (Week 4-5)

### 2.1 Classes & Objects
- `class` definition, `__init__`, `self`
- Instance vs class variables
- `@property`, getters/setters
- `__str__`, `__repr__`, `__eq__`

### 2.2 Inheritance & Polymorphism
- Single, multiple inheritance, MRO
- `super()`, method resolution order
- Abstract classes (`abc` module)
- Duck typing

### 2.3 Magic/Dunder Methods
- `__len__`, `__getitem__`, `__iter__`
- `__call__`, `__enter__`/`__exit__` (context managers)
- Operator overloading

---

## Level 3: Data Structures in Python (Week 6-7)

### 3.1 Built-in DS Deep Dive
- List internals (dynamic array)
- Dict internals (hash table, open addressing)
- Set operations, frozenset
- `collections` module: `Counter`, `defaultdict`, `deque`, `OrderedDict`, `namedtuple`
- `heapq` module — min-heap, max-heap tricks
- `bisect` module — binary search on sorted lists

### 3.2 Custom Data Structures
- Implementing LinkedList, Stack, Queue, BST
- Trie implementation
- Graph adjacency list
- LRU Cache (`OrderedDict`)

---

## Level 4: Algorithms & Problem Solving (Week 8-10)

### 4.1 Searching & Sorting
- Binary search (bisect module)
- Custom sorting with `key` and `reverse`
- `sorted()` vs `.sort()`

### 4.2 Recursion & Backtracking
- Recursion patterns, base cases
- Memoization with `functools.lru_cache`
- Backtracking: subsets, permutations, combinations, N-Queens

### 4.3 Dynamic Programming
- Top-down with `@lru_cache`
- Bottom-up tabulation
- Common patterns: 1D DP, 2D DP, bitmask DP

### 4.4 Graph Algorithms
- BFS with `collections.deque`
- DFS recursively and iteratively
- Dijkstra's with `heapq`
- Union-Find (Disjoint Set)

### 4.5 Pythonic Problem Solving
- List comprehensions, dict comprehensions
- Generator expressions
- `itertools`: `product`, `permutations`, `combinations`, `groupby`
- String tricks: `split`, `join`, `strip`, `replace`

---

## Level 5: Python for Interviews (Week 11-12)

### 5.1 Common Interview Problems
- Two Sum, Three Sum
- Valid Parentheses
- Merge Intervals
- Group Anagrams
- Longest Substring Without Repeating Characters
- Container With Most Water

### 5.2 Python-Specific Interview Topics
- GIL (Global Interpreter Lock) and threading
- `__init__` vs `__new__`
- Mutable default arguments pitfall
- Shallow vs deep copy
- `*args` vs `**kwargs` internals
- Decorators and closures
- Generators and iterators
- Context managers

### 5.3 Standard Library Power-Ups
- `re` — regex for string problems
- `math`, `statistics` — numeric helpers
- `datetime` — date manipulation
- `json` — parsing
- `typing` — type hints for interview code