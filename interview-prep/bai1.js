/**
 * Bài 1: Merge hai mảng A và B đã sắp xếp tăng dần thành một mảng duy nhất vẫn được sắp xếp.
 *
 * Input:  A = [1, 3, 5], B = [2, 4, 6]
 * Output: [1, 2, 3, 4, 5, 6]
 */

function mergeSortedArrays(a, b) {
  const result = [];
  let i = 0;
  let j = 0;

  while( i < a.length && j < b.length) {
    if (a[i] < b[j]) {
      result.push(a[i]);
      i++;
    } else {
      result.push(b[j]);
      j++
    }
  }
  return result;
}

/**
 * Nâng cao: Không dùng mảng trung gian, merge B vào A tại chỗ (in-place).
 * Giả sử mảng A đã có đủ không gian trống ở cuối để chứa toàn bộ B.
 * m = số phần tử thực sự có trong A (phần còn lại là chỗ trống)
 * n = số phần tử trong B
 *
 * Input:  a = [1, 3, 5, 0, 0, 0], m = 3, b = [2, 4, 6], n = 3
 * Output: a = [1, 2, 3, 4, 5, 6]  (mutate a trực tiếp, không return mảng mới)
 */
function mergeSortedArraysInPlace(a, m, b, n) {
  i = m - 1;
  j = n - 1;
  k = (m + n) - 1;
  while(i >= 0 && j >= 0) {
    if (a[i] < b[j]) {
      a[k] = b[j];
      j--;
    } else {
      a[k] = a[i];
      i--;
    }
    k--;
  }

}

// ----- Test thử -----
console.log(mergeSortedArrays([1, 3, 5], [2, 4, 6]));

const a = [1, 3, 5, 0, 0, 0];
mergeSortedArraysInPlace(a, 3, [2, 4, 6], 3);
console.log(a);

module.exports = { mergeSortedArrays, mergeSortedArraysInPlace };
