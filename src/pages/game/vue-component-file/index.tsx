import React from "react";
import { Card } from "antd";
import styles from "./index.module.scss";

function VueComponentFile() {
  // 若是开发环境
  const isDev = process.env.NODE_ENV === "development";
  const src = isDev
    ? "http://localhost:5173/"
    : "http://www.hppppp.com/vue-next/";

  return (
    <div className={styles.vueComponentContainer}>
      <iframe
        src={src}
        title="Vue Component Preview"
        style={{
          width: "100%",
          height: "calc(100vh - 100px)",
          border: "none",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}

export default VueComponentFile;
