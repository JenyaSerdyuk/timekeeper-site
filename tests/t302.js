const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [n,o] of [['d1440',{viewport:{width:1440,height:900}}],['p390',{...devices['iPhone 13']}]]){
const ctx=await b.newContext(o);const p=await ctx.newPage();await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{const m={};const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let t;while(t=w.nextNode()){const e=t.parentElement;if(!e||!t.data.trim()||e.closest('.intro,.outro,#nav,script,style,.le-ui,.te-bar,.te-tog'))continue;if(!e.getClientRects().length)continue;const c=getComputedStyle(e);if(c.visibility==='hidden')continue;const k=c.fontSize+' '+c.fontFamily.split(',')[0].replace(/"/g,'')+' '+c.fontWeight;(m[k]=m[k]||[]).push(t.data.trim().slice(0,40)+' @'+((e.closest('[id]')||{}).id||''))}return Object.fromEntries(Object.entries(m).map(([k,v])=>[k,v.length+' e.g. '+v.slice(0,3).join(' | ')]))});
console.log(n);for(const [k,v] of Object.entries(r).sort((a,b)=>parseFloat(a[0])-parseFloat(b[0])))console.log('  ',k,'::',v);await ctx.close()}
await b.close()})();
