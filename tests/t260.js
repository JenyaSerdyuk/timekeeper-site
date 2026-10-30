const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [u,n] of [['http://localhost:8765/timekeeper.html','a'],['http://localhost:8765/timekeeper_ru.html','b']]){
const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const y=await p.evaluate(()=>{const s=document.querySelector('.intro');return s.offsetTop+s.offsetHeight-innerHeight-10});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(2500);
console.log(n, await p.evaluate(()=>({jw:document.querySelectorAll('#lPhr .jw').length,ta:getComputedStyle(document.getElementById('lPhr')).textAlign,w:document.getElementById('lPhr').style.width})));
await p.screenshot({path:process.argv[2]+'/art_'+n+'.png'});await ctx.close()}
await b.close()})();
