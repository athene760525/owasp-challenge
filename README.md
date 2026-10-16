# OWASP Top 10 CTF（兩階段：找漏洞 → 修漏洞）

把 OWASP Top 10 做成動手闖關。每一關兩階段：
1. **找漏洞**：只給任務目標，自己試出攻擊、攻破它。
2. **修漏洞**：按「🔧 套用修復」把程式改成安全寫法，再用同一招攻一次——攻擊失效才算破關。

網頁只負責「動手找＋動手修」；**詳細修復原理與程式碼寫法放在課堂簡報**。

## 關卡（A01–A10，共 12 頁；A05 注入含 3 關）
a01 存取控制失效 / a02 安全設定錯誤 / a03 供應鏈失效 / a04 加密機制失效 /
sqli A05·1 SQL注入 / cmdi A05·2 指令注入 / xss A05·3 XSS /
a06 不安全設計 / a07 認證失效 / a08 完整性失效 / a09 記錄與警示失效 / a10 例外處理不當

## 檔案
- index.html 關卡地圖；style.css 樣式；common.js 進度解鎖＋兩階段 UI 輔助(vulnUI)
- 每關：<div class="task"> 任務；<div class="sandbox"> 互動；最下方 <script> 判定邏輯(fixed/found/verified)

## 安全聲明
全部為前端安全模擬：假資料、不連真實系統、不執行真實指令或腳本。僅供合法授權的教學環境學習。

## 預覽 / 發佈
VS Code + Live Server 開 index.html 預覽；整包 git push 後 GitHub Pages 自動更新。
