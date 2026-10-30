const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','en'],['http://localhost:8767/','ru']])for(const w of [390,375,414,1440]){const ctx=await b.newContext({viewport:{width:w,height:844},isMobile:w<500,deviceScaleFactor:1});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1000);
console.log(t,w,await p.evaluate(()=>{const bad=[];document.querySelectorAll('button.q').forEach(b=>{if(!b.offsetParent)return;const r=b.getBoundingClientRect();const sp=b.parentNode;const rr=sp.getClientRects();if(rr.length>1)bad.push(sp.textContent.slice(0,30));const n=b.nextSibling;});return document.querySelectorAll('.qnw').length+' qnw, split: '+bad.join('|')}));await ctx.close()}
await b.close()})();
