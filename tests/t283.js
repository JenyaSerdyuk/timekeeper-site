const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
const st=async()=>p.evaluate(()=>Math.round(scrollY));
const swipe=async(dir)=>{const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const flick=async(dir)=>{for(let i=0;i<40;i++){await p.mouse.wheel(0,dir*Math.max(4,200*Math.exp(-i/12)));await p.waitForTimeout(16)}};
const notch=async(dir)=>{await p.mouse.wheel(0,dir*100)};
for(const [n,f] of [['trackpad',swipe],['flick',flick],['notch',notch]]){
  await p.evaluate(()=>{window._navJump=true;scrollTo(0,6000)});await p.waitForTimeout(500);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(800);
  const u=[];for(let k=0;k<(n==='notch'?62:12);k++){await f(-1);await p.waitForTimeout(n==='notch'?250:2000);u.push(await st())}
  console.log(n,'up from 6000:',(n==='notch'?u.filter((x,i)=>i%3==2):u).join(','))}
console.log(errs.join(';'));await b.close()})();
