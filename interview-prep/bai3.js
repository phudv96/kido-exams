/**
 * Bai 3: Tim 2 phan tu trong mot mang "TANG DAN" co tong bang k.
 *
 * Input:  arr = [1, 2, 3, 4, 6], k = 6
 * Output: [2, 4]
 */
function twoSumSorted(arr, k) {
  // TODO: dung 2 con tro left = 0, right = arr.length - 1
  // neu arr[left] + arr[right] === k => tra ve ket qua
  // neu tong < k => left++, neu tong > k => right--
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let total = arr[left] + arr[right];
    if (total === k) {
      return [arr[left], arr[right]];
    }

    if (total < k) {
      left ++;
    } else {
      right --;
    }
  }

  

  return [];
}

/**
 * Nang cao: Tim 3 phan tu trong mang co tong bang k (mang khong nhat thiet da sort).
 *
 * Input:  arr = [1, 2, 3, 4, 6], k = 9
 * Output: [1, 2, 6]  (hoac bo 3 so bat ky co tong = 9)
 */
function threeSum(arr, k) {
  // for (let i = 0; i < arr.length; i++) {
  //   for (let j = i + 1; j < arr.length; j++) {
  //     for (let m = j + 1; m < arr.length; m++) {
  //       if (arr[i] + arr[j] + arr[m] === k ) {
  //         return [arr[i], arr[j], arr[m]];
  //       }
  //     }
  //   }
  // }
  // su dung two pointer.
  const sorted = [...arr].sort((a, b) => a - b);

  for (let i = 0; i < sorted.length - 2; i++ ) {
    let left = i + 1;
    let right = sorted.length - 1;

    while (left < right) {
      const total = sorted[i] + sorted[left] + sorted[right];
      if (total === k) {
        return [sorted[i], sorted[left], sorted[right]];
      }
      if (total < k) {
        left ++;
      } else {
        right --;
      }
    }
  }

  return [];
}

// ----- Test thu -----
console.log(twoSumSorted([1, 2, 3, 4, 6], 6)); // ky vong [2, 4]
console.log(threeSum([1, 2, 3, 4, 6], 7)); // ky vong [1, 2, 6]

module.exports = { twoSumSorted, threeSum };
