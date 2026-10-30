const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const mode of ['trackpad','notch']){
const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.mouse.move(700,450);
const mv=async(dir)=>{ if(mode==='notch'){await p.mouse.wheel(0,dir*100);return} const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const end=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},end);await p.waitForTimeout(500);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(1500);
const ys=[];for(let k=0;k<6;k++){await mv(-1);await p.waitForTimeout(2600);ys.push(await p.evaluate(()=>Math.round(scrollY)))}
console.log(mode,end,ys.join(','),errs.join(';'));await p.close()}
await b.close()})();
