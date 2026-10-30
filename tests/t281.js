const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
const cdp=await ctx.newCDPSession(p);
const swipe=async(dy)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:400}]});for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:400-dy*k/6}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
const st=async()=>p.evaluate(()=>Math.round(scrollY));
const r=[];for(let k=0;k<5;k++){await swipe(150);await p.waitForTimeout(2200);r.push(await st())}
const u=[];for(let k=0;k<5;k++){await swipe(-150);await p.waitForTimeout(2200);u.push(await st())}
console.log('phone down',r.join(','),'up',u.join(','),errs.join(';'));await ctx.close();await b.close()})();
