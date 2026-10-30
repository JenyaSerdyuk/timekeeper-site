const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const gap of [2600,1000,400]){
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y-1500)},top);await p.waitForTimeout(400);await p.evaluate(()=>{window._navJump=false});await p.mouse.move(700,450);
const Q=async()=>p.evaluate(()=>{const o=document.querySelector('.outro');return +((scrollY-o.offsetTop)/(o.offsetHeight-innerHeight)).toFixed(2)});
const swipe=async(dir)=>{const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const r=[];for(let i=0;i<8;i++){await swipe(1);await p.waitForTimeout(gap);r.push(await Q())}
await p.waitForTimeout(2500);r.push('|');
for(let i=0;i<10;i++){await swipe(-1);await p.waitForTimeout(gap);r.push(await Q())}
await p.waitForTimeout(2500);r.push('end '+await Q());
console.log('gap',gap,r.join(' '));await p.close()}
await b.close()})();
