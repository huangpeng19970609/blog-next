/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @Description: 文件上传组件
 */
import { Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { useState } from 'react';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { API_CONFIG } from '@/config/api';
import { http } from '@/fetch'; // 假设这是您封装的请求方法

const { Dragger } = Upload;

export default function FileUpload() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    customRequest: async (options) => {
      const { file, onSuccess, onError, onProgress } = options;
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await http.post(`${API_CONFIG.BASE_URL}upload`, formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            onProgress?.({ percent });
          },
        }); 
        
        onSuccess?.(response, file as any);
      } catch (error) {
        onError?.(error as any);
      }
    },
    onChange(info) {
      const { status } = info.file;
      
      // 更新文件列表
      setFileList(info.fileList);

      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onDrop(e) {
      console.log('拖拽文件:', e.dataTransfer.files);
    },
  };

  // 添加下载处理函数
  const handleDownload = async (filename: string) => {
    try {
      const response = await http.get(`${API_CONFIG.BASE_URL}download/${filename}`, {
        responseType: 'blob', // 设置响应类型为 blob
      });
      
      // 创建 Blob 对象
      const blob = new Blob([response.data]);
      
      // 创建下载链接
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename; // 设置下载文件名
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理 URL 对象
      window.URL.revokeObjectURL(downloadUrl);
      
      message.success('文件下载成功');
    } catch (error) {
      message.error('文件下载失败');
      console.error('下载错误:', error);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持单个或批量上传，严禁上传公司数据或其他违禁文件
        </p>
      </Dragger>
      
      {/* 添加下载按钮示例 */}
      <Button 
        onClick={() => handleDownload('科目三的学习.md')}
        style={{ marginTop: '16px' }}
      >
        下载示例文件
      </Button>
    </div>
  );
}