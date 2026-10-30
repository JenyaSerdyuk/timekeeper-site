const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});const p=await ctx.newPage();
await p.goto(process.argv[2],{waitUntil:'networkidle'});await p.waitForTimeout(1200);
// list text blocks that are centered with several lines
const r=await p.evaluate(()=>{const out=[];document.querySelectorAll('p,h2,h3,li,figcaption').forEach(e=>{const cs=getComputedStyle(e);if(e.offsetParent===null)return;const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.3;const lines=Math.round(e.getBoundingClientRect().height/lh);if(lines>=2&&(cs.textAlign==='center'||cs.textAlignLast==='center'&&cs.textAlign!=='justify'))out.push(cs.textAlign+'/'+cs.textAlignLast+' '+lines+'L '+(e.closest('section')?.id||e.closest('section')?.className||'')+': '+e.textContent.trim().slice(0,60))});return out});
console.log(r.join('\n'));await b.close()})();
