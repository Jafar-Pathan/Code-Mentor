---
title: Linked Lists
category: dsa
tags: [linked-list, cycle-detection, reversal, merge, floyd]
difficulty: intermediate
---

# Linked Lists

## Types

- **Singly Linked List**: Each node has data + next pointer. O(1) insertion at head, O(n) access.
- **Doubly Linked List**: Each node has data + prev + next. O(1) insertion/deletion at known position. Used in LRU caches.

## Cycle Detection (Floyd's Tortoise and Hare)

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```
Time: O(n), Space: O(1). Slow moves 1 step, fast moves 2 steps. If cycle exists, they meet.

### Find Cycle Start
```python
def find_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None
```

## Reverse a Linked List

### Iterative O(n) time, O(1) space
```python
def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
```

## Merge Two Sorted Lists

```python
def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next
```
Time: O(n + m), Space: O(1)

## When to Use Linked Lists

- Frequent insertions/deletions at known positions
- Unknown size that grows dynamically
- Implementing stacks, queues, LRU caches
- NOT for random access (use arrays)