const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const o={};['lTag','lPhr','rsvForm','iModes'].forEach(id=>{const r=document.getElementById(id).getBoundingClientRect();o[id]=[Math.round(r.width),Math.round(r.height)]});o.fs=getComputedStyle(document.getElementById('lTag')).fontSize;o.lh=getComputedStyle(document.getElementById('lTag')).lineHeight;return o}));
await b.close()})();
