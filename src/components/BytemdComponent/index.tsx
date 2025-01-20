/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-07 23:41:36
 * @Description: 这是一个基础功能拓展 （ 关于bytedmd基础自身实现都在这里 ）
 */
import React, { useRef } from "react";
import { Editor, Viewer } from "@bytemd/react";
import zhHans from "bytemd/lib/locales/zh_Hans.json"; // 中文插件
import gfm from "@bytemd/plugin-gfm"; // 支持GFM
import highlight from "@bytemd/plugin-highlight"; // 代码高亮
import "highlight.js/styles/monokai-sublime.css"; // 代码高亮的主题样式(可自选)
import frontmatter from "@bytemd/plugin-frontmatter"; // 解析前题
import mediumZoom from "@bytemd/plugin-medium-zoom"; // 缩放图片
import "bytemd/dist/index.min.css"; // bytemd基础样式必须引入！！！
import "juejin-markdown-themes/dist/juejin.min.css"; // 掘金同款样式
import { notification } from "antd";
import breaks from "@bytemd/plugin-breaks"; // 支持换行
import gemoji from "@bytemd/plugin-gemoji"; // 支持 emoji
import math from "@bytemd/plugin-math"; // 支持数学公式
import mermaid from "@bytemd/plugin-mermaid"; // 支持流程图
import "katex/dist/katex.css"; // 数学公式样式

interface EditorProps {
  value: string;
  setValue: any;
  onUpload?: (formData: FormData) => Promise<{
    code: number;
    data: {
      filename: string;
      url: string;
    };
    message?: string;
  }>;
}
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
const Bytemd: React.FC<EditorProps & { isReadonly?: boolean }> = (props) => {
  if (props.isReadonly) {
    return (
      <div className="md-viewer">
        <Viewer value={props.value} plugins={plugins} />
      </div>
    );
  }

  const onChange = (v) => {
    props.setValue(v);
  };

  return (
    <>
      <Editor
        locale={zhHans}
        plugins={plugins}
        value={props.value}
        onChange={onChange}
        uploadImages={async (files: File[]) => {
          try {
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
                  const data = response.data;
                  return {
                    title: data.filename,
                    url: data.url,
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
          } catch (error) {
            notification.error({
              message: "图片上传出错",
              description: error.message,
            });
            return [];
          }
        }}
      />
    </>
  );
};
export default Bytemd;
