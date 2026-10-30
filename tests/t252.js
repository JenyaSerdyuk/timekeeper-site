const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
const it=await p.evaluate(()=>{const i=document.querySelector('.intro');return [i.offsetTop,i.offsetHeight,innerHeight]});console.log('intro',it);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},it[0]+it[1]+600);await p.waitForTimeout(300);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(800);
const cdp=await ctx.newCDPSession(p);
const swipe=async(dy)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:400}]});for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:400-dy*k/6}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
for(let s=0;s<6;s++){const ys=[];await swipe(-150);for(let i=0;i<25;i++){ys.push(await p.evaluate(()=>Math.round(scrollY)));await p.waitForTimeout(60)} console.log('up',s,ys.join(','))}
await ctx.close();await b.close()})();
