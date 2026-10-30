const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
const st=async()=>p.evaluate(()=>Math.round(scrollY));
const swipe=async(dir)=>{const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const flick=async(dir)=>{for(let i=0;i<40;i++){await p.mouse.wheel(0,dir*Math.max(4,200*Math.exp(-i/12)));await p.waitForTimeout(16)}};
const notch=async(dir)=>{await p.mouse.wheel(0,dir*100)};
console.log('stops', await p.evaluate(()=>{const i=document.querySelector('.intro');const d=i.offsetHeight-innerHeight;return [0,Math.round(.46*d),d]}));
for(const [n,f] of [['trackpad',swipe],['flick',flick],['notch',notch]]){
  await p.evaluate(()=>{window._navJump=true;scrollTo(0,0)});await p.waitForTimeout(500);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(600);
  const r=[];for(let k=0;k<4;k++){await f(1);await p.waitForTimeout(2200);r.push(await st())} 
  const u=[];for(let k=0;k<4;k++){await f(-1);await p.waitForTimeout(2200);u.push(await st())}
  console.log(n,'down',r.join(','),' up',u.join(','))}
console.log(errs.join(';'));await b.close()})();
