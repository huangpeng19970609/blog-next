import { Card, Row, Col } from "antd";
import { useRouter } from "next/router";
import styles from "./index.module.scss";

const GameHub = () => {
  const router = useRouter();

  const games = [
    {
      id: "dino",
      title: "暴龙快跑",
      description: "经典的 Chrome 离线小游戏",
      image: "/images/games/dino.jpg", // 需要添加对应的图片
    },
    // 在这里可以添加更多游戏
    {
      id: "interview",
      title: "面试",
      description: "面试题库",
      image: "/images/games/interview.jpg", // 需要添加对应的图片
    },
    {
      id: "vue-component-file",
      title: "vue组件文件",
      description: "vue组件文件",
      image: "/images/games/interview.jpg", // 需要添加对应的图片
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>模块中心</h1>
      <div className={styles.gameGrid}>
        {games.map((game) => (
          <Card
            hoverable
            cover={
              <img src={game.image} alt={game.title} style={{ width: 240 }} />
            }
            onClick={() => router.push(`/game/${game.id}`)}
            className={styles.gameCard}
          >
            <Card.Meta title={game.title} description={game.description} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GameHub;
