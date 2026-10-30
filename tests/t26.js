const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m'});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html#outro',{waitUntil:'load'}); await p.waitForTimeout(800);
await p.evaluate(()=>{ window._navJump=true; const y=document.getElementById('ll').getBoundingClientRect().top+scrollY-120; window._lenis.scrollTo(y,{immediate:true,force:true}); document.getElementById('nav').style.display='none' }); await p.waitForTimeout(1500);
const lanes=()=>p.evaluate(()=>{ const v=document.getElementById('llView').getBoundingClientRect(); const it=[...document.querySelectorAll('.ll-it')].filter(e=>!e.classList.contains('hid')).map(e=>e.getBoundingClientRect()).filter(r=>r.right>v.left&&r.left<v.right); const m={}; it.forEach(r=>{const k=Math.round(r.top/20); m[k]=(m[k]||0)+1}); return JSON.stringify(m) });
const el=await p.$('#ll');
const res=[await lanes()]; await el.screenshot({path:SP+'lz_'+tag+'0.png'});
for(let i=0;i<5;i++){ await p.click('#llIn'); await p.waitForTimeout(900); res.push(await lanes()); }
await el.screenshot({path:SP+'lz_'+tag+'5.png'});
console.log(tag,res.join(' | '),errs); await ctx.close() }
await b.close()})();
