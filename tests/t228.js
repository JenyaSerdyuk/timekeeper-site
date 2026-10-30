const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const u of ['http://localhost:8766/','http://localhost:8767/'])for(const w of [1440,390]){const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1000);
console.log(u.slice(-5),w,errs.join(';'));console.log(await p.evaluate(()=>[...document.querySelectorAll('button.q')].map(b=>{const blk=b.closest('p,li,h2,h3,figcaption,label');const t=blk.textContent;const ok=blk.lastChild===b.parentNode||blk.lastChild===b;const lines=b.parentNode.getClientRects().length;return (ok?'END':'MID')+' rects'+lines+' …'+t.slice(-50)}).join('\n')));await p.close()}
await b.close()})();
