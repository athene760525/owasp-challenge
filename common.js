/* OWASP Top 10 資安實作 — 兩階段(找漏洞→修漏洞)。網頁只負責動手,詳細修復說明在簡報。 */
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
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function renderCodeFix(wrap,cf,onCorrect){
    var h='<div class="q">🔍 這是這一關後端<b>有漏洞的程式碼</b>（'+esc(cf.lang)+'）。先<b>點出造成漏洞的那一行</b>：</div>';
    h+='<div class="code" id="code"></div>';
    h+='<div class="fixpick" id="fixpick" hidden></div><div class="fixfb" id="fixfb"></div>';
    wrap.innerHTML=h;wrap.hidden=false;
    var code=document.getElementById("code"),pick=document.getElementById("fixpick"),fb=document.getElementById("fixfb"),lineDone=false;
    cf.lines.forEach(function(ln,i){
      var row=document.createElement("div");row.className="ln";
      row.innerHTML='<span class="lno">'+(i+1)+'</span><span class="lc">'+esc(ln)+'</span>';
      row.onclick=function(){
        if(lineDone)return;
        if(i===cf.bad){lineDone=true;row.classList.add("bad");
          fb.className="fixfb ok";fb.textContent="✓ 沒錯，問題就在這一行！接著選出正確的修法。";showPick();}
        else{row.classList.add("miss");setTimeout(function(){row.classList.remove("miss");},520);
          fb.className="fixfb no";fb.textContent="✗ 這一行沒問題，再找找。";}
      };
      code.appendChild(row);
    });
    function showPick(){
      var order=cf.fixes.map(function(f){return{t:f[0],ok:!!f[1]};});
      for(var k=order.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),tmp=order[k];order[k]=order[j];order[j]=tmp;}
      var html='<div class="q">🔧 這一行該怎麼改才真正安全？點一個：</div>';pick.innerHTML=html;
      order.forEach(function(o){var b=document.createElement("div");b.className="fixcard";b.setAttribute("data-ok",o.ok?"1":"0");
        b.innerHTML='<code>'+esc(o.t)+'</code>';
        b.onclick=function(){
          if(pick.classList.contains("done"))return;
          if(o.ok){pick.classList.add("done");b.classList.add("ok");
            fb.className="fixfb ok";fb.textContent="✓ 正確！正在套用這個修法…";setTimeout(function(){wrap.hidden=true;onCorrect();},550);}
          else{b.classList.add("wrong");fb.className="fixfb no";fb.textContent="✗ 這個改法擋不住這種攻擊，再想想。";}
        };
        pick.appendChild(b);});
      pick.hidden=false;
    }
  }
  window.vulnUI={
    found:function(stepHTML){var a=document.getElementById("ph1"),b=document.getElementById("ph2");
      if(a)a.className="phase done";if(b)b.className="phase active";show("step",stepHTML);
      var wrap=document.getElementById("fixwrap");
      if(wrap&&window.CODEFIX&&window.CODEFIX.lines){renderCodeFix(wrap,window.CODEFIX,function(){var f=document.getElementById("fix");if(f)f.click();});}
      else{var f=document.getElementById("fix");if(f)f.hidden=false;}},
    fixApplied:function(modeText,stepHTML){var m=document.getElementById("mode"),f=document.getElementById("fix");
      if(m){m.className="modebar safe";m.innerHTML=modeText;}if(f)f.hidden=true;show("step",stepHTML);},
    verified:function(stepHTML){var b=document.getElementById("ph2");if(b)b.className="phase done";show("step",stepHTML);markSolved();}
  };
})();