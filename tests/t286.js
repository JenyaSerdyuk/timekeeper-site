const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const gap of [2600,800]){
const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y-900)},top);await p.waitForTimeout(400);await p.evaluate(()=>{window._navJump=false});
const cdp=await ctx.newCDPSession(p);
const swipe=async(dy)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:400}]});for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:400-dy*k/6}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
const Q=async()=>p.evaluate(()=>{const o=document.querySelector('.outro');return +((scrollY-o.offsetTop)/(o.offsetHeight-innerHeight)).toFixed(2)});
const r=[];for(let i=0;i<7;i++){await swipe(200);await p.waitForTimeout(gap);r.push(await Q())} await p.waitForTimeout(2500);r.push('|');
for(let i=0;i<7;i++){await swipe(-200);await p.waitForTimeout(gap);r.push(await Q())} await p.waitForTimeout(2500);r.push('end '+await Q());
console.log('phone gap',gap,r.join(' '));await ctx.close()}
await b.close()})();
