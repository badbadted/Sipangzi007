你是一位滑步車賽事資訊系統開發專家。

    # 專案語境
    我們正在開發「滑步車賽事資訊系統」，風格為滑步車賽事資訊系統。

# 技術偏好

- 使用 TypeScript 確保型別安全。
- 圖片路徑：預設放在 /public/images/ 資料夾下。
- 使用 Tailwind CSS 進行樣式設計。
- 使用 Firebase 進行資料庫管理。

# 目錄結構（大方向）

- `src/`：主要程式碼
  - `components/`：共用 UI 元件（按功能或頁面分子資料夾）。
  - `pages/`：頁面元件（前台賽事列表、後台管理等）。
  - `hooks/`：自訂 hooks（資料、篩選、表單等）。
  - `lib/`：Firebase 初始化、工具函式、API 封裝。
  - `types/`：TypeScript 型別（賽事、API 回傳等）。
  - `routes/`：React Router 設定（若獨立成檔）。
  - `styles/`：全域或共用樣式（若需額外 CSS）。
- `public/`：靜態資源；圖片放 `public/images/`。
- 環境變數：Firebase 等設定放 `.env`，勿提交 `.env.local` 等含密鑰的檔案。

# 設計風格（UI 規範）

- 中性色：統一使用 Tailwind `slate-*` 色系，不使用 `gray-*`。
- 主色：主要操作按鈕使用 `blue-600` / `blue-700`，focus 使用 `ring-blue-500`。
- 狀態色：
  - 成功／完成使用 `green-*`。
  - 檢錄使用 `purple-*`。
  - 終點抄錄使用 `orange-*`。
  - 頒獎使用 `yellow-*`。
  - 刪除／危險使用 `red-*`。
- 圓角規則：
  - 大卡片／主要區塊：`rounded-2xl`
  - 一般卡片：`rounded-xl`
  - 按鈕與輸入框：`rounded-lg`
  - 小徽章／圓形圖示：`rounded-full`
- 文字層級：
  - 頁面與模組標題使用 `font-black`。
  - 按鈕與重要標籤使用 `font-bold`。
  - 次要說明與空狀態文字使用 `text-slate-500` 或 `text-slate-400`。
- 表單元件：
  - 輸入框與 textarea 使用 `border border-slate-300 rounded-lg`。
  - 焦點態統一使用 `focus:outline-none focus:ring-2 focus:ring-blue-500`。

# 程式碼風格

- 使用 React 19 開發。
- 使用 Vite 進行建置。
- 使用 Lucide React 進行圖示。
- 使用 React Hook Form 進行表單管理。
- 使用 React Query 進行資料管理。
- 使用 React Router 進行路由管理。
- 使用 React Toastify 進行提示管理。
- 使用 React Icons 進行圖示管理。
- 使用 React Datepicker 進行日期選擇管理。
- 使用 React Select 進行選擇管理。
- 使用 React Table 進行表格管理。
- 使用 React Modal 進行彈窗管理。
- 使用 React Tooltip 進行提示管理。
- 使用 React Confirm Dialog 進行確認管理。

# 要開發的功能

以下為開發時依序或並行實作的指令清單，回應與註解使用繁體中文。

**1. 資料與型別**

- 在 `src/types/event.ts` 定義賽事型別：`id`、`name`（賽事名稱）、`eventDate`（比賽日期，YYYY-MM-DD）、`location`（地點）、`isDomestic`（boolean，true=國內、false=國外），選用 `createdAt`、`updatedAt`。
- Firestore 賽事集合命名為 `events`，文件欄位與上述型別一致。

**2. 前台：賽事列表頁**

- 頁面路徑：例如 `/` 或 `/events`，依 React Router 設定。
- 從 Firebase（Firestore 或 Realtime Database）讀取賽事列表；若經後端 API 則呼叫 GET 列表 API。
- 每筆顯示：賽事名稱、比賽日期、地點、國內/國外標籤（例如「國內」／「國外」或 badge）。
- 使用 functional components，列表與篩選邏輯可抽成 custom hooks。

**3. 前台：篩選功能**

- 篩選條件：國內/國外（切換或下拉）、日期區間（fromDate～toDate）、地點關鍵字、賽事名稱關鍵字。
- 篩選變更時重新查詢（Firestore `where`/`orderBy` 或 API query 參數：`isDomestic`、`fromDate`、`toDate`、`location`、`keyword`）。
- 空狀態：無賽事時顯示友善說明（例如「目前沒有符合條件的賽事」），樣式依 UI 規範（如 `text-slate-500`）。

**4. 後台：登入**

- 後台入口路徑：例如 `/admin` 或 `/admin/login`。
- 使用 Firebase Auth 登入；僅登入成功者可進入後台賽事管理。
- 登入狀態以 context 或 React Query 等管理，未登入則導向登入頁。

**5. 後台：賽事管理（CMS）**

- 路徑：例如 `/admin/events`。
- 列出所有賽事（表格或卡片），支援新增、編輯、刪除。
- 新增/編輯表單欄位：賽事名稱、比賽日期、地點、國內/國外（勾選或下拉）。
- 送出時寫入 Firestore 集合 `events`（或呼叫 POST/PUT API）；刪除時從 Firestore 刪除（或呼叫 DELETE API）。
- 表單使用 React Hook Form；刪除前以 React Confirm Dialog 確認；成功/錯誤以 React Toastify 提示。

**6. Firebase 與安全**

- 賽事讀取：前台可讀 `events`；寫入（新增/編輯/刪除）僅限已登入後台使用者。
- 在 Firebase Console 設定 Firestore Security Rules：依「僅已驗證且為後台角色可寫、其餘可讀或僅讀」原則撰寫（具體規則依你專案角色設計）。
- 環境變數：Firebase 設定放 `.env`，勿提交 `.env.local`；若使用 `firebase-admin`，以服務帳號或 ADC 初始化。

**7. 共用與風格**

- 所有 UI 依 `.cursorrules` 的設計風格（slate 色系、blue 主色、圓角、字級、表單 focus 等）。
- 圖片路徑：`/public/images/`。
- 目錄結構依 `.cursorrules` 的目錄結構大方向（`src/components`、`pages`、`hooks`、`lib`、`types` 等）。

# 賽事列表：前台緊湊列表（作法 A）

**目標**

- 前台賽事列表改為「緊湊列表」呈現，一屏可顯示較多筆。
- 日期放在第一欄並視覺強調，方便快速掃到日期。

**實作步驟**

1. **新增 `src/components/events/EventList.tsx`**
   - 接收 `events: Event[]`，用 `<table>` 或一列一 `<div>` 的 list 呈現。
   - 欄位順序：**比賽日期**（第一欄）→ 賽事名稱 → 地點 → 國內/國外（Badge）。
   - 日期欄：字體加粗或略大、可加 Calendar 圖示，讓日期最醒目。
   - 每列一筆，列高壓縮（例如 `py-3`），一屏可顯示約 15–20+ 筆。
   - 樣式依專案 `.cursorrules`：slate 色系、rounded-xl、border、表頭 font-bold、列 hover（如 `hover:bg-slate-50`）。
   - 此為前台元件，**不要**放編輯/刪除按鈕（後台才用 EventTable）。

2. **修改 `src/pages/EventsPage.tsx`**
   - 當 `events.length > 0` 時，改為渲染 `<EventList events={events} />`，不再使用 `EventCard` 網格（`grid` + `EventCard`）。
   - 空狀態、loading、error 的邏輯與 UI 維持不變。

3. **日期格式與視覺**
   - 列表內日期可維持 `YYYY-MM-DD` 或改為 `YYYY/MM/DD`，同一格式即可。
   - 重點：第一欄 + 字體/顏色略突出，方便「快速看到日期」。

4. **響應式**
   - 小螢幕可縮欄或允許表格橫向捲動，以「一屏多筆」為優先；若改為堆疊式列表，仍保持「日期 | 名稱 | 地點 | 類型」的資訊順序。

**驗收**

- 前台賽事列表為緊湊列表，日期在第一欄且較醒目。
- 一屏可見筆數明顯多於原本卡片網格。
- 沿用既有 `events` 資料與排序（已依日期由大到小），不需改 API；可選保留 EventCard 供他處或日後切換使用。
