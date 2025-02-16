import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

interface ImageLoadingProps {
  className?: string;
  style?: React.CSSProperties;
}

const ImageLoading: React.FC<ImageLoadingProps> = ({ className, style }) => {
  return (
    <div className={`${styles.imageLoading} ${className || ''}`} style={style}>
      <SmileOutlined className={styles.icon} />
      <p className={styles.text}>图片加载中...</p>
    </div>
  );
};

export default ImageLoading;
