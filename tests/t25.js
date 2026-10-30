const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m',deviceScaleFactor:2});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html#heirloom',{waitUntil:'load'}); await p.waitForTimeout(1500);
await p.evaluate(()=>{document.getElementById('nav').style.display='none'; document.querySelector('.lp').scrollIntoView({block:'center'})}); await p.waitForTimeout(800);
await p.fill('#bdate','1990-03-01'); await p.waitForTimeout(600);
const sec=(await p.$$('.cw'))
const el=await p.evaluate(()=>{const s=document.getElementById('c2').closest('section'); s.scrollIntoView(); return 1}); await p.waitForTimeout(500);
const s2=await p.$('#c2'); const sect=await s2.evaluateHandle(e=>e.closest('section'));
await sect.asElement().screenshot({path:SP+'lp_'+tag+'.png'});
console.log(tag,errs, await p.textContent('#c2')); await ctx.close() }
await b.close()})();
