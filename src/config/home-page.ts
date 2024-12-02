export interface ThemeConfig {
  bgColor: string;
  titleColor: string;
  fontColor: string;
  paddingColor: string;
}

export interface SlideItem {
  url: string;
  title?: string;
  description?: string;
}

export const homePageConfig = {
  themes: [
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
      bgColor: "rgb(122, 185, 224)",
      titleColor: "rgb(255, 247, 148)",
      fontColor: "white",
      paddingColor: "rgb(255, 247, 148)",
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
  
  slides: [
    {
      url: "/images/home/1.jpg",
      title: "自然风光",
      description: "壮丽的山川河流"
    },
    {
      url: "/images/home/2.jpg",
      title: "城市风貌",
      description: "现代都市的魅力"
    },
    {
      url: "/images/home/3.jpg",
      title: "文化遗产",
      description: "传统与现代的交融"
    },
    {
      url: "/images/home/4.jpg",
      title: "人文景观",
      description: "多彩的人文风情"
    },
    {
      url: "/images/home/5.jpg",
      title: "艺术创作",
      description: "独特的艺术表现"
    },
    {
      url: "/images/home/6.jpg",
      title: "科技创新",
      description: "未来科技展望"
    },
    {
      url: "/images/home/7.jpg",
      title: "生活方式",
      description: "现代生活的多样性"
    }
  ] as SlideItem[]
};
