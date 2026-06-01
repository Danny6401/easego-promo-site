# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Cooperation Homestay Data

配合民宿資料放在 `src/data/cooperation-homestays.json`，頁面會直接 mapping 這份 JSON。

### 頁面路由

| Route | Description |
| :-- | :-- |
| `/cooperation/` | 配合民宿列表頁，依區域顯示所有民宿卡片 |
| `/cooperation/region/{id}/` | 單一地區完整列表頁，列出該區所有民宿 |
| `/cooperation/{slug}/` | 單一民宿詳細頁，使用原本民宿頁版型 |

首頁「精選合作旅宿」與 `/cooperation/` 列表卡片都會連到 `/cooperation/{slug}/`。
`/cooperation/` 每個地區最多顯示 4 筆，同一行排列；更多資料可從地區的「查看更多 / 查看全部」進入完整列表。

### 分區

`regions` 目前分為：

| id | label |
| :-- | :-- |
| `north` | 北部 |
| `central` | 中部 |
| `south` | 南部 |
| `east` | 東部 |
| `islands` | 離島 |
| `overseas` | 國外 |

### 民宿欄位

新增民宿時，在對應 `region.homestays` 裡新增一筆物件：

| Field | Required | Description |
| :-- | :-- | :-- |
| `slug` | yes | 唯一識別字，使用英文小寫與 `-`，例如 `taitung-cape-morning` |
| `name` | yes | 民宿中文名稱 |
| `logo` | no | 民宿 logo 圖片 URL；沒有 logo 時，單一民宿頁 header 會自動使用 `name` 第一個字作為 avatar |
| `englishName` | yes | Hero eyebrow 英文名稱 |
| `region` | yes | 區域文字：北部 / 中部 / 南部 / 東部 / 離島 / 國外 |
| `area` | yes | 顯示用地點，例如 `台東成功` |
| `address` | yes | 完整地址 |
| `googleMapEmbedUrl` | no | Google Maps iframe embed URL. 從 Google Maps「分享」→「嵌入地圖」複製 iframe 後，填入 `src` 的 URL；留空時介紹頁會用 `address` 連到 Google Maps 搜尋。 |
| `summary` | yes | 列表卡片簡短介紹 |
| `about` | yes | 關於民宿段落 |
| `coverImage` | yes | 列表卡片主圖 URL |
| `gallery` | yes | 民宿公共空間或環境照片陣列，至少 1 張 |
| `features` | yes | 標籤陣列，例如 `["海岸步行", "在地早餐"]` |
| `startingPrice` | yes | 起始價格文字 |
| `capacity` | yes | 可入住人數文字 |
| `roomCount` | yes | 房間數文字 |
| `rating` | yes | 評分文字 |
| `stats` | yes | 關於區塊的數字資料，格式 `{ "value": "...", "label": "..." }` |
| `bookingRows` | yes | 訂房資訊列，格式 `{ "label": "...", "value": "..." }` |
| `bookingNotices` | yes | 訂房須知文字陣列 |
| `contact` | yes | 聯絡資訊：`phone`、`line`、`email` |
| `links` | yes | 外部連結：`booking`、`agoda`、`eztravel`、`facebook`、`instagram`、`line` |
| `slides` | yes | Hero 輪播，格式 `{ "title": "...", "subtitle": "...", "image": "..." }` |
| `news` | yes | 最新消息，格式 `{ "date": "YYYY-MM-DD", "displayDate": "YYYY.MM.DD", "title": "...", "description": "...", "image": "..." }` |
| `rooms` | yes | 房型陣列，含 `name`、`price`、`images`、`description` |
| `location` | yes | 位置資訊：`label`、`description`、`transport`、`mapTitle`、`mapImage` |

`featuredSlug` 可作為預設精選民宿識別，值要對應某一筆民宿的 `slug`。

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
