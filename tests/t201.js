const {chromium}=require('playwright');
const W=+process.argv[2]||1920,H=+process.argv[3]||1080;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H}});
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'networkidle'});await p.waitForTimeout(800);
await p.evaluate(()=>{window._navJump=true;const e=document.querySelector('#stage3d');scrollTo(0,e.getBoundingClientRect().top+scrollY-80)});await p.waitForTimeout(2500);
const n=await p.evaluate(()=>document.querySelectorAll('.ptile').length);
for(let i=0;i<n;i++){await p.evaluate(i=>document.querySelectorAll('.ptile')[i].click(),i);await p.waitForTimeout(3500);
 const k=await p.evaluate(i=>document.querySelectorAll('.ptile')[i].textContent.trim().split(/\s|\$/)[0],i);
 await (await p.$('#stage3d')).screenshot({path:`t201_${W}_${i}_${k}.png`});}
await b.close()})();
