import Bytemd from "@/components/BytemdComponent";
import {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  useImperativeHandle,
  useState,
} from "react";
import { Divider, Steps } from "antd";

// bytemd底层用的是remark、rehype，因此查找rehype插件，这里用到的是 rehype-slug 插件, 该插件能获取到所有标题标签并为其添加id
import rehypeSlug from "rehype-slug";
import toc from "remark-extract-toc";
import markdown from "remark-parse";
import { unified } from "unified";
import styles from "./index.module.scss";

const getTocTree = (val: string): TocTree => {
  try {
    const processor = unified().use(markdown, { commonmark: true }).use(toc);
    const node = processor.parse(val);
    const tree = processor.runSync(node);
    return tree as unknown as TocTree;
  } catch (error) {
    return [];
  }
};

function getChildren(children: any[]) {
  if (children?.length) {
    const lis = children.map((item) => {
      const clazz = "d" + item.depth;
      return (
        <li className={clazz} key="index">
          {item.value}
          {getChildren(item.children)}
        </li>
      );
    });

    return <ul> {...lis} </ul>;
  }
  return <></>;
}

/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-07 23:27:25
 * @Description: 这是一个注释
 */
function Content(props, ref) {
  const [value, setValue] = useState<string>();

  const [doms, setDoms] = useState<ReactElement>();

  const childMethod = (value: string) => {
    const treeArray = getTocTree(value.file);

    if (treeArray.length) {
      const childrenDoms = getChildren(treeArray);
      debugger;
      setDoms(childrenDoms);
    }

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
      <div className={styles.fixed}>{doms}</div>
    </>
  );
}

export default forwardRef(Content);
