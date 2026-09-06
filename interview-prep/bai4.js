/**
 * Bai 4: Cho chuoi s. Kiem tra xem chuoi co phai la chuoi doi xung (palindrome) khong.
 *
 * Input:  s = "radar"  -> Output: true
 * Input:  s = "hello"  -> Output: false
 */
function isPalindrome(s) {
  // TODO: dung 2 con tro left = 0, right = s.length - 1, so sanh tu ngoai vao trong
  let left = 0;
  let right = s.length - 1;

  while (left <= right) {
    if (s[left] != s[right]) {
      return false;
    }
    left++;
    right--;
    return true;
  }

  return false;
}

/**
 * Nang cao: Dem so chuoi con doi xung co trong chuoi s.
 *
 * Input:  s = "aaa"
 * Output: 6  ("a", "a", "a", "aa", "aa", "aaa")
 */
function countPalindromicSubstrings(s) {
  let count = 0;

  function isPalindrome(s) {
    return s === s.split('').reverse().join('');
  }
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const subStr = s.slice(i, j+1);
      if (isPalindrome(subStr)) {
        console.log(subStr)
        count++;
      }
    }
  }
  return count;
}

// ----- Test thu -----
console.log(isPalindrome("radar")); // ky vong true
console.log(isPalindrome("hello")); // ky vong false
console.log(countPalindromicSubstrings("aaa")); // ky vong 6

module.exports = { isPalindrome, countPalindromicSubstrings };
