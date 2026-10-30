const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
const swipe=async(dir)=>{const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
await swipe(1);await p.waitForTimeout(1700);await swipe(1);await p.waitForTimeout(2500);console.log('at',await p.evaluate(()=>scrollY));
await p.evaluate(()=>{window._ys=[];const f=()=>{window._ys.push(Math.round(scrollY)+(window._navJump?'j':''));if(window._ys.length<300)requestAnimationFrame(f)};requestAnimationFrame(f)});
await swipe(-1);await p.waitForTimeout(4500);console.log((await p.evaluate(()=>window._ys)).join(' '));
await b.close()})();
