import { useRouter } from "next/router";
import { List, Card, Image } from "antd";
import { SlideItem } from "@/config/home-page";
import styles from "@/pages/home/index.module.scss";
import { CONFIG } from "@/config";

interface MobileViewProps {
  slides: SlideItem[];
}

function MobileView({ slides }: MobileViewProps) {
  const router = useRouter();

  // 如果不是移动设备，不渲染移动视图
  if (!CONFIG.isMobile()) {
    return null;
  }

  document.body.style.overflow = "auto";

  return (
    <div className={styles.mobileContainer}>
      <h1 className={styles.mobileTitle}>最新文章</h1>
      <List
        itemLayout="vertical"
        dataSource={slides}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            onClick={() => {
              router.push(`/article-detail/${item.id}`);
            }}
            className={styles.mobileListItem}
          >
            <Card bordered={false} className={styles.mobileCard}>
              <div className={styles.mobileCardContent}>
                <div className={styles.mobileImageContainer}>
                  <Image
                    src={item.url}
                    alt={item.title}
                    preview={false}
                    className={styles.mobileImage}
                  />
                </div>
                <div className={styles.mobileTextContent}>
                  <h3 className={styles.mobileCardTitle}>{item.title}</h3>
                  <p className={styles.mobileCardDescription}>
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default MobileView;
