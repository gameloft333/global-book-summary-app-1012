interface GalleryConfig {
  imageCount: number;
  imagePath: string;
  quoteCount: number;
  quotes: {
    content: string;
    author: string;
    work: string;
  }[];
}

export const galleryConfig: GalleryConfig = {
  imageCount: 3,
  imagePath: '/gallery',
  quoteCount: 1,
  quotes: [
    {
      content: "所有的伟大的行动和思想，都有一个微不足道的开始。",
      author: "阿尔贝·加缪",
      work: "局外人"
    },
    // ... 更多名言
  ]
};

