const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const q of ['','?top'])for(const [w,h] of [[1440,900],[390,844]]){const m=w<500;const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:m,hasTouch:m,deviceScaleFactor:m?2:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/'+q,{waitUntil:'networkidle'});await p.waitForTimeout(1300);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2300);
await p.screenshot({path:`/home/claude/v_${q?'top':'cur'}_${w}.png`});console.log(q,w,errs.join(';'));await ctx.close()}
await b.close()})();
