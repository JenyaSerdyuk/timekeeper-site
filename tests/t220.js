const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,t] of [['http://localhost:8766/','en'],['http://localhost:8767/','ru']])for(const [w,h] of [[390,844],[375,667]]){const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width:w,height:h}});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2000);
const bb=await (await p.$('#rsvForm')).boundingBox();await p.screenshot({path:`/home/claude/fm_${t}_${w}_a.png`,clip:{x:0,y:bb.y-10,width:w,height:bb.height+20}});
for(const q of ['#tlForm','#ll .ll-reg, .ll-reg']){const el=await p.$(q);if(!el)continue;await el.scrollIntoViewIfNeeded();await p.waitForTimeout(900);const b2=await el.boundingBox();await p.screenshot({path:`/home/claude/fm_${t}_${w}_${q.includes('tl')?'b':'c'}.png`,clip:{x:0,y:Math.max(0,b2.y-10),width:w,height:b2.height+20}})}
await ctx.close()}
await b.close()})();
