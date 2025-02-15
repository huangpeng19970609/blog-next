export interface ThemeConfig {
  bgColor: string;
  titleColor: string;
  fontColor: string;
  paddingColor: string;
}

export interface SlideItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export const homePageConfig = {
  themes: [
    {
      bgColor: "rgb(122, 185, 224)",
      titleColor: "rgb(255, 247, 148)",
      fontColor: "white",
      paddingColor: "rgb(255, 247, 148)",
    },
    {
      bgColor: "rgb(61, 102, 129)",
      titleColor: "rgb(213, 222, 221)",
      fontColor: "white",
      paddingColor: "rgb(213, 222, 221)",
    },
    {
      bgColor: "rgb(245, 248, 255)",
      titleColor: "red",
      fontColor: "black",
      paddingColor: "red",
    },
    {
      bgColor: "rgb(194, 55, 90)",
      titleColor: "rgb(210, 210, 210)",
      fontColor: "white",
      paddingColor: "rgb(210, 210, 210)",
    },
    {
      bgColor: "rgb(1, 90, 98)",
      titleColor: "rgb(204, 186, 142)",
      fontColor: "white",
      paddingColor: "rgb(204, 186, 142)",
    },
    {
      bgColor: "white",
      titleColor: "rgb(255, 111, 100)",
      fontColor: "black",
      paddingColor: "rgb(255, 111, 100)",
    },
    {
      bgColor: "rgb(242, 125, 181)",
      titleColor: "rgb(102, 255, 222)",
      fontColor: "white",
      paddingColor: "rgb(102, 255, 222)",
    },
  ] as ThemeConfig[],
};
