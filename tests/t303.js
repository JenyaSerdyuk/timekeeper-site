const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const mode of ['trackpad','notch']){
const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.mouse.move(700,450);
const mv=async(dir)=>{ if(mode==='notch'){await p.mouse.wheel(0,dir*100);return} const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
// scroll to middle then reload
await p.evaluate(()=>{window._navJump=true;scrollTo(0,5000)});await p.waitForTimeout(300);await p.evaluate(()=>{window._navJump=false});
for(let k=0;k<3;k++){await mv(1);await p.waitForTimeout(600)}
await p.reload({waitUntil:'networkidle'});await p.waitForTimeout(1200);
const ys=[];ys.push(await p.evaluate(()=>Math.round(scrollY)));for(let k=0;k<3;k++){await mv(1);await p.waitForTimeout(2200);ys.push(await p.evaluate(()=>Math.round(scrollY)))}
// back to top link from the end
const end=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},end);await p.waitForTimeout(1500);await p.evaluate(()=>{window._navJump=false});
await p.evaluate(()=>{const a=document.querySelector('.outro .totop');a&&a.click()});await p.waitForTimeout(3000);
const t=[await p.evaluate(()=>Math.round(scrollY))];for(let k=0;k<2;k++){await mv(1);await p.waitForTimeout(2200);t.push(await p.evaluate(()=>Math.round(scrollY)))}
// white block before outro: scroll down normally, does it auto-move?
const g=await p.evaluate(()=>{const o=document.querySelector('.outro');return {yW:o.offsetTop-innerHeight,top:o.offsetTop}});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},g.yW-200);await p.waitForTimeout(400);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(300);
await mv(1);await p.waitForTimeout(150);const w1=await p.evaluate(()=>Math.round(scrollY));await p.waitForTimeout(2000);const w2=await p.evaluate(()=>Math.round(scrollY));
console.log(mode,'after reload',ys.join(','),'| back to top then',t.join(','),'| white block',g,'after 1 move',w1,'2s later',w2,errs.join(';'));await p.close()}
await b.close()})();
