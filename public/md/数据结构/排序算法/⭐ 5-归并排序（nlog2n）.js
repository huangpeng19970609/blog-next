// nlogn 一个有实际意义的排序 => O(nlogN)
/* 
  归: 拆分=> 形如二叉树
  并: 合并
*/
// 大数组 => 拆分为小数组 => 在对小数组们进行排序 => 重复如此,直至只有一项
// 只有一项后便进行合并[这是递归栈的形式实现]
function mergeSort(arr) {
  const {
    length
  } = arr;
  if (length <= 1) return arr;
  const middle = Math.floor(length / 2);
  const left = mergeSort(arr.slice(0, middle));
  const right = mergeSort(arr.slice(middle));
  arr = merge(left, right);
  return arr;
}

// 如何实现内部的排序的? 若
function merge(left, right) {
  let i = 0;
  let j = 0;
  const result = [];

  // left 数组与right数组 谁更小就先放谁
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  // 最终有一些内容没有进入 直接并入进来(后续的一定是一个顺序的)
  if (i < left.length) return result.concat(left.slice(i));
  else return result.concat(right.slice(j));
}

let arr = [2, 2, 1, 100];
arr = mergeSort(arr);
console.log(arr);