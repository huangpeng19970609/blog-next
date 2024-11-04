import Bytemd from "@/components/BytemdComponent";
import { forwardRef, useImperativeHandle, useState } from "react";
import styles from "./index.module.scss";
import { Divider, Steps } from "antd";

/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-04 23:58:21
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
  const description = "This is a description.";
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}> {value?.title} </div>
        <Divider />
        <Bytemd value={value?.file || ""} setValue={setValue} isReadonly />
        <div className={styles.step}>
          <Steps
            direction="vertical"
            size="small"
            current={1}
            items={[
              { title: "Finished", description },
              {
                title: "In Progress",
                description,
              },
              {
                title: "Waiting",
                description,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default forwardRef(Content);
