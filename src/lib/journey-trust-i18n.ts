import { driverGuideProof, hotelProof, vehicleProof } from "./journey-trust";

type Lang = "en" | "zh";

/**
 * Chinese copy for the journey trust modules (guide / vehicle / hotels).
 * Proper names (people, hotels, vehicle brands) stay in their original form —
 * we do not invent Chinese hotel names. English pages use the source data
 * unchanged.
 */

const zhGuideSlides = [
  { alt: "向导张子航的照片", title: "张子航（Jason）", detail: "英语司机兼向导 · 最终人选按你的日期确定", copy: "本地团队成员之一。你行程的具名向导以书面方案为准。" },
  { alt: "向导匡锦涛的照片", title: "匡锦涛（桃子）", detail: "中文司机兼向导 · 8 年带团经验", copy: "熟悉私家团与定制行程。" },
  { alt: "向导黄群的照片", title: "黄群（大象）", detail: "中文司机兼向导 · 7 年带团经验", copy: "熟悉私家团与研学行程。" },
];

const zhDriverGuide = {
  kicker: "01 / 你的司机兼向导",
  title: "一个熟悉这条路线的本地人",
  copy: "全程包含中文或英文司机兼向导：一位本地人负责开车、协调行程并讲解风土人情。这不等同于每个景区内的专职讲解员，如需景区专项讲解可在方案中另行安排。以下是团队成员示例，最终人选按你的日期确定，并在书面方案中具名。",
  label: "本地团队成员",
};

const zhVehicle = {
  kicker: "02 / 你的车辆",
  title: "五座或七座，按你的人数匹配。",
  copy: "七座车为人和行李留出更多空间，五座车适合人数较少的组合。以下车型来自合作车队目录，仅为示例，不承诺具体某一款；最终车辆以书面方案为准。",
  groups: {
    seven: {
      label: "7 座",
      carouselLabel: "七座车示例",
      slides: [
        { alt: "七座商务车示例，含外观与座椅布局", title: "七座商务车", detail: "示例 · 商务车", copy: "外观、独立座椅与后排空间。" },
        { alt: "七座大通 MPV 示例，含车厢与行李空间", title: "七座 MPV", detail: "示例 · 上汽大通", copy: "适合小型私家团的车厢与行李空间。" },
        { alt: "七座 MPV 外观、座椅与行李区示例", title: "七座车内部", detail: "示例 · MPV 座椅", copy: "更多内部空间示例，最终车辆按人数与行李确定。" },
      ],
    },
    five: {
      label: "5 座",
      carouselLabel: "五座车示例",
      slides: [
        { alt: "五座红旗轿车及后排座椅示例", title: "五座轿车", detail: "示例 · 红旗", copy: "适合人数较少组合的外观与后排空间。" },
        { alt: "五座广汽埃安 SUV 示例，含乘客座椅与前舱", title: "五座 SUV", detail: "示例 · 广汽埃安", copy: "另一种五座选择，展示外观与内部。" },
        { alt: "五座丰田 SUV 及乘客座椅示例", title: "五座 SUV", detail: "示例 · 丰田", copy: "车队目录中的另一款五座车型。" },
      ],
    },
  },
};

const zhHotelCommon = {
  kicker: "03 / 你的酒店",
  title: "酒店名称写进你的方案。",
  copy: "以下照片展示各目的地的酒店选项，仅为示例而非指定某一家。确认的酒店会在书面方案中具名；视日期与房态，也可能提供同档次的替代酒店。",
  groups: {
    kunming: {
      label: "昆明",
      carouselLabel: "昆明酒店示例",
      slides: [
        { alt: "昆明 Linyin Hotel（万象城店）外观", title: "Linyin Hotel · 万象城店", detail: "示例 · 昆明", copy: "Linyin Hotel 万象城店是昆明的备选之一；视日期与房态，也可能安排 Mehao Lizhi Hotel（海乐世界店）或同档次酒店。" },
        { alt: "昆明 Linyin Hotel（万象城店）客房", title: "Linyin Hotel · 万象城店", detail: "示例 · 昆明 · 客房", copy: "Linyin Hotel 的客房实景，确认的酒店以书面方案具名为准。" },
        { alt: "昆明 Linyin Hotel（万象城店）浴室", title: "Linyin Hotel · 万象城店", detail: "示例 · 昆明 · 浴室", copy: "昆明备选酒店的内部细节。" },
        { alt: "昆明 Linyin Hotel（万象城店）早餐厅", title: "Linyin Hotel · 万象城店", detail: "示例 · 昆明 · 早餐厅", copy: "酒店早餐厅实景，早餐是否包含以确认的套餐为准。" },
        { alt: "昆明 Linyin Hotel（万象城店）早餐出品", title: "Linyin Hotel · 万象城店", detail: "示例 · 昆明 · 早餐", copy: "Linyin Hotel 的早餐示例，确认的酒店与包含项目以方案为准。" },
        { alt: "昆明备选酒店的其他视角", title: "昆明备选酒店", detail: "示例 · 昆明", copy: "昆明备选酒店的更多照片，具体酒店以书面确认为准。" },
      ],
    },
    dali: {
      label: "大理",
      carouselLabel: "大理酒店示例",
      slides: [
        { alt: "大理 Liuhe Yunyan Hotel，住宿备选之一", title: "Liuhe Yunyan Hotel", detail: "示例 · 大理", copy: "Liuhe Yunyan Hotel 是大理的备选住宿之一，确认的酒店按你的日期在书面方案中具名。" },
        { alt: "大理 Liuhe Yunyan Hotel 客房", title: "Liuhe Yunyan Hotel", detail: "示例 · 大理 · 客房", copy: "大理备选酒店的客房实景，最终酒店以方案为准。" },
        { alt: "大理 Liuhe Yunyan Hotel 内部细节", title: "Liuhe Yunyan Hotel", detail: "示例 · 大理 · 内部", copy: "大理备选酒店的另一视角，必要时提供同档次替代。" },
        { alt: "大理 Liuhe Yunyan Hotel 设施", title: "Liuhe Yunyan Hotel", detail: "示例 · 大理 · 设施", copy: "酒店设施仅供参考，确认的住宿以书面方案为准。" },
        { alt: "大理 Liuhe Yunyan Hotel 内部", title: "Liuhe Yunyan Hotel", detail: "示例 · 大理", copy: "大理备选住宿示例，房态与最终房型以书面确认为准。" },
        { alt: "大理 Liuhe Yunyan Hotel 的另一视角", title: "Liuhe Yunyan Hotel", detail: "示例 · 大理", copy: "大理备选酒店的更多照片，最终酒店在方案中具名。" },
      ],
    },
    lijiang: {
      label: "丽江",
      carouselLabel: "丽江酒店示例",
      slides: [
        { alt: "丽江 Jieluofu Garden Hotel 外观", title: "Jieluofu Garden Hotel", detail: "示例 · 丽江", copy: "Jieluofu Garden Hotel 是丽江的优先示例；视日期与房态，也可能安排丽江国际酒店或同档次酒店。" },
        { alt: "丽江 Jieluofu Garden Hotel 客房", title: "Jieluofu Garden Hotel", detail: "示例 · 丽江 · 客房", copy: "Jieluofu Garden Hotel 的客房实景，确认的酒店以书面方案具名为准。" },
        { alt: "丽江 Jieluofu Garden Hotel 内部", title: "Jieluofu Garden Hotel", detail: "示例 · 丽江 · 内部", copy: "丽江优先备选酒店的另一视角。" },
        { alt: "丽江 Jieluofu Garden Hotel 设施", title: "Jieluofu Garden Hotel", detail: "示例 · 丽江 · 设施", copy: "酒店设施实景，最终房态与房型以书面确认为准。" },
        { alt: "丽江 Jieluofu Garden Hotel 的另一视角", title: "Jieluofu Garden Hotel", detail: "示例 · 丽江", copy: "Jieluofu Garden Hotel 的更多照片，必要时安排丽江国际酒店或同档次替代。" },
        { alt: "丽江 Jieluofu Garden Hotel 客房设施", title: "Jieluofu Garden Hotel", detail: "示例 · 丽江 · 设施", copy: "酒店设施仅供参考，最终酒店以方案为准。" },
        { alt: "丽江 Jieluofu Garden Hotel 内部视角", title: "Jieluofu Garden Hotel", detail: "示例 · 丽江 · 内部", copy: "丽江备选酒店的更多内部照片。" },
        { alt: "丽江 Jieluofu Garden Hotel 的更多照片", title: "Jieluofu Garden Hotel", detail: "示例 · 丽江", copy: "更多参考照片，你出行日期实际安排的酒店以书面确认为准。" },
      ],
    },
    "shangri-la": {
      label: "香格里拉",
      carouselLabel: "香格里拉酒店示例",
      slides: [
        { alt: "香格里拉 Yiting Hotel 夜景外观", title: "Yiting Hotel", detail: "示例 · 香格里拉", copy: "Yiting Hotel 是香格里拉的优先示例；视日期与房态，也可能安排 Lanou Hotel 或同档次酒店。" },
        { alt: "香格里拉 Yiting Hotel 双床房，窗外可见山景", title: "Yiting Hotel", detail: "示例 · 香格里拉 · 客房", copy: "Yiting Hotel 的双床房，可望向城镇与山景，确认的酒店以书面方案具名为准。" },
        { alt: "香格里拉 Yiting Hotel 双床房", title: "Yiting Hotel", detail: "示例 · 香格里拉 · 客房", copy: "Yiting Hotel 客房的另一视角，必要时安排 Lanou Hotel 或同档次替代。" },
        { alt: "香格里拉 Yiting Hotel 浴室与淋浴间", title: "Yiting Hotel", detail: "示例 · 香格里拉 · 浴室", copy: "Yiting Hotel 客房浴室，最终酒店以方案为准。" },
        { alt: "香格里拉 Yiting Hotel 梳妆台、衣柜与迷你吧", title: "Yiting Hotel", detail: "示例 · 香格里拉 · 浴室", copy: "Yiting Hotel 客房内的梳妆台、衣柜与迷你吧。" },
        { alt: "香格里拉 Yiting Hotel 早餐，窗外是山景", title: "Yiting Hotel", detail: "示例 · 香格里拉 · 早餐", copy: "Yiting Hotel 的早餐环境，早餐是否包含以确认的套餐为准。" },
      ],
    },
  },
};

export function getDriverGuideProof(lang: Lang) {
  if (lang !== "zh") return driverGuideProof;
  return {
    ...driverGuideProof,
    ...zhDriverGuide,
    slides: driverGuideProof.slides.map((slide, index) => ({ ...slide, ...zhGuideSlides[index] })),
  };
}

export function getVehicleProof(lang: Lang) {
  if (lang !== "zh") return vehicleProof;
  return {
    ...vehicleProof,
    kicker: zhVehicle.kicker,
    title: zhVehicle.title,
    copy: zhVehicle.copy,
    groups: vehicleProof.groups.map((group) => {
      const zh = zhVehicle.groups[group.id];
      return { ...group, label: zh.label, carouselLabel: zh.carouselLabel, slides: group.slides.map((slide, index) => ({ ...slide, ...zh.slides[index] })) };
    }),
  };
}

export function getHotelProof(lang: Lang) {
  if (lang !== "zh") return hotelProof;
  return {
    ...hotelProof,
    kicker: zhHotelCommon.kicker,
    title: zhHotelCommon.title,
    copy: zhHotelCommon.copy,
    groups: hotelProof.groups.map((group) => {
      const zh = zhHotelCommon.groups[group.id as keyof typeof zhHotelCommon.groups];
      return { ...group, label: zh.label, carouselLabel: zh.carouselLabel, slides: group.slides.map((slide, index) => ({ ...slide, ...zh.slides[index] })) };
    }),
  };
}
