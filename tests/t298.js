const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
for(let k=0;k<2;k++){await p.mouse.wheel(0,100);await p.waitForTimeout(2200)}
console.log('before reload',await p.evaluate(()=>scrollY));
await p.reload();const ys=[];for(let i=0;i<20;i++){await p.waitForTimeout(150);ys.push(await p.evaluate(()=>Math.round(scrollY)))}console.log('after reload',ys.join(','));await b.close()})();
