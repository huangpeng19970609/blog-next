/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-07 23:41:36
 * @Description: 这是一个注释
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

interface EditorProps {
  value: string;
  setValue: any;
}
const plugins = [
  gfm(), // GFM
  highlight(), // 代码高亮
  frontmatter(), // 解析前题
  mediumZoom(), // 图片缩放
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
        // uploadImages={async (files: any) => {
        //   let imgUrl = "";
        //   let fromData = new FormData();
        //   fromData.append("uploadImg", files[0]);
        //   const res = await uploadImg(fromData);
        //   if (res && res.code === 200) {
        //     imgUrl = res.data; // 这里是上传成功后，服务端返回的图片地址
        //   } else {
        //     notification.error({
        //       message: "图片上传失败",
        //     });
        //   }
        //   return [
        //     {
        //       title: files.map((i) => i.name),
        //       url: imgUrl,
        //     },
        //   ];
        // }}
      />
    </>
  );
};
export default Bytemd;
