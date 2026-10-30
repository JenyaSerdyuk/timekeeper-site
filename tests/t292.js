const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const mode of ['flick','trackpad','notch','phone']){
const ctx=mode==='phone'?await b.newContext({...devices['iPhone 13']}):await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.mouse.move(700,450);
const cdp=await ctx.newCDPSession(p);
const mv=async(dir)=>{ if(mode==='phone'){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:300}]});for(let k=1;k<=4;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:300-dir*400*k/4}]});await p.waitForTimeout(10)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});return}
 if(mode==='notch'){await p.mouse.wheel(0,dir*100);return}
 if(mode==='flick'){for(let i=0;i<40;i++){await p.mouse.wheel(0,dir*Math.max(4,300*Math.exp(-i/12)));await p.waitForTimeout(16)}return}
 const ds=[2,6,14,28,40,44,40,34,28,22,18,14,11,9,7,6,5,4,3,3,2,2,2,1,1,1,1,1,1,1];for(const d of ds){await p.mouse.wheel(0,dir*d);await p.waitForTimeout(17)}};
const P1=await p.evaluate(()=>{const i=document.querySelector('.intro');return i.offsetHeight-innerHeight});
const r=[];for(const start of [P1+300,P1+900,P1+2500]){await p.evaluate(y=>{window._navJump=true;scrollTo(0,y)},start);await p.waitForTimeout(400);await p.evaluate(()=>{window._navJump=false});await p.waitForTimeout(500);
 const seq=[];for(let k=0;k<(mode==='notch'?40:8);k++){await mv(-1);await p.waitForTimeout(mode==='notch'?300:2000);const y=await p.evaluate(()=>Math.round(scrollY));if(seq[seq.length-1]!==y)seq.push(y);if(y===0)break}
 r.push(start+': '+seq.join('>'))}
console.log(mode,'P1',P1,'\n  '+r.join('\n  '));await ctx.close()}
await b.close()})();
