const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const f of ['tk_pre.html','tk_test.html'])for(const [w,h] of [[1440,900],[390,664]]){const mob=w<500;const ctx=await b.newContext(mob?{...devices['iPhone 13'],viewport:{width:w,height:h}}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto('http://localhost:8765/'+f,{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const y=await p.evaluate(()=>{const s=document.querySelector('.outro');return s.offsetTop});
for(const k of [0.6,1.2]){await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y+k*h);await p.waitForTimeout(2000);await p.screenshot({path:`/home/claude/out_${f.slice(0,-5)}_${w}_${k}.png`})}
await ctx.close()}
await b.close()})();
