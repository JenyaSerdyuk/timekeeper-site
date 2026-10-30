const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [n,vp,mob] of [['p390',{width:390,height:844},true],['d1440',{width:1440,height:900},false]]){
const ctx=await b.newContext(mob?{...devices['iPhone 13']}:{viewport:vp});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
// go past the intro
const secs=await p.evaluate(()=>{const i=document.querySelector('.intro');const o=document.querySelector('.outro');return {start:i.offsetTop+i.offsetHeight,end:o.offsetTop}});
let y=secs.start-58, k=0;
while(y<secs.end && k<40){await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},y);await p.waitForTimeout(700);await p.screenshot({path:`${process.argv[2]}/aud/${n}_${String(k).padStart(2,'0')}.png`});y+=Math.round(vp.height*0.85);k++}
console.log(n,k,secs);await ctx.close()}
await b.close()})();
