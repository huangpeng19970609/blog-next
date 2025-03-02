// 第二次封装 - 功能污染 额外添加了标题栏
import {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Divider, Steps, notification } from "antd";
import { Editor, Viewer } from "@bytemd/react";
import zhHans from "bytemd/lib/locales/zh_Hans.json"; // 中文插件
import gfm from "@bytemd/plugin-gfm"; // 支持GFM
import highlight from "@bytemd/plugin-highlight"; // 代码高亮
import "highlight.js/styles/monokai-sublime.css"; // 代码高亮的主题样式(可自选)
import frontmatter from "@bytemd/plugin-frontmatter"; // 解析前题
import mediumZoom from "@bytemd/plugin-medium-zoom"; // 缩放图片
import "bytemd/dist/index.min.css"; // bytemd基础样式必须引入！！！
import "juejin-markdown-themes/dist/juejin.min.css"; // 掘金同款样式
import breaks from "@bytemd/plugin-breaks"; // 支持换行
import gemoji from "@bytemd/plugin-gemoji"; // 支持 emoji
import math from "@bytemd/plugin-math"; // 支持数学公式
import mermaid from "@bytemd/plugin-mermaid"; // 支持流程图
import "katex/dist/katex.css"; // 数学公式样式
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

// bytemd底层用的是remark、rehype，因此查找rehype插件，这里用到的是 rehype-slug 插件, 该插件能获取到所有标题标签并为其添加id
import rehypeSlug from "rehype-slug";
import toc from "remark-extract-toc";
import markdown from "remark-parse";
import { unified } from "unified";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { COMCOS } from "@/request";

const plugins = [
  gfm(), // GFM
  highlight(), // 代码高亮
  frontmatter(), // 解析前题
  mediumZoom(), // 图片缩放
  breaks(), // 支持换行
  gemoji(), // emoji表情
  math(), // 数学公式
  mermaid(), // 流程图
];

// 添加类型定义
interface TocItem {
  value: string;
  depth: number;
  children: TocItem[];
  index?: number[];
}

type TocTree = TocItem[];

const getTocTree = (val: string): TocTree => {
  try {
    const processor = unified().use(markdown, { commonmark: true }).use(toc);
    const node = processor.parse(val);
    const tree = processor.runSync(node);
    return tree as TocTree;
  } catch (error) {
    return [];
  }
};

function getChildren(
  children: any[],
  handleTocClick: (index: number[]) => void
) {
  if (children?.length) {
    const lis = children.map((item) => {
      const clazz = "d" + item.depth;
      return (
        <li
          className={styles[clazz]}
          key={item.value}
          onClick={(e) => {
            e.stopPropagation();
            handleTocClick(item.index);
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

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onUpload?: (formData: FormData) => Promise<{
    code: number;
    data: {
      filename: string;
      url: string;
    };
    message?: string;
  }>;
  readonly?: boolean;
}

const BytemdEditor: React.FC<EditorProps> = (props) => {
  const [doms, setDoms] = useState<ReactElement>();
  const treeArray = useRef<any[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasToc, setHasToc] = useState(false);

  useEffect(() => {
    updateTocTree(props.value);
  }, [props.value]);

  // indexarray 代表着要遍历的过程与方向
  const handleTocClick = (indexArray: number[]) => {
    let current = null;

    // 遍历indexArray数组
    for (let index = 0; index < indexArray.length; index++) {
      if (index === 0) {
        current = treeArray.current[indexArray[index]];
      }
      // 则递归自己
      else {
        current = current!.children[indexArray[index]];
      }
    }

    if (current) {
      const dom = document.getElementById("md-content");
      if (dom) {
        const doms = dom.querySelectorAll("h" + current.depth) || [];

        for (let index = 0; index < doms.length; index++) {
          if (current.value === doms[index].innerText) {
            const currentDom = doms[index];

            console.log(currentDom);

            currentDom.scrollIntoView({
              behavior: "smooth",
            });

            break;
          }
        }
      }
    }
  };

  const updateTocTree = (value: string) => {
    treeArray.current = addIndexToTreeArray(getTocTree(value));
    if (treeArray.current.length) {
      const childrenDoms = getChildren(treeArray.current, handleTocClick);
      setDoms(childrenDoms);
      setHasToc(true);
    } else {
      setDoms(<></>);
      setHasToc(false);
    }
  };

  if (props.readonly) {
    return (
      <div className={styles.mdViewer} id="md-content">
        <Viewer value={props.value} plugins={plugins} />
        {hasToc && (
          <div
            className={`${styles.fixed} ${isCollapsed ? styles.collapsed : ""}`}
          >
            <div
              className={styles["collapse-btn"]}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            {!isCollapsed && doms}
          </div>
        )}
      </div>
    );
  }

  const onChange = (v: string) => {
    updateTocTree(v);
    props.onChange(v);
  };

  return (
    <div className={styles["article-base-container"]}>
      <div id="md-content">
        <Editor
          locale={zhHans}
          plugins={plugins}
          value={props.value}
          onChange={onChange}
          style={{ height: "100%" }}
          uploadImages={async (files: File[]) => {
            if (!props.onUpload) {
              notification.error({
                message: "未配置图片上传功能",
              });
              return [];
            }

            const results = await Promise.all(
              files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                const response = await props.onUpload(formData);

                debugger;

                if (response.code === 200) {
                  notification.success({
                    message: "图片上传成功",
                  });
                  const data = response.data;
                  return {
                    title: data.filename,
                    url: COMCOS.UploadImagePrefix + data.url,
                  };
                } else {
                  notification.error({
                    message: response.message || "图片上传失败",
                  });
                  return null;
                }
              })
            );

            return results.filter(Boolean);
          }}
        />
      </div>
      {hasToc && (
        <div
          className={`${styles.fixed} ${isCollapsed ? styles.collapsed : ""}`}
        >
          <div
            className={styles["collapse-btn"]}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          {!isCollapsed && doms}
        </div>
      )}
    </div>
  );
};

export default BytemdEditor;
