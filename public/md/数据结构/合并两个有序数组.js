var merge = function (nums1, m, nums2, n) {

  // 数组一的指针
  let pointLeft = 0

  // 数组二的指针
  let pointRight = 0

  const total = m >= n ? n : m

  const result = []

  // 最小长度一定走完了自己的比较
  for (let i = 0; i < total; i++) {

    const value1 = nums1[pointLeft]

    const value2 = nums2[pointRight]

    // 优先走左
    if (value1 >= value2) {
      result.push(value2)
      pointRight++
    }
    // 走右
    else {
      result.push(value1)
      pointLeft++
    }
  }


  let newPoint = 0

  let targetArr = []

  let len = 0

  // 此时数组二已经走完
  if (m < n) {
    newPoint = pointLeft

    targetArr = nums1

    len = m
  }
  // 数组一已经走完
  else {
    newPoint = pointRight

    targetArr = nums2

    len = n
  }

  for (let i = newPoint; i < targetArr.length; i++) {
    result.push(targetArr[i])
  }
  return result
};


console.log(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3))