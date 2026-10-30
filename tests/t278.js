const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const o={};const g=(n,el)=>{if(!el)return;const c=getComputedStyle(el);o[n]=[c.fontFamily.split(',')[0],c.fontSize,c.fontWeight,c.color,c.letterSpacing]};
g('tag',document.getElementById('lTag'));g('phr',document.getElementById('lPhr'));g('ul',document.querySelector('#lTag .ul'));g('rsvlabel',document.querySelector('#rsvForm .rsv-cta')||document.querySelector('#rsvForm label'));g('rsvbtn',document.querySelector('#rsvForm button'));g('mode',document.querySelector('#iModes button'));g('cap',document.getElementById('iL').querySelector('.cap'));
o.formHTML=document.getElementById('rsvForm').outerHTML.slice(0,600);return o}));
await b.close()})();
