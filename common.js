/* OWASP Top 10 CTF — 兩階段(找漏洞→修漏洞)。網頁只負責動手,詳細修復說明在簡報。 */
(function(){
  "use strict";
  window.LEVELS=[
    {code:"A01", nm:"Broken Access Control", en:"存取控制失效", file:"a01.html", goal:"讀出 admin 私密資料，再修好它"},
    {code:"A02", nm:"Security Misconfiguration", en:"安全設定錯誤", file:"a02.html", goal:"取得外洩的 DB 密碼，再修好它"},
    {code:"A03", nm:"Software Supply Chain Failures", en:"軟體供應鏈失效", file:"a03.html", goal:"找出後門套件，再升級修好"},
    {code:"A04", nm:"Cryptographic Failures", en:"加密機制失效", file:"a04.html", goal:"還原 admin 密碼，再改成安全雜湊"},
    {code:"A05·1", nm:"SQL Injection", en:"注入攻擊：SQL", file:"sqli.html", goal:"SQL 注入吐出全表，再改參數化修好"},
    {code:"A05·2", nm:"Command Injection", en:"注入攻擊：指令", file:"cmdi.html", goal:"指令注入讀檔，再用白名單修好"},
    {code:"A05·3", nm:"Reflected XSS", en:"注入攻擊：XSS", file:"xss.html", goal:"XSS 彈窗，再用輸出編碼修好"},
    {code:"A06", nm:"Insecure Design", en:"不安全設計", file:"a06.html", goal:"用生日接管帳號，再改安全流程"},
    {code:"A07", nm:"Authentication Failures", en:"認證失效", file:"a07.html", goal:"猜中弱密碼，再強化認證"},
    {code:"A08", nm:"Software or Data Integrity Failures", en:"軟體或資料完整性失效", file:"a08.html", goal:"裝進竄改更新檔，再啟用簽章驗證"},
    {code:"A09", nm:"Security Logging and Alerting Failures", en:"安全記錄與警示失效", file:"a09.html", goal:"發現沒日誌，再開啟記錄告警"},
    {code:"A10", nm:"Mishandling of Exceptional Conditions", en:"例外處理不當", file:"a10.html", goal:"讓系統噴機密，再加輸入驗證"}
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
  // 兩階段 UI 輔助
  function show(id,html){var e=document.getElementById(id);if(e){if(html!=null)e.innerHTML=html;e.classList.add("show");}}
  window.vulnUI={
    found:function(stepHTML){var a=document.getElementById("ph1"),b=document.getElementById("ph2"),f=document.getElementById("fix");
      if(a)a.className="phase done";if(b)b.className="phase active";if(f)f.hidden=false;show("step",stepHTML);},
    fixApplied:function(modeText,stepHTML){var m=document.getElementById("mode"),f=document.getElementById("fix");
      if(m){m.className="modebar safe";m.innerHTML=modeText;}if(f)f.hidden=true;show("step",stepHTML);},
    verified:function(stepHTML){var b=document.getElementById("ph2");if(b)b.className="phase done";show("step",stepHTML);markSolved();}
  };