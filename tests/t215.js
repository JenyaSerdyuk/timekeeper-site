const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','en'],['http://localhost:8767/','ru']])for(const [w,h] of [[1920,1080],[1440,900],[1280,720],[390,844],[390,664]]){const mob=w<500;const ctx=await b.newContext(mob?{...devices['iPhone 13'],viewport:{width:w,height:h}}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1400);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2200);
const r=await p.evaluate(()=>{const a=document.getElementById('lTag').getBoundingClientRect(),b=document.getElementById('lPhr').getBoundingClientRect();return {x:Math.max(0,Math.min(a.left,b.left)-20),y:Math.max(0,a.top-10),width:Math.max(a.width,b.width)+40,height:b.bottom-a.top+20}});
await p.screenshot({path:`/home/claude/tx_${t}_${w}.png`,clip:r});await ctx.close()}
await b.close()})();
