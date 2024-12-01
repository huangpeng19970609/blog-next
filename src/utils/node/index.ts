/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 20:54:43
 * @Description: 这是一个注释
 */
import fs from "fs";
import getConfig from "next/config";
import path from "path";

export interface IFolder {
  name: string; // 添加文件名属性
  path: string; // 使用 path 而不是 folderPath，并存储相对路径
  stats: fs.Stats; // 保留文件统计信息
  extension?: string;
  children?: IFolder[]; // 文件夹的子项
}

function getFileTree(
  folderPath: string,
  basePath: string = process.cwd()
): Promise<IFolder[]> {
  const files: IFolder[] = [];

  // 转换 folderPath 为相对于 basePath 的路径，但使用正斜杠作为分隔符
  const relativePathParts = path.relative(basePath, folderPath).split(path.sep);
  const relativePath = relativePathParts.join("/");

  // 注意：这里我们仍然使用实际的绝对路径进行文件系统操作
  traverseFolder(relativePath, folderPath, basePath, files);

  return new Promise((resolve) => {
    resolve(files);
  });

  function traverseFolder(
    relativePath: string,
    absolutePath: string,
    basePath: string,
    target: IFolder[]
  ) {
    const stats = fs.statSync(absolutePath);
    const name = path.basename(absolutePath); // 获取文件名或文件夹名
    let extension: string | undefined;

    if (stats.isDirectory()) {
      // 这是一个文件夹
      const folder: IFolder = {
        name,
        // 注意：这里我们仍然使用之前构建好的 relativePath
        path: relativePath === "." ? "" : relativePath, // 根目录使用空字符串或根据需要调整
        stats,
        children: [],
      };
      target.push(folder);

      const items = fs.readdirSync(absolutePath);

      for (const itemName of items) {
        const itemPath = path.join(absolutePath, itemName);
        // 构建相对路径时，同样使用正斜杠作为分隔符
        const relativeItemPathParts = path
          .relative(basePath, itemPath)
          .split(path.sep);
        const relativeItemPath = relativeItemPathParts.join("/");

        traverseFolder(relativeItemPath, itemPath, basePath, folder.children!);
      }
    } else {
      // 提取文件后缀名
      const extName = path.extname(name);
      extension = extName ? extName.substring(1) : undefined; // 去掉前面的点

      const file: IFolder = {
        name,
        // 注意：这里我们仍然使用之前构建好的 relativePath（对于文件来说，它通常与父文件夹相同，除非它是根目录下的文件）
        path: relativePath, // 或者你可以考虑使用文件的相对路径，但这需要额外的逻辑来处理
        extension,
        stats,
      };
      target.push(file);
    }
  }
}
async function getFile(url: string) {
  const fs = require("fs").promises; // 使用 promises 版本的文件系统模块
  const path = require("path");

  // 指定文件路径
  // 注意：getConfig().serverRuntimeConfig 在 getStaticProps 中可能不可用，
  // 因为 getStaticProps 在构建时运行，而 serverRuntimeConfig 是为服务器运行时准备的。
  // 您可能需要将文件路径硬编码为构建时的相对路径，或者使用 publicRuntimeConfig。

  const runtimeConfig = getConfig().publicRuntimeConfig; // 或者使用 publicRuntimeConfig

  const projectRoot = runtimeConfig.PROJECT_ROOT; // 提供一个默认值以防未设置

  const filePath = path.join(projectRoot, url);

  // 使用 fs.promises.readFile 读取文件内容
  return await fs.readFile(filePath, "utf8");
}

export { getFileTree, getFile };
