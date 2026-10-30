const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const mode of ['stop-then-one','continuous']){
const p=await b.newPage({viewport:{width:1440,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(800);
await p.evaluate(()=>{ window._navJump=true; const o=document.getElementById('outro'); window._lenis.scrollTo(o.offsetTop-1500,{immediate:true,force:true}); }); await p.waitForTimeout(600); await p.evaluate(()=>{window._navJump=false});
const st=()=>p.evaluate(()=>({scene:(+document.getElementById('oScene').style.opacity).toFixed(2),phr:(+document.getElementById('oPhrase').style.opacity).toFixed(2)}));
if(mode==='continuous'){ for(let i=0;i<45;i++){ await p.mouse.wheel(0,120); await p.waitForTimeout(60);} }
else { for(let i=0;i<25;i++){ await p.mouse.wheel(0,200); await p.waitForTimeout(60);} await p.waitForTimeout(1500); console.log(mode,'held',JSON.stringify(await st())); await p.mouse.wheel(0,100); }
await p.waitForTimeout(3000); console.log(mode,'after',JSON.stringify(await st()),errs); await p.close() }
await b.close()})();
