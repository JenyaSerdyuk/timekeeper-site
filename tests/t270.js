const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
const st=async()=>p.evaluate(()=>{const i=document.querySelector('.intro');return {y:Math.round(scrollY),v:+(scrollY/(i.offsetHeight-innerHeight)).toFixed(3)}});
// fast flick: 40 events with decaying inertia
const flick=async(dir)=>{for(let i=0;i<40;i++){await p.mouse.wheel(0,dir*Math.max(4,160*Math.exp(-i/12)));await p.waitForTimeout(16)}};
for(let k=0;k<5;k++){await flick(1);await p.waitForTimeout(2600);console.log('down',k,JSON.stringify(await st()))}
for(let k=0;k<5;k++){await flick(-1);await p.waitForTimeout(2600);console.log('up',k,JSON.stringify(await st()))}
// smoothness of scene 4: sample positions
await b.close()})();
