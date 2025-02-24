import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import BackButton from "@/components/back-button";

const DinoGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 游戏状态
  let gameStarted = false;
  let gameOver = false;
  let score = 0;

  // 恐龙状态
  let dinoY = 200;
  let jumpSpeed = 0;
  const gravity = 0.6;
  const jumpStrength = -12;
  let isJumping = false;

  // 障碍物状态
  let obstacles: { x: number; width: number; height: number }[] = [];
  const obstacleSpeed = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 游戏循环
    const gameLoop = () => {
      if (!ctx) return;

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制地面
      ctx.beginPath();
      ctx.moveTo(0, 250);
      ctx.lineTo(canvas.width, 250);
      ctx.stroke();

      // 绘制恐龙
      ctx.fillStyle = "#000";
      ctx.fillRect(50, dinoY, 40, 40);

      if (gameStarted && !gameOver) {
        // 更新恐龙位置
        if (isJumping) {
          jumpSpeed += gravity;
          dinoY += jumpSpeed;

          if (dinoY >= 200) {
            dinoY = 200;
            isJumping = false;
            jumpSpeed = 0;
          }
        }

        // 生成障碍物
        if (Math.random() < 0.02) {
          obstacles.push({
            x: canvas.width,
            width: 20,
            height: 40,
          });
        }

        // 更新和绘制障碍物
        obstacles = obstacles.filter((obstacle) => {
          obstacle.x -= obstacleSpeed;
          ctx.fillRect(obstacle.x, 210, obstacle.width, obstacle.height);

          // 碰撞检测
          if (
            50 < obstacle.x + obstacle.width &&
            90 > obstacle.x &&
            dinoY + 40 > 210
          ) {
            gameOver = true;
          }

          return obstacle.x > -obstacle.width;
        });

        // 更新分数
        score++;
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${Math.floor(score / 10)}`, 10, 30);
      }

      if (gameOver) {
        ctx.fillStyle = "#000";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText(
          "Press Space to restart",
          canvas.width / 2 - 100,
          canvas.height / 2 + 40
        );
      }

      requestAnimationFrame(gameLoop);
    };

    // 键盘事件监听
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (!gameStarted) {
          gameStarted = true;
        } else if (gameOver) {
          // 重置游戏
          gameOver = false;
          score = 0;
          obstacles = [];
          dinoY = 200;
        } else if (!isJumping) {
          isJumping = true;
          jumpSpeed = jumpStrength;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <BackButton />
      <div className={styles.gameContainer}>
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className={styles.gameCanvas}
        />
        {!gameStarted && (
          <div className={styles.startMessage}>按空格键开始游戏</div>
        )}
      </div>
    </>
  );
};

export default DinoGame;
