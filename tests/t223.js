const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','en'],['http://localhost:8767/','ru']])for(const w of [390,375,414]){const ctx=await b.newContext({viewport:{width:w,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2300);await p.screenshot({path:`/home/claude/pj_${t}_${w}.png`,clip:{x:0,y:40,width:w,height:300}});await ctx.close()}
await b.close()})();
