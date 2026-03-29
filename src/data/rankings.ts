export interface RankedPrefecture {
  prefectureId: string;
  regionId: string;
  score: number;
  highlights: string[];
}

export interface RankingCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: RankedPrefecture[];
}

export const prefectureChineseName: Record<string, string> = {
  hokkaido: "北海道",
  aomori: "青森",
  iwate: "岩手",
  miyagi: "宮城",
  akita: "秋田",
  yamagata: "山形",
  fukushima: "福島",
  tokyo: "東京",
  kanagawa: "神奈川",
  chiba: "千葉",
  saitama: "埼玉",
  tochigi: "栃木",
  gunma: "群馬",
  ibaraki: "茨城",
  aichi: "愛知",
  shizuoka: "靜岡",
  yamanashi: "山梨",
  nagano: "長野",
  niigata: "新潟",
  toyama: "富山",
  ishikawa: "石川",
  fukui: "福井",
  gifu: "岐阜",
  kyoto: "京都",
  osaka: "大阪",
  nara: "奈良",
  hyogo: "兵庫",
  shiga: "滋賀",
  mie: "三重",
  wakayama: "和歌山",
  hiroshima: "廣島",
  okayama: "岡山",
  shimane: "島根",
  tottori: "鳥取",
  yamaguchi: "山口",
  ehime: "愛媛",
  kagawa: "香川",
  tokushima: "德島",
  kochi: "高知",
  fukuoka: "福岡",
  saga: "佐賀",
  nagasaki: "長崎",
  kumamoto: "熊本",
  oita: "大分",
  miyazaki: "宮崎",
  kagoshima: "鹿兒島",
  okinawa: "沖繩",
};

export const regionChineseName: Record<string, string> = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "關東",
  chubu: "中部",
  kinki: "近畿",
  chugoku: "中國",
  shikoku: "四國",
  kyushu: "九州・沖繩",
};

export const rankingCategories: RankingCategory[] = [
  {
    id: "most-popular",
    title: "最受歡迎",
    icon: "🏆",
    description: "台灣旅客最愛的人氣旅遊目的地",
    items: [
      { prefectureId: "tokyo", regionId: "kanto", score: 98, highlights: ["淺草寺", "秋葉原", "新宿"] },
      { prefectureId: "kyoto", regionId: "kinki", score: 95, highlights: ["清水寺", "伏見稻荷", "嵐山"] },
      { prefectureId: "osaka", regionId: "kinki", score: 93, highlights: ["道頓堀", "大阪城", "心齋橋"] },
      { prefectureId: "hokkaido", regionId: "hokkaido", score: 90, highlights: ["小樽運河", "富良野花田", "札幌雪祭"] },
      { prefectureId: "okinawa", regionId: "kyushu", score: 87, highlights: ["美麗海水族館", "國際通", "離島浮潛"] },
      { prefectureId: "fukuoka", regionId: "kyushu", score: 84, highlights: ["博多拉麵", "太宰府天滿宮", "中洲屋台"] },
      { prefectureId: "kanagawa", regionId: "kanto", score: 80, highlights: ["鎌倉大佛", "江之島", "箱根溫泉"] },
      { prefectureId: "nara", regionId: "kinki", score: 77, highlights: ["東大寺", "奈良公園鹿群", "春日大社"] },
      { prefectureId: "hiroshima", regionId: "chugoku", score: 74, highlights: ["嚴島神社", "原爆圓頂", "廣島燒"] },
      { prefectureId: "chiba", regionId: "kanto", score: 71, highlights: ["東京迪士尼", "成田山", "銚子海鮮"] },
    ],
  },
  {
    id: "hidden-gems",
    title: "私房秘境",
    icon: "💎",
    description: "避開人潮的絕美秘境與在地體驗",
    items: [
      { prefectureId: "shimane", regionId: "chugoku", score: 92, highlights: ["出雲大社", "足立美術館", "松江城"] },
      { prefectureId: "tottori", regionId: "chugoku", score: 89, highlights: ["鳥取砂丘", "浦富海岸", "大山"] },
      { prefectureId: "akita", regionId: "tohoku", score: 86, highlights: ["角館武家屋敷", "乳頭溫泉", "竿燈祭"] },
      { prefectureId: "kochi", regionId: "shikoku", score: 83, highlights: ["四萬十川", "桂濱", "鰹魚半敲燒"] },
      { prefectureId: "saga", regionId: "kyushu", score: 80, highlights: ["嬉野溫泉", "有田燒", "祐德稻荷神社"] },
      { prefectureId: "tokushima", regionId: "shikoku", score: 77, highlights: ["祖谷蔓橋", "阿波舞祭", "鳴門漩渦"] },
      { prefectureId: "fukui", regionId: "chubu", score: 74, highlights: ["東尋坊", "永平寺", "恐龍博物館"] },
      { prefectureId: "iwate", regionId: "tohoku", score: 71, highlights: ["平泉中尊寺", "碗子蕎麥麵", "淨土之濱"] },
      { prefectureId: "yamagata", regionId: "tohoku", score: 68, highlights: ["藏王樹冰", "銀山溫泉", "山寺"] },
      { prefectureId: "oita", regionId: "kyushu", score: 65, highlights: ["別府地獄巡禮", "由布院溫泉", "臼杵石佛"] },
    ],
  },
  {
    id: "food-paradise",
    title: "美食天堂",
    icon: "🍜",
    description: "饕客必訪的日本美食重鎮",
    items: [
      { prefectureId: "osaka", regionId: "kinki", score: 97, highlights: ["章魚燒", "大阪燒", "串炸"] },
      { prefectureId: "fukuoka", regionId: "kyushu", score: 94, highlights: ["博多拉麵", "明太子", "牛腸鍋"] },
      { prefectureId: "hokkaido", regionId: "hokkaido", score: 91, highlights: ["海鮮蓋飯", "成吉思汗烤肉", "湯咖哩"] },
      { prefectureId: "hiroshima", regionId: "chugoku", score: 87, highlights: ["廣島燒", "牡蠣料理", "紅葉饅頭"] },
      { prefectureId: "kagoshima", regionId: "kyushu", score: 84, highlights: ["黑豬涮涮鍋", "薩摩炸魚餅", "燒酎"] },
      { prefectureId: "aichi", regionId: "chubu", score: 81, highlights: ["味噌豬排", "鰻魚飯三吃", "手羽先"] },
      { prefectureId: "niigata", regionId: "chubu", score: 78, highlights: ["越光米", "日本酒", "笹團子"] },
      { prefectureId: "ishikawa", regionId: "chubu", score: 75, highlights: ["近江町市場", "金澤壽司", "加賀料理"] },
      { prefectureId: "kyoto", regionId: "kinki", score: 72, highlights: ["京懷石", "抹茶甜點", "湯豆腐"] },
      { prefectureId: "kumamoto", regionId: "kyushu", score: 69, highlights: ["馬肉刺身", "太平燕", "熊本拉麵"] },
    ],
  },
  {
    id: "nature",
    title: "自然絕景",
    icon: "🏔️",
    description: "令人屏息的自然風光與戶外體驗",
    items: [
      { prefectureId: "hokkaido", regionId: "hokkaido", score: 96, highlights: ["富良野花海", "知床半島", "美瑛青池"] },
      { prefectureId: "nagano", regionId: "chubu", score: 93, highlights: ["上高地", "輕井澤", "地獄谷野猿"] },
      { prefectureId: "okinawa", regionId: "kyushu", score: 90, highlights: ["慶良間藍海", "西表島紅樹林", "石垣島"] },
      { prefectureId: "kagoshima", regionId: "kyushu", score: 86, highlights: ["屋久島杉林", "櫻島火山", "奄美大島"] },
      { prefectureId: "yamanashi", regionId: "chubu", score: 83, highlights: ["富士山", "河口湖", "昇仙峽"] },
      { prefectureId: "shizuoka", regionId: "chubu", score: 80, highlights: ["三保松原", "伊豆半島", "富士山靜岡側"] },
      { prefectureId: "miyazaki", regionId: "kyushu", score: 77, highlights: ["高千穗峽", "鵜戶神宮", "日南海岸"] },
      { prefectureId: "aomori", regionId: "tohoku", score: 74, highlights: ["奧入瀨溪流", "白神山地", "十和田湖"] },
      { prefectureId: "toyama", regionId: "chubu", score: 71, highlights: ["立山黑部", "五箇山合掌村", "雨晴海岸"] },
      { prefectureId: "kumamoto", regionId: "kyushu", score: 68, highlights: ["阿蘇火山", "黑川溫泉", "菊池溪谷"] },
    ],
  },
];
