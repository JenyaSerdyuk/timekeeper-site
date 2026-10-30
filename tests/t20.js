const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [vp,tag] of [[{width:1440,height:900},'d'],[{width:390,height:844},'m']]){
const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m'});
const p=await ctx.newPage(); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html#explain',{waitUntil:'load'}); await p.waitForTimeout(2000);
await p.evaluate(()=>{document.getElementById('nav').style.display='none'});
const secs=await p.$$('.cw-o > section, .cw-o > div.motto, .cw-o section');
let i=0; const seen=new Set();
for(const s of secs){ const id=await s.evaluate(e=>e.id||e.className); if(seen.has(id)) continue; seen.add(id);
  const bb=await s.boundingBox(); if(!bb||bb.height<20) continue;
  await s.screenshot({path:SP+'A_'+tag+'_'+String(i).padStart(2,'0')+'.png'}); i++; }
console.log(tag,i); await ctx.close() }
await b.close()})();
