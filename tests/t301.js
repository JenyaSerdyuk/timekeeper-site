const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [n,o] of [['d1440',{viewport:{width:1440,height:900}}],['d1920',{viewport:{width:1920,height:1080}}],['p390',{...devices['iPhone 13']}]]){
const ctx=await b.newContext(o);const p=await ctx.newPage();await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
console.log(n,JSON.stringify(await p.evaluate(()=>{const out={};const seen=new Map();
document.querySelectorAll('main p, section p, .cw p, li, h2, h3, .cw .t, figcaption').forEach(e=>{if(!e.offsetParent||e.closest('.intro,.outro,#nav'))return;const c=getComputedStyle(e);const k=e.tagName+'.'+(e.className||'').toString().split(' ')[0]+' in #'+((e.closest('[id]')||{}).id||'');const v=c.fontSize+'/'+c.lineHeight+' '+c.fontFamily.split(',')[0]+' '+c.textAlign;if(!seen.has(k))seen.set(k,v)});return Object.fromEntries([...seen].slice(0,60))})));await ctx.close()}
await b.close()})();
