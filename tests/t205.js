const {chromium}=require('playwright');
const f=process.argv[2]||'tk_test.html';
(async()=>{const b=await chromium.launch();
for(const vp of [{width:1440,height:900},{width:390,height:844}]){const p=await b.newPage({viewport:vp});
await p.goto('http://localhost:8765/'+f,{waitUntil:'networkidle'});await p.waitForTimeout(800);
await p.evaluate(()=>{window._navJump=true;const e=document.querySelector('.tl-cmp');scrollTo(0,e.getBoundingClientRect().top+scrollY-90)});await p.waitForTimeout(1500);
const el=await p.$('.tl-cmp');await el.screenshot({path:`/home/claude/t205_${f.slice(0,-5)}_${vp.width}_a.png`});
await p.click('.tlc-sw button[data-k="watch2"]');await p.waitForTimeout(800);
await (await p.$('.tlc-w')).screenshot({path:`/home/claude/t205_${f.slice(0,-5)}_${vp.width}_b.png`});
console.log(vp.width, await p.evaluate(()=>document.querySelector('.tlc-w').style.getPropertyValue('--x')+' '+document.querySelector('.tlc-w .tlc-in').style.getPropertyValue('--x')));
await p.close()}
await b.close()})();
