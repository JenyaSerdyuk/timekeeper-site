const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'networkidle'});await p.waitForTimeout(800);
await p.evaluate(()=>{window._navJump=true;const e=document.querySelectorAll('.tlc')[2];scrollTo(0,e.getBoundingClientRect().top+scrollY-200)});await p.waitForTimeout(1500);
const e=await p.$$('.tlc');await e[2].screenshot({path:'t200.png'});await b.close()})();
