const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
// gentle trackpad swipes that start while the previous inertia tail is still running
const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.mouse.move(700,450);
const gentle=async(dir)=>{const ds=[1,2,3,5,7,8,8,7,6,5,4,4,3,3,3,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const end=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},end);await p.waitForTimeout(500);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(1500);
const ys=[];for(let k=0;k<6;k++){await gentle(-1);await p.waitForTimeout(1800);ys.push(await p.evaluate(()=>Math.round(scrollY)))}
console.log('gentle up from end',end,ys.join(','));
await p.evaluate(()=>{window._navJump=true;scrollTo(0,0)});await p.waitForTimeout(500);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(800);
const d=[];for(let k=0;k<5;k++){await gentle(1);await p.waitForTimeout(1800);d.push(await p.evaluate(()=>Math.round(scrollY)))}
console.log('gentle down from top',d.join(','));await b.close()})();
