import Bytemd from "@/components/BytemdComponent";
import {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  useImperativeHandle,
  useRef,
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

function getChildren(children: any[], handleTocClick: (index: number[]) => void) {
  if (children?.length) {
    const lis = children.map((item) => {
      const clazz = "d" + item.depth;
      return (
        <li 
          className={clazz} 
          key={item.value}
          onClick={(e) => {
            handleTocClick(item.index)
          }}
        >
          {item.value}
          {getChildren(item.children, handleTocClick)}
        </li>
      );
    });

    return <ul> {lis} </ul>;
  }
  return <></>;
}

function addIndexToTreeArray(array, parentIndex = []) {
  return array.map((item, index) => {
    // 创建当前项的索引
    const currentIndex = [...parentIndex, index];
    
    // 复制当前项，避免直接修改原对象
    const newItem = { ...item };
    
    // 添加index属性
    newItem.index = currentIndex;
    
    // 如果存在children，递归处理
    if (Array.isArray(newItem.children) && newItem.children.length > 0) {
      newItem.children = addIndexToTreeArray(newItem.children, currentIndex);
    }
    
    return newItem;
  });
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

  let treeArray = useRef<any[]>([])

  const handleTocClick = (indexArray: number[]) => {

    
    let current = null
    for (let index = 0; index < indexArray.length; index++) {
      current = treeArray.current[indexArray[index]]
    }

    if (current) {
      const dom = document.getElementById('md-content')
      
      if (dom) {
        const doms = dom.querySelectorAll('h' + current.depth) || []
        
        for (let index = 0; index < doms.length; index++) {
          if (current.value === doms[index].innerText) {
            doms[index].scrollIntoView({
              behavior: 'smooth'
            })
          }
        }
      }
    }

    
  };

  const childMethod = (value: string) => {
     treeArray.current = addIndexToTreeArray(getTocTree(value.file))

    if (treeArray.current.length) {
      const childrenDoms = getChildren(treeArray.current, handleTocClick);
      setDoms(childrenDoms);
    }
    else {
      setDoms(<></>)
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
        <div id="md-content">
        <Bytemd value={value?.file || ""} setValue={setValue} isReadonly />
        </div>
      </div>
      <div className={styles.fixed}>{doms}</div>
    </>
  );
}

export default forwardRef(Content);
