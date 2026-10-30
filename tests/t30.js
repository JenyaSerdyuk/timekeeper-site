const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1440,height:900}}); await p.route(/gstatic|googleapis/,r=>r.abort());
await p.goto('http://localhost:8765/tk_test.html',{waitUntil:'load'}); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>['lTag','lPhr'].map(id=>{const e=document.getElementById(id); const cs=getComputedStyle(e); const r=e.getBoundingClientRect(); return {id,fs:cs.fontSize,w:r.width,left:r.left,h:r.height,lh:cs.lineHeight,ta:cs.textAlign,tal:cs.textAlignLast,tw:cs.textWrap,styleW:e.style.width}})));
console.log(await p.evaluate(()=>({pw:document.querySelector('#scene img')&&0})));
await b.close()})();
