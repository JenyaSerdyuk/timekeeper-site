const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2300);
console.log(await p.evaluate(()=>[10,30,39,41,60].map(y=>{const e=document.elementsFromPoint(195,y).slice(0,4).map(e=>e.tagName+'.'+(e.id||e.className)).join(' > ');return y+': '+e}).join('\n')));
console.log(await p.evaluate(()=>{const i=document.getElementById('sceneImg');return i.style.transform+' '+JSON.stringify(i.getBoundingClientRect())}));
await b.close()})();
