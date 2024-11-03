// 冒泡第一位  次数: n - 1
// 冒泡第二位  次数: n - 2
// 冒泡第三位


// 思路: 如果前一个元素大于后一个元素，就交换它们的位置

// 简单 但是性能很低,在数据量大时刻尤其明显

// ⭐ O (n²)
function swap(array, a, b) {
  [array[a], array[b]] = [array[b], array[a]];
}
function bubleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] > array[j]) {
        swap(array, i, j);
      }
    }
  }
  return array;
}


function bubleSortMe(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] > array[j]) {
        [array[i], array[j]] = [array[j], array[i]]
      }
    }
  }
  return array
}
console.log(bubleSortMe([2, 3, 1, 0, 4]))

































