/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 18:18:03
 * @Description: 这是一个注释
 */
import React, { useEffect, useState } from "react";
import Bytemd from "@/components/BytemdComponent/index"; // 引入组件
const ArticleDetail: React.FC = (props) => {
  // 单独存取markdown值，因为我们不仅有新增还有编辑文章的场景
  const [value, setValue] = useState<string>(props?.fileData);
  useEffect(() => {
    // getDetail();
  }, []);
  // 获取数据
  return (
    <>
      {props.posts}
      <Bytemd value={value || ""} setValue={setValue} isReadonly />;
    </>
  );
};

// 此函数在构建时被调用
export async function getServerSideProps() {}

export default ArticleDetail;
