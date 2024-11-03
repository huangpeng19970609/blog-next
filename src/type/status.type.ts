/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-11-03 16:51:32
 * @Description: 这是一个注释
 */

// 定义文件和文件夹类型的枚举
enum FileType {
  // 文件夹
  FOLDER = "folder",
  // 文件类型
  FILE = "file",
}

// 定义文件/文件夹结构的接口
interface FileOrFolder {
  name: string;
  type: FileType;
  children?: FileOrFolder[]; // 仅在类型为 FOLDER 时使用
}

export { FileType };
export type { FileOrFolder };
