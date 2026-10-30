const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h,m] of [[390,844,true],[1440,900,false]]){const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:m,hasTouch:m,deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);const H=await p.evaluate(()=>document.querySelector('.outro').offsetHeight);
let i=0;for(const f of [0,0.08,0.16,0.24,0.32,0.45,0.6,0.75,0.9,1.0]){const y=top+f*(H-h);await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(900);await p.screenshot({path:`/home/claude/oc_${w}_${i++}.png`})}
console.log(w,errs.join(';'));await ctx.close()}
await b.close()})();
