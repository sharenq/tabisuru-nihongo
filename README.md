# 旅する日本語 (Tabisuru Nihongo)

互動式日本旅遊日文學習網站。透過點擊日本地圖或選擇地區，學習各地旅遊實用單字。

## 功能

- **互動式日本地圖** — 點擊 8 大地區，深入 47 個都道府縣
- **450+ 旅遊單字** — 涵蓋美食、觀光、交通、購物、住宿、實用等分類
- **翻轉卡片學習** — 正面顯示日文，翻轉查看中文、平假名、羅馬拼音
- **Edge TTS 語音** — 使用 Microsoft Edge TTS（ja-JP-NanamiNeural）自然日語發音
- **選擇題測驗** — 日→中、中→日、羅馬拼音→中 三種題型
- **學習進度追蹤** — 標記已學會的單字，進度自動儲存於瀏覽器
- **深色模式** — 支援淺色/深色切換，自動偵測系統偏好
- **手機響應式設計** — 完整支援行動裝置瀏覽

## 技術棧

- React 19 + TypeScript
- Tailwind CSS 4
- Vite 8
- Microsoft Edge TTS (msedge-tts)

## 開始使用

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 語音生成

語音檔已預先生成並包含在 `public/audio/` 目錄中。若修改或新增單字後需重新生成：

```bash
npm run generate-audio
```

使用 `ja-JP-NanamiNeural` 語音，以平假名作為輸入確保發音正確。

## 專案結構

```
src/
├── components/
│   ├── JapanMap.tsx          # SVG 互動式日本地圖
│   ├── RegionDetail.tsx      # 地區頁（顯示所屬縣市列表）
│   ├── PrefectureDetail.tsx  # 縣市頁（單字卡片、搜尋、分類）
│   ├── RegionList.tsx        # 首頁地區列表
│   ├── WordCard.tsx          # 翻轉單字卡片
│   ├── SearchBar.tsx         # 搜尋欄
│   └── Quiz.tsx              # 選擇題測驗
├── data/
│   └── regions.ts            # 地區、縣市、單字資料
├── hooks/
│   ├── useProgress.ts        # 學習進度（localStorage）
│   ├── useSpeech.ts          # 語音播放（Edge TTS + Web Speech API fallback）
│   └── useDarkMode.ts        # 深色模式切換
├── App.tsx                   # 主應用程式與路由
└── main.tsx                  # 進入點
scripts/
└── generate-audio.ts         # Edge TTS 音檔生成腳本
public/
└── audio/                    # 預先生成的 MP3 語音檔
```

## License

MIT
