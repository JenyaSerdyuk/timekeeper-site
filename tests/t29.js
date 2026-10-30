const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m'});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(1000);
await p.mouse.wheel(0,100); await p.waitForTimeout(200); await p.mouse.wheel(0,100);
await p.waitForTimeout(4300); for(let i=0;i<6;i++){ await p.screenshot({path:SP+"rv_"+tag+i+".png"}); await p.waitForTimeout(600); }
console.log(tag,errs); await ctx.close() }
await b.close()})();
