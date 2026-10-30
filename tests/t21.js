const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:390,height:844},'m'],[{width:1440,height:900},'d']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m',deviceScaleFactor:2});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html#device',{waitUntil:'load'}); await p.waitForTimeout(1500);
await p.click('#dtabs button:nth-child(3)'); await p.waitForTimeout(400); await p.click('#vtabs button:nth-child(2)'); 
await p.evaluate(()=>document.getElementById('stage3d').scrollIntoView({block:'center'})); await p.waitForTimeout(800);
await p.screenshot({path:SP+'wa_'+tag+'0.png'}); await p.waitForTimeout(4000); await p.screenshot({path:SP+'wa_'+tag+'1.png'});
console.log(tag,errs); await ctx.close() }
await b.close()})();
