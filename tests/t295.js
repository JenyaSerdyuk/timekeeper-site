const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const mode of ['trackpad','notch','flick','phone']){
const ctx=mode==='phone'?await b.newContext({...devices['iPhone 13']}):await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.mouse.move(700,450);
const cdp=await ctx.newCDPSession(p);
const mv=async(dir)=>{ if(mode==='phone'){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:400}]});for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:400-dir*200*k/6}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});return}
 if(mode==='notch'){await p.mouse.wheel(0,dir*100);return}
 if(mode==='flick'){for(let i=0;i<40;i++){await p.mouse.wheel(0,dir*Math.max(4,250*Math.exp(-i/12)));await p.waitForTimeout(16)}return}
 const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const g=await p.evaluate(()=>{const o=document.querySelector('.outro');return {top:o.offsetTop,yW:o.offsetTop-innerHeight,sOH:Math.round(o.offsetTop+0.03*(o.offsetHeight-innerHeight)),end:document.documentElement.scrollHeight-innerHeight}});
await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},g.yW-1500);await p.waitForTimeout(400);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(500);
const seq=[];const rec=async()=>{const y=await p.evaluate(()=>Math.round(scrollY));if(seq[seq.length-1]!==y)seq.push(y)};
for(let k=0;k<(mode==='notch'?40:12);k++){await mv(1);await p.waitForTimeout(mode==='notch'?600:2400);await rec()}
seq.push('|');for(let k=0;k<(mode==='notch'?30:8);k++){await mv(-1);await p.waitForTimeout(mode==='notch'?600:2400);await rec()}
console.log(mode,JSON.stringify(g),'\n  ',seq.join(' '),errs.join(';'));await ctx.close()}
await b.close()})();
