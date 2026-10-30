const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
const top=await p.evaluate(()=>document.querySelector('.outro').offsetTop);
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},top+5);await p.waitForTimeout(300);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(800);
const cdp=await ctx.newCDPSession(p);
const swipe=async(dy)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:400}]});for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:400-dy*k/6}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
const info=async t=>console.log(t,await p.evaluate(()=>({y:scrollY,max:document.documentElement.scrollHeight-innerHeight,ih:innerHeight,ot:document.querySelector('.outro').offsetTop,oh:document.querySelector('.outro').offsetHeight,after:[...document.querySelectorAll('body > *')].filter(e=>e.offsetTop>=document.querySelector('.outro').offsetTop+10&&e.offsetHeight>0).map(e=>e.tagName+'.'+e.className+':'+e.offsetHeight)})));
await swipe(120);await p.waitForTimeout(2200);await p.screenshot({path:process.argv[2]+'/end1.png'});await info('d1');
await swipe(120);await p.waitForTimeout(2200);await p.screenshot({path:process.argv[2]+'/end2.png'});await info('d2');
await swipe(200);await p.waitForTimeout(1500);await p.screenshot({path:process.argv[2]+'/end3.png'});await info('d3');
// now up: sample positions
const ys=[];await swipe(-120);for(let i=0;i<30;i++){ys.push(await p.evaluate(()=>scrollY));await p.waitForTimeout(80)} console.log('up1',ys.join(','));
const ys2=[];await swipe(-120);for(let i=0;i<30;i++){ys2.push(await p.evaluate(()=>scrollY));await p.waitForTimeout(80)} console.log('up2',ys2.join(','));
const ys3=[];await swipe(-120);for(let i=0;i<30;i++){ys3.push(await p.evaluate(()=>scrollY));await p.waitForTimeout(80)} console.log('up3',ys3.join(','));
await ctx.close();await b.close()})();
