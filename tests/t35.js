const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1440,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(800);
await p.evaluate(()=>{ window._navJump=true; const o=document.getElementById('outro'); window._lenis.scrollTo(o.offsetTop-1500,{immediate:true,force:true}); }); await p.waitForTimeout(600); await p.evaluate(()=>{window._navJump=false});
const st=()=>p.evaluate(()=>({y:Math.round(scrollY),scene:(+document.getElementById('oScene').style.opacity).toFixed(2),phr:(+document.getElementById('oPhrase').style.opacity).toFixed(2)}));
for(let i=0;i<25;i++){ await p.mouse.wheel(0,200); await p.waitForTimeout(60);} await p.waitForTimeout(1800);
console.log('arrived',JSON.stringify(await st()));
await p.mouse.wheel(0,100); // one notch
for(const t of [500,1200,2500,3500]){ await p.waitForTimeout(t===500?500:t-[500,1200,2500][[1200,2500,3500].indexOf(t)]); console.log(t,JSON.stringify(await st())); }
console.log(errs); await b.close()})();
