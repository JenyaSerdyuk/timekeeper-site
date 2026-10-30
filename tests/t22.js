const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m'});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(1000);
const st=()=>p.evaluate(()=>({y:Math.round(scrollY),tyt:(+document.getElementById('tyt').style.opacity).toFixed(2),launch:(+document.querySelector('.intro .launch').style.opacity).toFixed(2)}));
for(let i=0;i<40;i++){ await p.mouse.wheel(0,120); await p.waitForTimeout(120); const s=await st(); if(+s.y>vp.height*4*0.42) break; }
console.log(tag,'after scroll',JSON.stringify(await st()));
await p.waitForTimeout(1500); console.log(tag,'1.5s',JSON.stringify(await st()));
await p.waitForTimeout(2500); console.log(tag,'4s',JSON.stringify(await st()));
for(let i=0;i<8;i++){ await p.mouse.wheel(0,-150); await p.waitForTimeout(120);} await p.waitForTimeout(800);
console.log(tag,'after back',JSON.stringify(await st()), errs); await ctx.close() }
await b.close()})();
