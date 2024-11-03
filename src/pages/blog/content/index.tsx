import Bytemd from "@/components/BytemdComponent";
import { commonFetch } from "@/fetch";
import { forwardRef, useImperativeHandle, useState } from "react";

/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 20:18:34
 * @Description: 这是一个注释
 */
function Content(props, ref) {
  const [value, setValue] = useState<string>();

  const childMethod = (value: string) => {
    setValue(value);
  };

  useImperativeHandle(ref, () => ({
    childMethod,
  }));

  return (
    <>
      1231412
      <Bytemd value={value || ""} setValue={setValue} isReadonly />;
    </>
  );
}

export default forwardRef(Content);
