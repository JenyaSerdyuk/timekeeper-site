const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1920,1080],[1440,900],[1024,768],[390,844]]){const ctx=await b.newContext(w<500?{...devices['iPhone 13']}:{viewport:{width:w,height:h}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(800);
await p.evaluate(()=>{window._navJump=true;const e=document.querySelector('#ll');scrollTo(0,e.getBoundingClientRect().top+scrollY-100)});await p.waitForTimeout(1500);
const bb=await (await p.$('#ll .ll-bar')).boundingBox();const vb=await (await p.$('#llView')).boundingBox();
const clip={x:0,y:bb.y-10,width:w,height:vb.y+vb.height-bb.y+20};
await p.screenshot({path:`/home/claude/llm_${w}_y.png`,clip});
await p.click('#llIn');await p.waitForTimeout(1400);await p.screenshot({path:`/home/claude/llm_${w}_m.png`,clip});
// drag in months, then back to Years
const c=[vb.x+vb.width/2,vb.y+vb.height/2];await p.mouse.move(c[0],c[1]);await p.mouse.down();for(let i=1;i<=6;i++){await p.mouse.move(c[0]-i*40,c[1]);await p.waitForTimeout(30)}await p.mouse.up();await p.waitForTimeout(1500);
await p.screenshot({path:`/home/claude/llm_${w}_d.png`,clip});
await p.click('#llOut');await p.waitForTimeout(1400);await p.screenshot({path:`/home/claude/llm_${w}_b.png`,clip});
console.log(w,errs.join(';'));await ctx.close()}
await b.close()})();
