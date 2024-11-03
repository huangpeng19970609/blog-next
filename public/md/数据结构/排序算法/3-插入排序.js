// 插入是形容 【交换】这个动作
// 插入比较 越插越多 越比越多
// 这种思想非常像冒泡
/* 
  无序的元素插入到有序的元素序列中，插入后仍然有序
*/
function insertSort(nums) {
  let temp;
  for (let i = 1; i < nums.length; i++) {
    let j = i;
    temp = nums[i];
    // 移动所有大于它的值 向后面移动
    while (j > 0 && nums[j - 1] > temp) {
      nums[j] = nums[j - 1];
      j--;
    }
    nums[j] = temp;
  }
}
/* 
  i = j
  j = 1      
        nums[0] > nums[i] 
  i = 1
  j = 2
        nums[1] > nums[2]
        nums[0] > nums[1]  
  i = 2
  j = 3
        nums[2] > nums[3]
        nums[1] > nums[2]
        nums[0] > nums[1]
*/
let arr = [0, 9, 8, 1, 3, 19000, 0, 1.2];
insertSort(arr);
console.log(arr);





function insertSortMe(array) {


  for (let i = 1; i < array.length; i++) {


    const value = array[i]


    let j = i

    while (j > 0 && array[j - 1] > value) {

      array[j] = array[j - 1]
      j--
    }

    array[j] = value
  }

}

let arr1 = [0, 9, 8, 1, 3, 19000, 0, 1.2];
insertSortMe(arr1);
console.log(arr1);