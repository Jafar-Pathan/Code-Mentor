---
title: Arrays & Common Patterns
category: dsa
tags: [arrays, two-pointers, sliding-window, prefix-sum, big-o]
difficulty: beginner
---

# Arrays

## Time Complexity of Array Operations

| Operation | Time | Notes |
|-----------|------|-------|
| Access by index | O(1) | Direct memory address calculation |
| Search (unsorted) | O(n) | Linear scan required |
| Search (sorted) | O(log n) | Binary search |
| Insert at end | O(1) amortized | Dynamic array may resize |
| Insert at beginning | O(n) | Must shift all elements |
| Delete from end | O(1) | No shifting needed |
| Delete from beginning | O(n) | Must shift all elements |

## Two Pointer Technique

Used when you need to process pairs of elements from both ends or from a single direction.

### Valid Palindrome
```python
def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

### Two Sum (Sorted Array)
```python
def two_sum_sorted(nums: list, target: int) -> list:
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1
    return []
```
Time: O(n), Space: O(1)

## Sliding Window

Used for problems involving contiguous subarrays or substrings.

### Maximum Sum Subarray of Size K
```java
int maxSumSubarray(int[] arr, int k) {
    int maxSum = 0, windowSum = 0;
    for (int i = 0; i < arr.length; i++) {
        windowSum += arr[i];
        if (i >= k) {
            windowSum -= arr[i - k];
        }
        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
        }
    }
    return maxSum;
}
```
Time: O(n), Space: O(1)

### Longest Substring Without Repeating Characters
```python
def length_of_longest_substring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1
        char_index[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len
```
Time: O(n), Space: O(min(m, n)) where m is charset size

## Prefix Sum

Precompute cumulative sums for O(1) range sum queries.

```python
# Build prefix sum array
prefix = [0] * (n + 1)
for i in range(n):
    prefix[i + 1] = prefix[i] + arr[i]

# Range sum query [l, r] inclusive
def range_sum(l, r):
    return prefix[r + 1] - prefix[l]
```
Build: O(n), Query: O(1), Space: O(n)