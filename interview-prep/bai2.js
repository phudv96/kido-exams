/**
 * Bai 2: Cho mang prices, prices[i] la gia mua vang ngay thu i.
 * Toi da hoa loi nhuan bang cach chon MOT ngay mua va MOT ngay ban trong tuong lai.
 * Note: Mua truoc roi moi duoc ban sau?
 * 
 * Input:  prices = [7,1,5,3,6,4]
 * Output: 5  (mua ngay gia 1, ban ngay gia 6 => 6 - 1 = 5)
 */
function maxProfitOnce(prices) {
  let maxProfit = 0;
  let minPrice = prices[0];
 
  for(i = 1; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else if (prices[i] - minPrice > maxProfit){
      // lon hon, thi tinh Profit 
      maxProfit = prices[i] - minPrice
    }
  }
  return maxProfit;
}

/**
 * Nang cao: Duoc phep mua/ban nhieu lan, nhung tai 1 thoi diem chi giu toi da 1 don vi vang
 * (phai ban truoc khi mua lan tiep theo).
 *
 * Input:  prices = [7,1,5,3,6,4]
 * Output: 7  (mua 1 ban 5 lai +4, mua 3 ban 6 lai +3 => tong 7)
 */
function maxProfitMultiple(prices) {
  // Gia su profit duoc tinh la gia ngay hom sau se tang hon so voi gia mua ngay truoc do.
  let totalProfit = 0;

  for(let i = 1; i < prices.length ;i++) {
    if (prices[i] > prices [i-1]) {
      totalProfit += prices[i] - prices [i-1];
    }
  }
  return totalProfit;
}

// ----- Test thu -----
console.log(maxProfitOnce([7, 1, 5, 3, 6, 4])); // ky vong 5
console.log(maxProfitMultiple([7, 1, 5, 3, 6, 4])); // ky vong 7

module.exports = { maxProfitOnce, maxProfitMultiple };
