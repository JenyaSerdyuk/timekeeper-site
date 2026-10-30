const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
// desktop wheel
{const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},top-1200);await p.waitForTimeout(300);await p.evaluate(()=>{window._navJump=false});
await p.mouse.move(700,450);
const Q=async t=>console.log(t,await p.evaluate(()=>{const o=document.querySelector('.outro');return ((scrollY-o.offsetTop)/(o.offsetHeight-innerHeight)).toFixed(3)}));
for(let i=0;i<30;i++){await p.mouse.wheel(0,80);await p.waitForTimeout(30)} await p.waitForTimeout(1500);await Q('arrive');
await p.mouse.wheel(0,100);await p.waitForTimeout(2700);await Q('down1');
await p.mouse.wheel(0,100);await p.waitForTimeout(2700);await Q('down2');
await p.mouse.wheel(0,-100);await p.waitForTimeout(2700);await Q('up1');
await p.mouse.wheel(0,-100);await p.waitForTimeout(2700);await Q('up2');
await p.mouse.wheel(0,-100);await p.waitForTimeout(1500);await Q('up3');
console.log(errs.join(';'));await p.close()}
// phone touch
{const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},top+5);await p.waitForTimeout(300);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(800);
const Q=async t=>console.log('ph',t,await p.evaluate(()=>{const o=document.querySelector('.outro');return ((scrollY-o.offsetTop)/(o.offsetHeight-innerHeight)).toFixed(3)}));
const cdp=await ctx.newCDPSession(p);
const swipe=async(dy)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:400}]});for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:400-dy*k/6}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
await Q('start');await swipe(120);await p.waitForTimeout(2700);await Q('down1');await swipe(120);await p.waitForTimeout(2700);await Q('down2');await swipe(-120);await p.waitForTimeout(2700);await Q('up1');await swipe(-120);await p.waitForTimeout(2700);await Q('up2');await ctx.close()}
await b.close()})();
