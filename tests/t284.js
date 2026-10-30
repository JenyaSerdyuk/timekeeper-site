const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const mode of ['desk','phone']){
const ctx=mode==='desk'?await b.newContext({viewport:{width:1440,height:900}}):await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(200,400);
const cdp=await ctx.newCDPSession(p);
const tswipe=async(dy)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:400}]});for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:400-dy*k/6}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
const swipe=async(dir)=>{ if(mode==='phone') return tswipe(dir*150); const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
await p.evaluate(()=>{window._ys=[];window._vs=[];const f=()=>{window._ys.push(Math.round(scrollY));window._vs.push(document.getElementById('iL').style.transform+'|'+getComputedStyle(document.querySelector('.intro .launch')).opacity);requestAnimationFrame(f)};requestAnimationFrame(f)});
const seq=[1,1,1,-1,-1,-1,1,1,1,-1,-1,-1];const ends=[];
for(const d of seq){await swipe(d);await p.waitForTimeout(2300);ends.push(await p.evaluate(()=>Math.round(scrollY)))}
const ys=await p.evaluate(()=>window._ys);let maxJ=0,at=0;for(let i=1;i<ys.length;i++){const j=Math.abs(ys[i]-ys[i-1]);if(j>maxJ){maxJ=j;at=i}}
// direction reversals inside one movement (a jerk)
let rev=0;for(let i=2;i<ys.length;i++){const a=ys[i-1]-ys[i-2],c=ys[i]-ys[i-1];if(a*c<0&&Math.abs(a)>3&&Math.abs(c)>3)rev++}
const big=[];for(let i=1;i<ys.length;i++){const j=ys[i]-ys[i-1];if(Math.abs(j)>40||0)big.push(ys[i-1]+'>'+ys[i])} const rv=[];for(let i=2;i<ys.length;i++){const a=ys[i-1]-ys[i-2],c=ys[i]-ys[i-1];if(a*c<0&&Math.abs(a)>3&&Math.abs(c)>3)rv.push(ys.slice(i-4,i+3).join(' '))} console.log(big.join(' '),'|',rv.join(' ; '));console.log(mode,'stops',ends.join(','),'max px/frame',maxJ,'reversals',rev);await ctx.close()}
await b.close()})();
