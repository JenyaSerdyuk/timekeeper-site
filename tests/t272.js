const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});
const st=async()=>p.evaluate(()=>Math.round(scrollY));
const seq=[];for(let i=0;i<8;i++){seq.push(await st());await p.waitForTimeout(500)} console.log('idle',seq.join(','));
await p.mouse.move(700,450);
// trackpad: a swipe = rising then decaying deltas over ~1.2s
const swipe=async(dir)=>{const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const log=async t=>console.log(t,await st());
for(let k=0;k<4;k++){await swipe(1);await p.waitForTimeout(1900);await log('down'+k)}
for(let k=0;k<4;k++){await swipe(-1);await p.waitForTimeout(1900);await log('up'+k)}
// two quick swipes in a row (second during inertia)
await swipe(1);await p.waitForTimeout(150);await swipe(1);await p.waitForTimeout(3500);await log('double');
await b.close()})();
