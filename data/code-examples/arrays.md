# Arrays — Code Examples & Patterns

## Two Pointer Technique

### Two Sum (Sorted Array)
```python
def two_sum(nums: list[int], target: int) -> list[int]:
    """Find two numbers that add up to target in sorted array."""
    left, right = 0, len(nums) - 1
    while left < right:
        current = nums[left] + nums[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1
        else:
            right -= 1
    return []
```

```java
public int[] twoSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left, right};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}
```

### Remove Duplicates from Sorted Array
```python
def remove_duplicates(nums: list[int]) -> int:
    """Remove duplicates in-place. Returns new length."""
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write
```

---

## Sliding Window

### Maximum Sum Subarray of Size K
```python
def max_sum_subarray(nums: list[int], k: int) -> int:
    """Find maximum sum of any contiguous subarray of size k."""
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

```java
public int maxSumSubarray(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int maxSum = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
```

### Longest Substring Without Repeating Characters
```python
def length_of_longest_substring(s: str) -> int:
    """Sliding window with hash set to track characters in window."""
    char_set = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len
```

---

## Prefix Sum

### Range Sum Query
```python
class NumArray:
    """Prefix sum for O(1) range sum queries."""
    def __init__(self, nums: list[int]):
        self.prefix = [0]
        for n in nums:
            self.prefix.append(self.prefix[-1] + n)

    def sum_range(self, left: int, right: int) -> int:
        return self.prefix[right + 1] - self.prefix[left]
```

### Equilibrium Index
```python
def equilibrium_index(nums: list[int]) -> int:
    """Find index where left sum equals right sum."""
    total = sum(nums)
    left_sum = 0
    for i, n in enumerate(nums):
        if left_sum == total - left_sum - n:
            return i
        left_sum += n
    return -1
```

---

## Array Manipulation Patterns

### Rotate Array
```python
def rotate(nums: list[int], k: int) -> None:
    """Rotate array right by k steps. O(n) time, O(1) space."""
    n = len(nums)
    k %= n
    # Reverse entire array, then reverse each half
    nums.reverse()
    nums[:k] = reversed(nums[:k])
    nums[k:] = reversed(nums[k:])
```

### Merge Sorted Arrays
```python
def merge_sorted(a: list[int], b: list[int]) -> list[int]:
    """Merge two sorted arrays into one sorted array."""
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result
```

### Dutch National Flag (Sort 0s, 1s, 2s)
```python
def sort_colors(nums: list[int]) -> None:
    """Sort array of 0s, 1s, 2s in one pass."""
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```