/* OWASP Top 10 CTF — 共用邏輯:進度解鎖、頁首進度、過關。網頁只負責破關,原理與解法回簡報。 */
(function(){
  "use strict";
  window.LEVELS = [
    {code:"A01", nm:"存取控制失效", en:"Broken Access Control", file:"a01.html", goal:"讀出管理員 admin 的私密資料"},
    {code:"A02", nm:"安全設定錯誤", en:"Security Misconfiguration", file:"a02.html", goal:"找出外洩檔案裡的資料庫密碼"},
    {code:"A03", nm:"軟體供應鏈失效", en:"Software Supply Chain Failures", file:"a03.html", goal:"找出被植入後門的套件"},
    {code:"A04", nm:"加密機制失效", en:"Cryptographic Failures", file:"a04.html", goal:"還原 admin 的密碼"},
    {code:"A05·1", nm:"注入：SQL", en:"SQL Injection", file:"sqli.html", goal:"讓系統一次吐出全部使用者"},
    {code:"A05·2", nm:"注入：指令", en:"Command Injection", file:"cmdi.html", goal:"讓 Ping 工具列出主機檔案"},
    {code:"A05·3", nm:"注入：XSS", en:"Reflected XSS", file:"xss.html", goal:"讓頁面彈出警告視窗"},
    {code:"A06", nm:"不安全設計", en:"Insecure Design", file:"a06.html", goal:"接管同事 wang_ming 的帳號"},
    {code:"A07", nm:"認證失效", en:"Authentication Failures", file:"a07.html", goal:"猜中 admin 的密碼"},
    {code:"A08", nm:"完整性失效", en:"Software / Data Integrity Failures", file:"a08.html", goal:"安裝一個被竄改的更新檔"},
    {code:"A09", nm:"記錄與警示失效", en:"Security Logging & Alerting Failures", file:"a09.html", goal:"調查入侵，找出攻擊者"},
    {code:"A10", nm:"例外處理不當", en:"Mishandling of Exceptional Conditions", file:"a10.html", goal:"讓系統吐出內部機密"}
  ];
  function getSolved(){try{var c=localStorage.getItem("owasp_lab_solved");return new Set(c?JSON.parse(c):[]);}catch(e){return new Set();}}
  function save(s){try{localStorage.setItem("owasp_lab_solved",JSON.stringify([...s]));}catch(e){}}
  window.LAB={solved:getSolved,isUnlocked:function(i){if(i<=0)return true;return getSolved().has(i-1);},reset:function(){try{localStorage.removeItem("owasp_lab_solved");}catch(e){}}};
  window.renderProgress=function(){var n=getSolved().size,t=window.LEVELS.length;
    var a=document.getElementById("pnum");if(a)a.textContent=n;
    var b=document.getElementById("ptot");if(b)b.textContent=t;
    var f=document.getElementById("pfill");if(f)f.style.width=(t?n/t*100:0)+"%";};
  var path=(location.pathname.split("/").pop()||"index.html");
  window.CURRENT_IDX=window.LEVELS.findIndex(function(l){return l.file===path;});
  window.markSolved=function(){var i=window.CURRENT_IDX;if(i<0)return;var s=getSolved();s.add(i);save(s);renderProgress();
    var el=document.getElementById("success");if(el){el.classList.add("show");el.scrollIntoView({behavior:"smooth",block:"center"});}};
})();