# Linked Lists — Code Examples & Patterns

## Singly Linked List Implementation

### Python
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, val):
        """Add node at the end. O(n)."""
        new_node = ListNode(val)
        if not self.head:
            self.head = new_node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node

    def prepend(self, val):
        """Add node at the beginning. O(1)."""
        self.head = ListNode(val, self.head)

    def delete(self, val):
        """Delete first node with given value."""
        if self.head and self.head.val == val:
            self.head = self.head.next
            return
        curr = self.head
        while curr and curr.next:
            if curr.next.val == val:
                curr.next = curr.next.next
                return
            curr = curr.next

    def to_list(self) -> list:
        """Convert linked list to Python list."""
        result = []
        curr = self.head
        while curr:
            result.append(curr.val)
            curr = curr.next
        return result
```

### Java
```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
```

---

## Reverse Linked List

### Iterative — O(n) time, O(1) space
```python
def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        next_temp = curr.next  # Save next
        curr.next = prev       # Reverse pointer
        prev = curr            # Move prev forward
        curr = next_temp       # Move curr forward
    return prev
```

```java
public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```

### Recursive — O(n) time, O(n) stack space
```python
def reverse_list_recursive(head: ListNode) -> ListNode:
    if not head or not head.next:
        return head
    new_head = reverse_list_recursive(head.next)
    head.next.next = head
    head.next = None
    return new_head
```

---

## Floyd's Cycle Detection

### Detect Cycle
```python
def has_cycle(head: ListNode) -> bool:
    """Returns True if linked list has a cycle. O(n) time, O(1) space."""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

### Find Cycle Start
```python
def find_cycle_start(head: ListNode) -> ListNode:
    """Find the node where the cycle begins."""
    slow = fast = head
    # Phase 1: Find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    if not fast or not fast.next:
        return None  # No cycle
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    return slow
```

---

## Merge Two Sorted Linked Lists
```python
def merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode:
    """Merge two sorted linked lists into one sorted list."""
    dummy = ListNode()
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next
```

---

## Middle of Linked List
```python
def middle_node(head: ListNode) -> ListNode:
    """Find the middle node using slow/fast pointer."""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

---

## Remove Nth Node From End
```python
def remove_nth_from_end(head: ListNode, n: int) -> ListNode:
    """Remove the nth node from the end of the list."""
    dummy = ListNode(0, head)
    fast = slow = dummy
    # Advance fast by n+1 steps
    for _ in range(n + 1):
        fast = fast.next
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    # Remove the node
    slow.next = slow.next.next
    return dummy.next
```

---

## Palindrome Linked List
```python
def is_palindrome(head: ListNode) -> bool:
    """Check if linked list is a palindrome. O(n) time, O(1) space."""
    # Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    # Reverse second half
    second = reverse_list(slow)
    # Compare
    curr1, curr2 = head, second
    result = True
    while curr2:  # Only need to check second half
        if curr1.val != curr2.val:
            result = False
            break
        curr1 = curr1.next
        curr2 = curr2.next
    # Restore (optional)
    reverse_list(second)
    return result
```