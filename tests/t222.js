const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','en'],['http://localhost:8767/','ru']]){const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2500);await p.screenshot({path:`/home/claude/ph_${t}_1.png`});
const el=await p.$('#tlForm');await el.scrollIntoViewIfNeeded();await p.waitForTimeout(1200);await p.screenshot({path:`/home/claude/ph_${t}_2.png`});
const e3=await p.$('.ll-reg');if(e3){await e3.scrollIntoViewIfNeeded();await p.waitForTimeout(900);await p.screenshot({path:`/home/claude/ph_${t}_3.png`})}
await ctx.close()}
await b.close()})();
