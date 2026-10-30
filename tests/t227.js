const {chromium}=require('playwright');
const url=process.argv[2]||'http://localhost:8766/', tag=process.argv[3]||'n';
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1920,1080],[1440,900],[1280,720],[390,844],[390,664],[375,667]]){const m=w<500;const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:m,hasTouch:m,deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1300);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2300);await p.screenshot({path:`/home/claude/l3_${tag}_${w}x${h}_a.png`});
const g1=await p.evaluate(()=>document.getElementById('sceneImg').style.transform);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},top+10);await p.waitForTimeout(1800);await p.screenshot({path:`/home/claude/l3_${tag}_${w}x${h}_b.png`});
const g2=await p.evaluate(()=>document.getElementById('oImg').style.transform);
console.log(w+'x'+h,g1===g2?'SAME':'DIFF '+g1+' / '+g2,errs.join(';'));await ctx.close()}
await b.close()})();
