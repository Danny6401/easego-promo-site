import { sitePath } from "./assets.js";

export const pageMeta = {
  default: {
    title: "Easego 聯合行銷合作旅宿",
    description:
      "Easego 聯合行銷整合合作旅宿、多平台曝光與精準導流，協助旅宿品牌提升能見度、訂房率與長期營運成效。",
  },
  home: {
    title: "Easego 聯合行銷合作旅宿｜攜手共創・放大價值・一起成長",
    description:
      "Easego 聯合行銷整合合作旅宿、多平台曝光、精準客群導流與專人行銷支援，協助旅宿品牌提升訂房率與長期營運成效。",
  },
  cooperation: {
    title: "Easego 合作旅宿｜精選合作旅宿列表",
    description:
      "瀏覽 Easego 聯合行銷合作旅宿，依地區探索精選民宿、旅宿特色、房型資訊與訂房連結。",
  },
  region: (region) => ({
    title: `Easego ${region.label}合作旅宿｜精選${region.label}住宿`,
    description: `探索 Easego ${region.label}合作旅宿，查看精選住宿、旅宿特色、價格資訊與訂房連結。`,
  }),
  homestay: (homestay) => ({
    title: `${homestay.name}｜Easego 合作旅宿`,
    description: homestay.summary,
    image: homestay.coverImage,
  }),
};

export const homeContent = {
  regionClassNames: {
    north: "north",
    central: "central",
    south: "south",
    east: "east",
    islands: "islands",
    overseas: "overseas",
  },
  featuredPartnerSlugs: ["peach-holiday-manoranor"],
  caseItems: [
    {
      slug: "peach-holiday-manoranor",
      description: "透過聯合行銷推廣，平日訂房率穩定提升。",
      metrics: [
        { value: "35%", label: "訂房率成長" },
        { value: "28%", label: "官網轉換成長" },
      ],
    },
    {
      slug: "taitung-cape-morning",
      description: "精準廣告投放，帶來更多高品質訂單。",
      metrics: [
        { value: "35%", label: "訂房率成長" },
        { value: "28%", label: "官網轉換成長" },
      ],
    },
  ],
  advantages: [
    {
      title: "多平台聯合曝光",
      description: "整合多元平台資源，擴大品牌能見度，精準觸及目標客群。",
      icon: "megaphone",
    },
    {
      title: "精準客群導流",
      description: "數據驅動行銷，將對的旅客帶到你的旅宿，提升訂房轉換。",
      icon: "target",
    },
    {
      title: "提升訂房率",
      description: "優化曝光與轉換流程，有效提升官網與平台訂房量。",
      icon: "growth",
    },
    {
      title: "長期合作共贏",
      description: "建立穩定合作關係，互相成長，創造長期價值。",
      icon: "care",
    },
    {
      title: "專人行銷支援",
      description: "專職行銷顧問服務，提供活動規劃與行銷建議。",
      icon: "headset",
    },
    {
      title: "安心透明合作",
      description: "合作流程透明公開，成效數據清楚可見，安心可靠。",
      icon: "shield",
    },
  ],
};

export const getHomeNavItems = () => [
  { label: "合作旅宿", href: sitePath("cooperation/") },
  { label: "合作優勢", href: "#advantages" },
  { label: "成功案例", href: "#cases" },
  { label: "加入我們", href: "#contact" },
];

export const getHomeStats = ({ homestayCount, regionCount }) => [
  {
    value: `${homestayCount}`,
    suffix: "+",
    label: "累積合作旅宿",
    icon: "building",
  },
  { value: `${regionCount}`, suffix: "+", label: "區域合作據點", icon: "user" },
  { value: "多平台曝光", suffix: "", label: "精準行銷推廣", icon: "megaphone" },
];

export const getRegionBadges = (regions) =>
  regions
    .filter((region) => region.homestays.length > 0)
    .map((region) => ({
      id: region.id,
      label: region.label,
      count: region.homestays.length,
      className: homeContent.regionClassNames[region.id] ?? region.id,
      image: region.homestays[0]?.coverImage,
    }));

export const getFeaturedPartners = ({ homestaysBySlug, homestayUrl }) =>
  homeContent.featuredPartnerSlugs
    .map((slug) => homestaysBySlug.get(slug))
    .filter(Boolean)
    .map((homestay) => ({
      name: homestay.name,
      location: homestay.area,
      rating: homestay.rating,
      roomCount: homestay.roomCount,
      summary: homestay.summary,
      href: homestayUrl(homestay.slug),
      image: homestay.coverImage,
    }));

export const getHomeCases = ({ homestaysBySlug, fallbackHomestay }) => {
  const configuredCases = homeContent.caseItems
    .map((item) => {
      const homestay = homestaysBySlug.get(item.slug);

      if (!homestay) {
        return null;
      }

      return {
        title: item.title ?? `${homestay.area}．${homestay.name}`,
        description: item.description,
        image: item.image ?? homestay.coverImage,
        metrics: item.metrics,
      };
    })
    .filter(Boolean);

  if (configuredCases.length > 0 || !fallbackHomestay) {
    return configuredCases;
  }

  return [
    {
      title: `${fallbackHomestay.area}．${fallbackHomestay.name}`,
      description: "透過聯合行銷推廣，平日訂房率穩定提升。",
      image: fallbackHomestay.coverImage,
      metrics: [
        { value: "35%", label: "訂房率成長" },
        { value: "28%", label: "官網轉換成長" },
      ],
    },
  ];
};

export const getHomestayNavItems = (listUrl) => [
  { label: "最新消息", href: "#news" },
  { label: "關於我們", href: "#about" },
  { label: "客房介紹", href: "#rooms" },
  { label: "訂房資訊", href: "#booking" },
  { label: "民宿位置", href: "#location" },
  { label: "回列表", href: listUrl },
];
