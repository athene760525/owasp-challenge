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
  function renderFix(wrap,opts,onCorrect){
    var h='<div class="q">🔧 把你覺得<b>真正能修好這個漏洞</b>的做法，拖進下方框裡送出：</div>';
    h+='<div class="dz" id="dz"><span class="dzhint">把正確的修復做法拖來這裡放開</span></div>';
    h+='<div class="pool" id="pool"></div><div class="fixfb" id="fixfb"></div>';
    wrap.innerHTML=h;wrap.hidden=false;
    var pool=document.getElementById("pool"),dz=document.getElementById("dz"),fb=document.getElementById("fixfb"),done=false;
    var order=opts.map(function(o,i){return{t:o[0],ok:!!o[1]};});
    for(var k=order.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),tmp=order[k];order[k]=order[j];order[j]=tmp;}
    function hit(x,y){var r=dz.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;}
    function drop(el){
      if(el.getAttribute("data-ok")==="1"){done=true;dz.classList.remove("over");dz.classList.add("ok");dz.innerHTML="";dz.appendChild(el);el.className="chip placed";
        fb.className="fixfb ok";fb.textContent="✓ 正確！正在套用這個修復…";setTimeout(function(){wrap.hidden=true;onCorrect();},450);}
      else{fb.className="fixfb no";fb.textContent="✗ 這個做法擋不住這種攻擊，再想想。";dz.classList.add("shake");setTimeout(function(){dz.classList.remove("shake");},380);}
    }
    function makeDraggable(el){el.addEventListener("pointerdown",function(e){
      if(done)return;e.preventDefault();
      var rect=el.getBoundingClientRect(),ghost=el.cloneNode(true);
      ghost.className="chip drag";ghost.style.width=rect.width+"px";document.body.appendChild(ghost);
      var ox=e.clientX-rect.left,oy=e.clientY-rect.top;
      function put(x,y){ghost.style.left=(x-ox)+"px";ghost.style.top=(y-oy)+"px";}
      put(e.clientX,e.clientY);el.classList.add("hold");
      function mv(ev){put(ev.clientX,ev.clientY);dz.classList.toggle("over",hit(ev.clientX,ev.clientY));}
      function up(ev){document.removeEventListener("pointermove",mv);document.removeEventListener("pointerup",up);
        ghost.remove();el.classList.remove("hold");dz.classList.remove("over");if(hit(ev.clientX,ev.clientY))drop(el);}
      document.addEventListener("pointermove",mv);document.addEventListener("pointerup",up);
    });}
    order.forEach(function(it){var el=document.createElement("div");el.className="chip";el.textContent=it.t;
      el.setAttribute("data-ok",it.ok?"1":"0");pool.appendChild(el);makeDraggable(el);});
  }
  window.vulnUI={
    found:function(stepHTML){var a=document.getElementById("ph1"),b=document.getElementById("ph2");
      if(a)a.className="phase done";if(b)b.className="phase active";show("step",stepHTML);
      var wrap=document.getElementById("fixwrap");
      if(wrap&&window.FIXOPTS&&window.FIXOPTS.length){renderFix(wrap,window.FIXOPTS,function(){var f=document.getElementById("fix");if(f)f.click();});}
      else{var f=document.getElementById("fix");if(f)f.hidden=false;}},
    fixApplied:function(modeText,stepHTML){var m=document.getElementById("mode"),f=document.getElementById("fix");
      if(m){m.className="modebar safe";m.innerHTML=modeText;}if(f)f.hidden=true;show("step",stepHTML);},
    verified:function(stepHTML){var b=document.getElementById("ph2");if(b)b.className="phase done";show("step",stepHTML);markSolved();}
  };
})();