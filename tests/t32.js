const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m',deviceScaleFactor:2});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.addInitScript(()=>{ localStorage.setItem('tk_start',String(Date.now()-2592000e3)) });
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(800);
console.log(tag,'yours:',await p.textContent('#yours'));
await p.evaluate(()=>{ window._navJump=true; const o=document.getElementById('outro'); const y=o.offsetTop+(o.offsetHeight-innerHeight)*0.02; window._lenis.scrollTo(y,{immediate:true,force:true}); }); await p.waitForTimeout(1200);
await p.evaluate(()=>{window._navJump=false});
await p.click('.omodes button[data-m="life"]'); await p.selectOption('#obD','15'); await p.selectOption('#obM','5'); await p.selectOption('#obY','1995'); await p.waitForTimeout(700);
await p.screenshot({path:SP+'sel_'+tag+'.png'});
console.log(tag,errs); await ctx.close() }
await b.close()})();
