const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m'});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html#outro',{waitUntil:'load'}); await p.waitForTimeout(800);
await p.evaluate(()=>{ window._navJump=true; const y=document.getElementById('ll').getBoundingClientRect().top+scrollY-120; window._lenis.scrollTo(y,{immediate:true,force:true}); document.getElementById('nav').style.display='none' }); await p.waitForTimeout(1500);
const el=await p.$('#ll');
await el.screenshot({path:SP+'ll_'+tag+'0.png'});
const vis=()=>p.evaluate(()=>[...document.querySelectorAll('.ll-it')].filter(e=>!e.classList.contains('hid')).length);
console.log(tag,'visible0',await vis());
await p.click('#llIn'); await p.waitForTimeout(300); await el.screenshot({path:SP+'ll_'+tag+'1.png'}); await p.waitForTimeout(900); console.log(tag,'visible after +',await vis());
await el.screenshot({path:SP+'ll_'+tag+'2.png'});
await p.click('#llIn'); await p.waitForTimeout(1200); console.log(tag,'after ++',await vis());
await p.click('#llOut'); await p.waitForTimeout(1200); console.log(tag,'after -',await vis());
console.log(errs); await ctx.close() }
await b.close()})();
