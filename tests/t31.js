const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m'});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html#device',{waitUntil:'load'}); await p.waitForTimeout(2500);
await p.evaluate(()=>document.getElementById('nav').style.display='none');
await (await p.$('#device')).screenshot({path:SP+'k_'+tag+'.png'});
await p.evaluate(()=>document.getElementById('timeless').scrollIntoView()); await p.waitForTimeout(500);
await (await p.$('#timeless')).screenshot({path:SP+'tf_'+tag+'0.png'});
await p.click('#tlEmail'); await p.fill('#tlEmail','a@b.co'); await p.click('#tlBtn'); await p.waitForTimeout(600);
await (await p.$('.tl-cta')).screenshot({path:SP+'tf_'+tag+'1.png'});
console.log(tag,errs, await p.textContent('#tlOk'), await p.evaluate(()=>[document.getElementById('dThumbs').hidden, getComputedStyle(document.getElementById('xvF')).display])); await ctx.close() }
await b.close()})();
