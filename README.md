# OWASP Top 10 CTF（純挑戰版）

把 OWASP Top 10 十大網站漏洞做成動手闖關：每一關只給**任務目標**，沒有提示、沒有答案，學員自己試出攻擊方式、拿到 flag 就過關。原理、原始碼分析與防禦，回到課堂簡報討論。

對應課程：網站威脅模式與分析 · OWASP Top 10 · Kali + Docker + DVWA 實作。

## 關卡（A01–A10，共 12 頁；A05 注入含 3 關）
- a01.html  A01 存取控制失效（讀出 admin 的私密資料）
- a02.html  A02 安全設定錯誤（找出外洩檔案裡的 DB 密碼）
- a03.html  A03 軟體供應鏈失效（找出被植入後門的套件）
- a04.html  A04 加密機制失效（還原 admin 的密碼）
- sqli.html A05·1 注入：SQL（讓系統吐出全部使用者）
- cmdi.html A05·2 注入：指令（讓 Ping 工具列出主機檔案）
- xss.html  A05·3 注入：XSS（讓頁面彈出警告視窗）
- a06.html  A06 不安全設計（接管 wang_ming 帳號）
- a07.html  A07 認證失效（猜中 admin 密碼）
- a08.html  A08 完整性失效（安裝被竄改的更新檔）
- a09.html  A09 記錄與警示失效（調查入侵、發現沒記錄）
- a10.html  A10 例外處理不當（讓系統吐出內部機密）

## 其他檔案
- index.html — 關卡地圖（依進度解鎖）
- style.css / common.js — 共用樣式與進度/解鎖邏輯

## 安全聲明
所有情境皆為**前端安全模擬**：使用假資料、不連真實系統、**不執行任何真實指令或腳本**。僅供在合法授權的教學環境中學習漏洞概念，請勿對未授權系統進行測試。

## 本機預覽 / 發佈
- 預覽：VS Code 裝 Live Server，對 index.html 按右鍵 → Open with Live Server。
- 發佈：整個資料夾 git push 後，GitHub Pages 自動更新，入口為 index.html。

## 改哪裡 / 加關卡
- 某關任務文字 → 該關 .html 的 `<div class="task">`
- 某關互動/判定 → 該關 .html 最下方 `<script>`
- 關卡清單、解鎖邏輯 → common.js 的 LEVELS 陣列（加一列即多一關，地圖自動長出）
- 顏色、版面 → style.css 最上方 :root
