import Bytemd from "@/components/BytemdComponent";
import { forwardRef, useImperativeHandle, useState } from "react";
import styles from "./index.module.scss";
import { Divider } from "antd";

/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 22:47:35
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
      <div className={styles.container}>
        <div className={styles.title}> {value?.title} </div>
        <Divider />
        <Bytemd value={value?.file || ""} setValue={setValue} isReadonly />
      </div>
    </>
  );
}

export default forwardRef(Content);
