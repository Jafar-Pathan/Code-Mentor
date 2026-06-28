# Design Patterns — Interview Reference

## Creational Patterns

### Singleton
Ensures a class has only one instance.
```python
class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.connection = "Connected"
        return cls._instance
```

```java
public class Database {
    private static volatile Database instance;
    private String connection;

    private Database() { this.connection = "Connected"; }

    public static Database getInstance() {
        if (instance == null) {
            synchronized (Database.class) {
                if (instance == null) {
                    instance = new Database();
                }
            }
        }
        return instance;
    }
}
```

### Factory Method
Creates objects without specifying the exact class.
```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self): pass

class Dog(Animal):
    def speak(self): return "Woof!"

class Cat(Animal):
    def speak(self): return "Meow!"

class AnimalFactory:
    @staticmethod
    def create(animal_type: str) -> Animal:
        if animal_type == "dog": return Dog()
        if animal_type == "cat": return Cat()
        raise ValueError(f"Unknown animal: {animal_type}")
```

---

## Structural Patterns

### Adapter
Converts one interface into another.
```python
class MediaPlayer:
    def play(self, audio_type, filename):
        if audio_type == "mp3":
            print(f"Playing MP3: {filename}")
        else:
            print(f"Cannot play {audio_type}")

class AdvancedMediaPlayer:
    def play_vlc(self, filename): print(f"Playing VLC: {filename}")
    def play_mp4(self, filename): print(f"Playing MP4: {filename}")

class MediaAdapter(MediaPlayer):
    def __init__(self, audio_type):
        self.player = AdvancedMediaPlayer()

    def play(self, audio_type, filename):
        if audio_type == "vlc": self.player.play_vlc(filename)
        elif audio_type == "mp4": self.player.play_mp4(filename)
```

### Decorator
Adds behavior to objects dynamically.
```python
class Coffee:
    def cost(self): return 5

class MilkDecorator(Coffee):
    def __init__(self, coffee): self.coffee = coffee
    def cost(self): return self.coffee.cost() + 2

class SugarDecorator(Coffee):
    def __init__(self, coffee): self.coffee = coffee
    def cost(self): return self.coffee.cost() + 1

# Usage
coffee = SugarDecorator(MilkDecorator(Coffee()))
print(coffee.cost())  # 5 + 2 + 1 = 8
```

---

## Behavioral Patterns

### Observer
Publish-subscribe pattern for event handling.
```python
class EventEmitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def emit(self, event, *args):
        for cb in self._listeners.get(event, []):
            cb(*args)

# Usage
emitter = EventEmitter()
emitter.on("click", lambda: print("Clicked!"))
emitter.emit("click")
```

### Strategy
Swap algorithms at runtime.
```python
class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data): pass

class QuickSort(SortStrategy):
    def sort(self, data): return sorted(data)

class MergeSort(SortStrategy):
    def sort(self, data):
        if len(data) <= 1: return data
        mid = len(data) // 2
        left = self.sort(data[:mid])
        right = self.sort(data[mid:])
        return self._merge(left, right)

    def _merge(self, a, b):
        result, i, j = [], 0, 0
        while i < len(a) and j < len(b):
            result.append(a[i] if a[i] <= b[j] else b[j])
            i, j = i + (a[i] <= b[j]), j + (a[i] > b[j])
        return result + a[i:] + b[j:]

class Sorter:
    def __init__(self, strategy: SortStrategy):
        self.strategy = strategy
    def sort(self, data):
        return self.strategy.sort(data)
```

---

## When to Use Which Pattern?

| Pattern | Use When |
|---|---|
| **Singleton** | Exactly one instance needed (DB connection, config, logger) |
| **Factory** | Creating objects without specifying concrete class |
| **Builder** | Complex object construction with many optional parameters |
| **Adapter** | Making incompatible interfaces work together |
| **Decorator** | Adding responsibilities dynamically without subclassing |
| **Observer** | One-to-many dependency (event systems, notifications) |
| **Strategy** | Swap algorithms at runtime (sorting, validation) |
| **Iterator** | Access collection elements without exposing internals |
| **Facade** | Simplified interface to a complex subsystem |

## SOLID Principles Quick Reference

| Principle | Meaning |
|---|---|
| **S** — Single Responsibility | A class should have one reason to change |
| **O** — Open/Closed | Open for extension, closed for modification |
| **L** — Liskov Substitution | Subtypes must be substitutable for base types |
| **I** — Interface Segregation | Many specific interfaces > one general interface |
| **D** — Dependency Inversion | Depend on abstractions, not concretions |