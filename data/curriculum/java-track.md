# Java Learning Track — CodeMentor AI

## Track Overview
Progressive Java curriculum from basics to interview-ready.
Tracks with: Data Structures & Algorithms syllabus

---

## Level 1: Java Fundamentals (Week 1-3)

### 1.1 Setup & First Program
- JDK installation, IDE setup (IntelliJ / VS Code)
- `HelloWorld.java`, compilation, JVM basics
- `public static void main(String[] args)` explained

### 1.2 Data Types & Variables
- Primitive types: `int`, `long`, `double`, `float`, `char`, `boolean`, `byte`, `short`
- Reference types: `String`, arrays, objects
- Type casting (implicit vs explicit)
- `var` keyword (Java 10+)

### 1.3 Operators & Control Flow
- Arithmetic, relational, logical, bitwise operators
- `if/else`, `switch`, ternary operator
- `for`, `while`, `do-while`, `for-each`
- `break`, `continue`, `return`

### 1.4 Methods
- Method declaration, parameters, return types
- `static` methods vs instance methods
- Method overloading
- Varargs (`...`)

---

## Level 2: Object-Oriented Programming (Week 4-6)

### 2.1 Classes & Objects
- Class definition, constructors, `this` keyword
- Instance variables vs local variables
- Access modifiers: `public`, `private`, `protected`, default

### 2.2 Inheritance & Polymorphism
- `extends`, `super` keyword
- Method overriding vs overloading
- `abstract` classes, `final` keyword
- Object class methods: `toString()`, `equals()`, `hashCode()`

### 2.3 Interfaces
- Interface definition and implementation
- Default methods, static methods in interfaces
- Multiple interface implementation
- Functional interfaces, `@FunctionalInterface`

### 2.4 Design Patterns (Basics)
- Singleton pattern
- Factory pattern
- Observer pattern
- Strategy pattern

---

## Level 3: Core Java Libraries (Week 7-8)

### 3.1 Collections Framework
- `List`: `ArrayList`, `LinkedList` — when to use which
- `Set`: `HashSet`, `TreeSet`, `LinkedHashSet`
- `Map`: `HashMap`, `TreeMap`, `LinkedHashMap`
- `Queue`: `PriorityQueue`, `ArrayDeque`
- Iterators, `Comparable`, `Comparator`

### 3.2 Exception Handling
- `try/catch/finally`, `throw`, `throws`
- Checked vs unchecked exceptions
- Custom exceptions
- Try-with-resources

### 3.3 String & Text Processing
- `String` immutability, `StringBuilder`, `StringBuffer`
- Common string methods
- Regular expressions basics
- String formatting (`String.format`)

### 3.4 I/O & File Handling
- `File`, `FileReader`, `BufferedReader`
- `FileWriter`, `BufferedWriter`, `PrintWriter`
- Serialization & Deserialization
- `java.nio` basics

---

## Level 4: Advanced Java (Week 9-10)

### 4.1 Generics
- Generic classes and methods
- Bounded type parameters (`<T extends Comparable>`)
- Wildcards (`?`, `? extends T`, `? super T`)
- Type erasure concept

### 4.2 Multithreading
- `Thread` class vs `Runnable` interface
- Thread lifecycle: new, runnable, blocked, waiting, terminated
- Synchronization: `synchronized`, `Lock`, `ReentrantLock`
- Thread pool: `ExecutorService`, `Executors`
- `volatile`, `atomic` classes
- Concurrent collections: `ConcurrentHashMap`, `CopyOnWriteArrayList`

### 4.3 Lambda & Streams (Java 8+)
- Lambda syntax
- Functional interfaces: `Predicate`, `Function`, `Consumer`, `Supplier`
- Stream API: `filter`, `map`, `reduce`, `collect`
- Optional class
- Date/Time API (`java.time`)

---

## Level 5: Java for Interviews (Week 11-12)

### 5.1 DSA Implementation in Java
- Array/ArrayList manipulation patterns
- LinkedList from scratch
- Stack/Queue implementations
- BST implementation
- HashMap internals (buckets, chaining, treeification)

### 5.2 Common Interview Problems in Java
- Two Sum, Three Sum
- Valid Parentheses
- Merge Intervals
- LRU Cache (LinkedHashMap)
- Trie implementation
- Graph BFS/DFS
- Dynamic Programming patterns

### 5.3 Java-Specific Interview Questions
- `equals()` vs `==`
- `HashMap` internal working
- `String` pool / interning
- Garbage collection basics
- `final`, `finally`, `finalize`
- `static` keyword deep dive
- Exception hierarchy