const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','en'],['http://localhost:8767/','ru']])for(const [w,h] of [[1440,900],[390,844]]){const ctx=await b.newContext(w<500?{...devices['iPhone 13']}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1000);
for(const q of ['#heirloom','.cw-ll']){await p.evaluate(q=>{window._navJump=true;const e=document.querySelector(q);scrollTo(0,e.getBoundingClientRect().top+scrollY-80)},q);await p.waitForTimeout(1300);
const el=await p.$(q==='.cw-ll'?'.cw-ll':'#heirloom');const bb=await el.boundingBox();await p.screenshot({path:`/home/claude/sx_${t}_${w}_${q.replace(/[#.]/g,'')}.png`,clip:{x:0,y:Math.max(0,bb.y),width:w,height:Math.min(q==='.cw-ll'?(w<500?700:420):bb.height,h-Math.max(0,bb.y))}})}
await ctx.close()}
await b.close()})();
