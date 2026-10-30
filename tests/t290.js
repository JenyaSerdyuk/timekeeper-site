const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [mode,port] of [['trackpad',8766],['notch',8766],['phone',8766],['trackpad',8767],['phone',8767]]){
const ctx=mode==='phone'?await b.newContext({...devices['iPhone 13']}):await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:'+port+'/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
const cdp=await ctx.newCDPSession(p);
const mv=async(dir)=>{ if(mode==='phone'){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:400}]});for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:400-dir*200*k/6}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});return}
 if(mode==='notch'){await p.mouse.wheel(0,dir*100);return}
 const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const st=async()=>p.evaluate(()=>Math.round(scrollY)); const max=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
let ys=[],stuck=0,maxStuck=0,y=await st(),n=0;
while(y<max-2&&n<400){await mv(1);await p.waitForTimeout(mode==='notch'?450:1300);const y2=await st();if(y2<=y+1){stuck++;maxStuck=Math.max(maxStuck,stuck)}else stuck=0;ys.push(y2);y=y2;n++;if(stuck>8)break}
const downN=n, reached=y>=max-2, downStuck=maxStuck;
stuck=0;maxStuck=0;n=0;let back=0;
while(y>2&&n<400){await mv(-1);await p.waitForTimeout(mode==='notch'?450:1300);const y2=await st();if(y2>=y-1){stuck++;maxStuck=Math.max(maxStuck,stuck)}else stuck=0;if(y2>y+5)back++;y=y2;n++;if(stuck>8)break}
console.log((port==8767?'RU ':'EN ')+mode,'| down moves',downN,'reached end',reached,'max no-progress in a row',downStuck,'| up moves',n,'reached top',y<=2,'max no-progress',maxStuck,'wrong-way',back,errs.length?'ERR '+errs[0]:'');await ctx.close()}
await b.close()})();
