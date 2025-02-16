interface IConfig {
  isDevelopment: boolean;
}

const CONFIG: IConfig = {
  isDevelopment: process.env.NODE_ENV === "development",
};

export { CONFIG };
