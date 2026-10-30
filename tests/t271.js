const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
await p.mouse.wheel(0,120);await p.waitForTimeout(1600);await p.mouse.wheel(0,120);await p.waitForTimeout(2000);
await p.evaluate(()=>{window._ys=[];const f=()=>{window._ys.push(Math.round(scrollY));if(window._ys.length<160)requestAnimationFrame(f)};requestAnimationFrame(f)});
await p.mouse.wheel(0,120);await p.waitForTimeout(2800);
const ys=await p.evaluate(()=>window._ys);const d=ys.slice(1).map((y,i)=>y-ys[i]);console.log(ys[0],ys[ys.length-1]);console.log(d.join(' '));
await b.close()})();
