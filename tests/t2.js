const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-claude/a45a2340-2bd1-5ade-9aa0-7c944c85ba5a/scratchpad/ux/';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
await p.route(/jsdelivr|gstatic|googleapis/,r=>r.abort());
let bytes=0,n=0; const cdp=await ctx.newCDPSession(p); await cdp.send('Network.enable'); cdp.on('Network.loadingFinished',e=>{bytes+=e.encodedDataLength;n++});
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(2500);
console.log('initial MB',(bytes/1e6).toFixed(2),'req',n);
// deep link
const p2=await ctx.newPage(); await p2.route(/jsdelivr|gstatic|googleapis/,r=>r.abort()); await p2.goto('http://localhost:8765/tk_test.html#device',{waitUntil:'load'}); await p2.waitForTimeout(2500);
console.log('deeplink y',await p2.evaluate(()=>scrollY),'device',await p2.evaluate(()=>Math.round(document.getElementById('device').getBoundingClientRect().top+scrollY)));
await p2.waitForTimeout(3000); console.log('MB after device',(bytes/1e6).toFixed(2));
await p2.screenshot({path:SP+'q_device.png'});
// editions + reserve
await p2.evaluate(()=>document.getElementById('pForm').scrollIntoView({block:'center'})); await p2.waitForTimeout(500);
await p2.click('#pEds button:nth-child(3)'); await p2.check('#pGift'); await p2.fill('#pEmail','a@b.co'); await p2.click('#pBtn'); await p2.waitForTimeout(1500);
console.log('ok:',await p2.textContent('#pOk'));
await p2.evaluate(()=>document.querySelector('.dbuy').scrollIntoView({block:'start'})); await p2.evaluate(()=>scrollBy(0,-70)); await p2.waitForTimeout(400);
await p2.screenshot({path:SP+'q_card.png'});
// ? popup
const qs=await p2.$$('#pNote .q'); await qs[0].click(); await p2.waitForTimeout(400); await p2.screenshot({path:SP+'q_pop.png'});
await p2.mouse.click(10,10); await p2.waitForTimeout(300); console.log('pop closed',await p2.evaluate(()=>!document.querySelector('.qpop')));
// explain ?
await p2.evaluate(()=>document.getElementById('explain').scrollIntoView()); await p2.waitForTimeout(400);
await p2.click('#explain .q'); await p2.waitForTimeout(400); await p2.screenshot({path:SP+'q_pop2.png'});
// timeless link
await p2.evaluate(()=>document.querySelector('#timeless .tl-r[data-d="2"]').click()); await p2.waitForTimeout(1500);
console.log('after tl link: name',await p2.textContent('#pName'),'ed',await p2.evaluate(()=>document.querySelector('#pEds [aria-pressed=true]').textContent),'y',await p2.evaluate(()=>scrollY));
// order now from outro (no lenis)
await p2.evaluate(()=>scrollTo(0,document.getElementById('outro').getBoundingClientRect().top+scrollY-300)); await p2.waitForTimeout(400);
for(let i=0;i<14;i++){ await p2.mouse.wheel(0,500); await p2.waitForTimeout(300);} 
await p2.evaluate(()=>document.getElementById('oOrder').click()); await p2.waitForTimeout(1500);
console.log('order now y',await p2.evaluate(()=>scrollY));
console.log('qcount',await p2.evaluate(()=>document.querySelectorAll('.q').length),'errs',errs);
await b.close()})();
