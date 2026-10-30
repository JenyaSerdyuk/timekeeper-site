const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8766/',{waitUntil:'networkidle'});await p.waitForTimeout(3000);
const pos=()=>p.evaluate(()=>['lPhr','rsvForm'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return id+':'+Math.round(r.top)+' T='+document.getElementById(id).style.translate}).join(' '));
console.log('A',await pos());
await p.evaluate(()=>window.dispatchEvent(new Event('resize')));await p.waitForTimeout(500);console.log('B',await pos());
await b.close()})();
