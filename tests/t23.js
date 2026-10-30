const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m'});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(1000);
const st=()=>p.evaluate(()=>({y:Math.round(scrollY),L:document.getElementById('iL').style.transform,tyt:(+document.getElementById('tyt').style.opacity).toFixed(2),launch:(+document.querySelector('.intro .launch').style.opacity).toFixed(2)}));
await p.mouse.wheel(0,100); await p.waitForTimeout(200); await p.mouse.wheel(0,100);
const t0=Date.now(); for(const t of [300,1000,2000,3000,4000,7000]){ await p.waitForTimeout(t-(Date.now()-t0)>0?t-(Date.now()-t0):0); console.log(tag,t,JSON.stringify(await st())); }
console.log(errs); await ctx.close() }
await b.close()})();
