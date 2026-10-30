const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/tk_test.html#edit',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
const SEL=process.argv[2]||'#uses h2';await p.evaluate(()=>{window._navJump=true;const s=document.querySelector('.intro');scrollTo(0,s.offsetTop+s.offsetHeight-innerHeight-10)});await p.waitForTimeout(2500);
await p.click('.le-tog');await p.waitForTimeout(300);
const h=await p.$(SEL);const bb=await h.boundingBox();const r0=await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);window.__pk=e;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top)]},[bb.x+20,bb.y+10]);
for(const [label,fn] of [['mouse',async()=>{await p.mouse.move(bb.x+20,bb.y+10);await p.mouse.down();for(let i=1;i<=10;i++){await p.mouse.move(bb.x+20+i*10,bb.y+10+i*3);await p.waitForTimeout(20)}await p.mouse.up()}]]){await fn();await p.waitForTimeout(300);await p.setViewportSize({width:1400,height:900});await p.waitForTimeout(3500);
console.log(SEL,r0,await p.evaluate(sel=>{const r=__pk.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),__pk.tagName+'.'+__pk.className].join(' ')+' | '+document.querySelector(sel).style.translate+' | '+document.querySelector('.le-p #leVal')?.textContent},SEL),errs.join(';'))}
await b.close()})();
