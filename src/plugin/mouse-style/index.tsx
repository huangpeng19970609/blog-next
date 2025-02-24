import { throttle } from "lodash";

// 定义鼠标文字的枚举类型
enum MouseTextType {
  COPY = "COPY",
  LINK = "LINK",
  EDIT = "EDIT",
  DELETE = "DELETE",
}

class MouseStyleManager {
  private cursor: HTMLDivElement | null = null;
  private text: string = "";

  constructor() {
    // 确保代码只在客户端执行
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init(): void {
    // 创建鼠标样式元素
    this.cursor = document.createElement("div");
    this.cursor.className = "custom-mouse-cursor";
    document.body.appendChild(this.cursor);
    // 移除原有的style标签创建
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseover", this.throttledHandleMouseOver);
  }

  getCursor() {
    return this.cursor;
  }

  private handleMouseMove = (e: MouseEvent): void => {
    if (this.cursor) {
      this.cursor.style.left = `${e.clientX}px`;
      this.cursor.style.top = `${e.clientY}px`;
    }
  };

  // 原始的handleMouseOver方法
  private handleMouseOver = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;

    const mouseType = target.getAttribute("hp-mouse-name") as MouseTextType;
    if (mouseType) {
      // 添加全局类名
      document.body.classList.add("hp-global-mouse-alive");

      this.cursor.textContent = mouseType;
    } else {
      // 移除全局类名
      document.body.classList.remove("hp-global-mouse-alive");
      this.cursor.textContent = "";
    }
  };

  // 节流处理后的handleMouseOver
  private throttledHandleMouseOver = throttle(this.handleMouseOver, 500);

  public destroy(): void {
    if (typeof window !== "undefined") {
      if (this.cursor) {
        document.body.removeChild(this.cursor);
      }
      // 移除全局类名
      document.body.classList.remove("hp-global-mouse-alive");
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseover", this.throttledHandleMouseOver);
      // 取消节流函数
      this.throttledHandleMouseOver.cancel();
    }
  }
}

let mouseStyleManager: MouseStyleManager | null = null;

function initMouseStyleManager() {
  if (typeof window !== "undefined") {
    mouseStyleManager = new MouseStyleManager();
  }
}

export { mouseStyleManager, initMouseStyleManager };
