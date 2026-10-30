const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.mouse.move(700,450);
const end=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},end);await p.waitForTimeout(400);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(1500);
const st=()=>p.evaluate(()=>({y:Math.round(scrollY),cls:document.documentElement.className}));
console.log(await st());
for(let i=0;i<4;i++){await p.mouse.wheel(0,-100);for(let j=0;j<6;j++){await p.waitForTimeout(150);console.log(i,JSON.stringify(await st()))}}
await b.close()})();
