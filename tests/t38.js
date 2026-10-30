const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m',deviceScaleFactor:2});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(800);
await p.evaluate(()=>{ window._navJump=true; const o=document.getElementById('outro'); window._lenis.scrollTo(o.offsetTop+(o.offsetHeight-innerHeight)*0.02,{immediate:true,force:true}); }); await p.waitForTimeout(1000); await p.evaluate(()=>{window._navJump=false});
await p.click('#oOrder'); await p.waitForTimeout(500); await p.screenshot({path:SP+'co_'+tag+'0.png'});
await p.click('.co-chips[data-k="f"] button:nth-child(3)'); await p.click('.co-chips[data-k="ed"] button:nth-child(3)'); await p.waitForTimeout(200); await p.screenshot({path:SP+'co_'+tag+'1.png'});
await p.click('#coNext'); await p.click('#coNext'); await p.waitForTimeout(200); console.log(tag,'err:',await p.textContent('#coErr'));
await p.fill('input[data-k="name"]','Max'); await p.fill('input[data-k="email"]','max@mail.com'); await p.fill('input[data-k="phone"]','+100'); await p.click('#coNext');
await p.fill('input[data-k="country"]','Estonia'); await p.fill('input[data-k="city"]','Tallinn'); await p.fill('input[data-k="addr"]','Main 1'); await p.fill('input[data-k="zip"]','10111'); await p.click('#coNext'); await p.waitForTimeout(300);
await p.screenshot({path:SP+'co_'+tag+'2.png'});
await p.click('#coCard'); await p.waitForTimeout(600); await p.screenshot({path:SP+'co_'+tag+'3.png'});
console.log(tag,errs); await ctx.close() }
await b.close()})();
