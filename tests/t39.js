const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1440,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(800);
const L=()=>p.evaluate(()=>document.getElementById('iL').style.transform);
await p.mouse.wheel(0,100); await p.waitForTimeout(900); console.log('opening',await L());
await p.mouse.wheel(0,-80); await p.waitForTimeout(300); console.log('back pressed',await L());
await p.waitForTimeout(2500); console.log('after back',await L(), await p.evaluate(()=>scrollY));
// outro closing
await p.evaluate(()=>{ window._navJump=true; const o=document.getElementById('outro'); window._lenis.scrollTo(o.offsetTop+(o.offsetHeight-innerHeight)*0.66,{immediate:true,force:true}); }); await p.waitForTimeout(400); await p.evaluate(()=>{window._navJump=false});
await p.mouse.wheel(0,60); await p.waitForTimeout(300);
const OL=()=>p.evaluate(()=>document.getElementById('oL').style.transform);
console.log('outro closing start',await OL()); await p.waitForTimeout(3000); console.log('outro after',await OL(), errs);
await b.close()})();
