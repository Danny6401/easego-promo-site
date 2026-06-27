# Easego Promo Site

Astro 靜態網站。專案內只保留 SEO / 靜態路由需要的索引資料；民宿詳細內容與圖片設定從 Cloudflare R2 讀取。

## 開發指令

```sh
npm install
npm run dev
npm run build
npm run preview
```

## 環境變數

本機建立 `.env`：

```env
PUBLIC_R2_BASE_URL=https://你的-r2-public-domain
PUBLIC_SITE_URL=https://你的正式網站網域
```

部署環境也要設定同一組變數。`PUBLIC_SITE_URL` 會用在 canonical、`og:url` 與相對路徑圖片的 `og:image`。

## R2 結構

每一間民宿使用同一個 slug 當資料夾名稱：

```txt
homestays/{slug}/detail.json
homestays/{slug}/images.json
homestays/{slug}/images/...
```

例如：

```txt
homestays/taitung-cape-morning/detail.json
homestays/taitung-cape-morning/images.json
homestays/taitung-cape-morning/images/cover.jpg
```

本機 `r2/` 目錄只是上傳用 payload，已被 `.gitignore` 忽略，不是網站資料來源。

## 資料分工

### 留在專案內

```txt
src/data/cooperation-regions.json
src/data/homestay-index.json
```

這兩份影響 SEO、靜態路由、列表卡片和地區歸類，所以留在 repo。

### 放在 R2

```txt
homestays/{slug}/detail.json
homestays/{slug}/images.json
homestays/{slug}/images/...
```

- `detail.json`：民宿詳細頁文字、房型、公告、訂房規則、位置說明。
- `images.json`：圖片檔名清單。
- `homestays/{slug}/images/`：實際圖片檔案。

Astro 會在 build 時 fetch R2 JSON，所以產出的 HTML 仍保留 SEO 內容。

## 圖片命名規則

建議每間民宿的圖片放在：

```txt
homestays/{slug}/images/
```

建議檔名：

```txt
logo.png
cover.jpg
about.jpg
slide-01.jpg
slide-02.jpg
slide-03.jpg
news-01.jpg
news-02.jpg
news-03.jpg
room-01-01.jpg
room-01-02.jpg
room-01-03.jpg
room-02-01.jpg
room-02-02.jpg
room-02-03.jpg
about.jpg
booking-panel.jpg
map-card.jpg
location-map.jpg
```

`images.json` 只需要填檔名，不需要填完整 URL：

```json
{
  "basePath": "homestays/taitung-cape-morning/images",
  "logo": "logo.png",
  "coverImage": "cover.jpg",
  "aboutImage": "about.jpg",
  "slides": ["slide-01.jpg", "slide-02.jpg", "slide-03.jpg"],
  "news": ["news-01.jpg", "news-02.jpg", "news-03.jpg"],
  "rooms": [
    ["room-01-01.jpg", "room-01-02.jpg", "room-01-03.jpg"],
    ["room-02-01.jpg", "room-02-02.jpg", "room-02-03.jpg"]
  ],
  "detailImages": {
    "aboutFallback": "about.jpg",
    "bookingPanel": "booking-panel.jpg",
    "mapCard": "map-card.jpg"
  },
  "locationMap": "location-map.jpg"
}
```

程式會自動組成：

```txt
{PUBLIC_R2_BASE_URL}/homestays/taitung-cape-morning/images/cover.jpg
```

如果某張圖片需要用外部完整 URL，也可以直接填 `https://...`，程式會直接使用。

### images.json 欄位用途

| 欄位 | 用途 |
| --- | --- |
| `logo` | 民宿詳細頁 header 左上角的民宿 logo。 |
| `coverImage` | 合作列表卡片、首頁精選合作旅宿、SEO og:image、地圖區域徽章照片。 |
| `aboutImage` | 民宿詳細頁「關於」區塊的大圖背景。 |
| `slides` | 民宿詳細頁最上方 hero 輪播背景圖，順序對應 `detail.json` 的 `slides`。 |
| `news` | 民宿詳細頁「最新消息」卡片圖片，順序對應 `detail.json` 的 `news`。 |
| `rooms` | 民宿詳細頁「客房介紹」房型輪播圖片；第一層是房型，第二層是該房型的圖片。 |
| `detailImages.aboutFallback` | 「關於」區塊 CSS 預設背景圖，通常可和 `aboutImage` 使用同一張或相近圖片。 |
| `detailImages.bookingPanel` | 「訂房資訊」區塊背景圖。 |
| `detailImages.mapCard` | 地圖卡片備用背景圖。 |
| `locationMap` | 民宿位置區塊的備用地圖圖片；目前主要顯示 Google Map iframe。 |

## 修改現有民宿

## 首頁精選與成功案例

首頁精選合作旅宿在：

```txt
src/data/site-content.js
```

設定 `homeContent.featuredPartnerSlugs`：

```js
featuredPartnerSlugs: [
  "peach-holiday-manoranor",
  "taitung-cape-morning"
]
```

首頁成功案例也在同一個檔案，設定 `homeContent.caseItems`。可以有多筆：

```js
caseItems: [
  {
    slug: "peach-holiday-manoranor",
    description: "透過聯合行銷推廣，平日訂房率穩定提升。",
    metrics: [
      { value: "35%", label: "訂房率成長" },
      { value: "28%", label: "官網轉換成長" }
    ]
  },
  {
    slug: "taitung-cape-morning",
    description: "精準導流帶動官網詢問與回訪。",
    metrics: [
      { value: "30%", label: "詢問成長" },
      { value: "22%", label: "回訪成長" }
    ]
  }
]
```

每一筆案例會自動使用該民宿的名稱、地區與封面圖。若要覆蓋標題或圖片，可加：

```js
title: "自訂案例標題",
image: "https://..."
```

### 1. 改列表 / SEO / 卡片資料

編輯：

```txt
src/data/homestay-index.json
```

常改欄位：

- `slug`
- `regionId`
- `name`
- `area`
- `address`
- `summary`
- `features`
- `startingPrice`
- `capacity`
- `roomCount`
- `rating`

`slug` 會影響網址，不要隨便改。若一定要改，也要同步改 R2 資料夾與地區設定。

### 2. 改民宿詳細頁文字

修改 R2 上的：

```txt
homestays/{slug}/detail.json
```

本機可先改上傳 payload：

```txt
r2/homestays/{slug}/detail.json
```

上傳範例：

```sh
wrangler r2 object put easego-assets/homestays/taitung-cape-morning/detail.json --file=r2/homestays/taitung-cape-morning/detail.json
```

### detail.json 欄位用途

| 欄位 | 必填 | 用途 |
| --- | --- | --- |
| `slug` | 是 | 民宿識別碼，要和 `homestay-index.json`、R2 資料夾名稱一致。 |
| `englishName` | 是 | 詳細頁 hero 區塊的小字英文名稱。 |
| `logo` | 否 | 民宿 logo 的 asset key；實際圖片由 `images.json` 的 `logo` 覆蓋。 |
| `googleMapEmbedUrl` | 否 | Google Maps iframe embed URL。可留空字串，程式會用 `homestay-index.json` 的 `address` 自動產生地圖查詢。 |
| `about` | 是 | 「關於」區塊的民宿介紹長文。 |
| `stats` | 是 | 「關於」區塊下方的三個統計數字，例如步行時間、房間數、評分。 |
| `bookingRows` | 是 | 「訂房資訊」左側表格，例如入住時間、退房時間、付款方式、聯絡方式。 |
| `bookingNotices` | 是 | 「訂房資訊」右側注意事項清單。超過 4 筆時頁面會收合。 |
| `contact` | 是 | 聯絡資訊，包含 `phone`、`line`、`email`。 |
| `links` | 是 | 側邊浮動按鈕的連結，包含 `reserve`、`booking`、`agoda`、`eztravel`、`facebook`、`instagram`、`line`。填空字串或 `#` 時不顯示該按鈕或圖示；`reserve` 控制 Reserve 按鈕，要連到頁面訂房區塊可填 `#booking`，要連外部訂房頁就填完整 URL。 |
| `slides` | 是 | 詳細頁最上方 hero 輪播文字。`image` 可填 asset key，實際圖片由 `images.json.slides` 覆蓋。 |
| `news` | 是 | 「最新消息」卡片資料。`date` 用 `YYYY-MM-DD`，`displayDate` 是畫面顯示文字。 |
| `rooms` | 是 | 「客房介紹」房型資料。每筆包含 `name`、`price`、`images`、`description`。實際房型圖片由 `images.json.rooms` 覆蓋。 |
| `location` | 是 | 「民宿位置」文字資料，包含 `label`、`description`、`transport`、`mapTitle`、`mapImage`。 |

`location.description` 和 `location.transport` 可以用 `\n` 換行：

```json
"transport": "自行開車可由台7線前往。\n搭乘大眾運輸可至桃園車站轉乘客運。\n山區道路彎曲，夜間行車請注意安全。"
```

`googleMapEmbedUrl` 範例：

```json
"googleMapEmbedUrl": "https://www.google.com/maps/embed?pb=..."
```

如果不確定要填什麼，可以先留空：

```json
"googleMapEmbedUrl": ""
```

`slides` 範例：

```json
{
  "title": "住進山林裡的假期",
  "subtitle": "適合親子旅行、朋友聚會與放鬆休息。",
  "image": "peach-holiday-manoranor.slides.0"
}
```

`rooms` 範例：

```json
{
  "name": "景觀雙人房",
  "price": "平日 NT$4,300 起",
  "images": [
    "peach-holiday-manoranor.rooms.0.0",
    "peach-holiday-manoranor.rooms.0.1"
  ],
  "description": "適合雙人入住，配置獨立衛浴與景觀窗。"
}
```

### 3. 改圖片檔名清單

修改 R2 上的：

```txt
homestays/{slug}/images.json
```

本機可先改上傳 payload：

```txt
r2/homestays/{slug}/images.json
```

上傳範例：

```sh
wrangler r2 object put easego-assets/homestays/taitung-cape-morning/images.json --file=r2/homestays/taitung-cape-morning/images.json
```

## 新增民宿

假設新民宿 slug 是：

```txt
new-homestay
```

### 1. 新增 index 資料

在：

```txt
src/data/homestay-index.json
```

新增一筆：

```json
{
  "slug": "new-homestay",
  "regionId": "north",
  "name": "新民宿名稱",
  "region": "北部",
  "area": "桃園市復興區",
  "address": "地址",
  "summary": "列表與 SEO 摘要",
  "coverImage": "new-homestay.cover",
  "features": ["特色一", "特色二"],
  "startingPrice": "NT$3,200 起",
  "capacity": "2-8 人",
  "roomCount": "4 間",
  "rating": "4.9"
}
```

### 2. 加到地區

編輯：

```txt
src/data/cooperation-regions.json
```

在對應地區加入 slug：

```json
{
  "id": "north",
  "homestaySlugs": [
    "new-homestay"
  ]
}
```

目前支援地區：

| id | 地區 |
| --- | --- |
| `north` | 北部 |
| `central` | 中部 |
| `south` | 南部 |
| `east` | 東部 |
| `islands` | 離島 |
| `overseas` | 國外 |

首頁小地圖只會顯示有民宿的地區，`homestaySlugs` 空陣列不會出現。

### 3. 建立並上傳 R2 detail JSON

建立：

```txt
r2/homestays/new-homestay/detail.json
```

上傳：

```sh
wrangler r2 object put easego-assets/homestays/new-homestay/detail.json --file=r2/homestays/new-homestay/detail.json
```

### 4. 建立並上傳 R2 images JSON

建立：

```txt
r2/homestays/new-homestay/images.json
```

上傳：

```sh
wrangler r2 object put easego-assets/homestays/new-homestay/images.json --file=r2/homestays/new-homestay/images.json
```

### 5. 上傳圖片檔案

圖片建議放到：

```txt
homestays/new-homestay/images/
```

例如：

```sh
wrangler r2 object put easego-assets/homestays/new-homestay/images/cover.jpg --file=local-images/new-homestay/cover.jpg
wrangler r2 object put easego-assets/homestays/new-homestay/images/about.jpg --file=local-images/new-homestay/about.jpg
```

### 6. 驗證

```sh
npm run build
```

成功後會產生：

```txt
/cooperation/new-homestay/
/cooperation/region/{regionId}/
```

## 注意事項

- `slug` 是最重要的關聯鍵，index、region、R2 detail JSON、R2 images JSON、圖片資料夾都要一致。
- `homestay-index.json` 的 `slug` 會決定 SEO 路由。
- R2 detail JSON 或 images JSON 缺少時，build 會失敗。
- `PUBLIC_R2_BASE_URL` 沒設定時，build 會失敗。
- `PUBLIC_SITE_URL` 沒設定時，canonical 與 `og:url` 可能會依 build 環境變成 localhost 或平台暫存網址。
- `.github/workflows/deploy.yml` 若有部署流程，記得在部署環境設定 `PUBLIC_R2_BASE_URL` 與 `PUBLIC_SITE_URL`。
