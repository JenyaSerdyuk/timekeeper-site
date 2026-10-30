const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1440,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(800);
await p.evaluate(()=>{ window._navJump=true; const o=document.getElementById('outro'); window._lenis.scrollTo(o.offsetTop-1500,{immediate:true,force:true}); }); await p.waitForTimeout(600); await p.evaluate(()=>{window._navJump=false});
const st=()=>p.evaluate(()=>({y:Math.round(scrollY),scene:(+document.getElementById('oScene').style.opacity).toFixed(2),bd:document.getElementById('oBd').style.opacity}));
// continuous fast scroll (one gesture) into outro
for(let i=0;i<25;i++){ await p.mouse.wheel(0,200); await p.waitForTimeout(60);} await p.waitForTimeout(1500);
console.log('after arrival',JSON.stringify(await st()));
await p.waitForTimeout(1500); console.log('waiting',JSON.stringify(await st()));
await p.click('.omodes button[data-m="back"]'); console.log('clicked ok');
// new gesture
for(let i=0;i<10;i++){ await p.mouse.wheel(0,200); await p.waitForTimeout(80);} await p.waitForTimeout(2000);
console.log('after new scroll',JSON.stringify(await st()), errs);
await b.close()})();
