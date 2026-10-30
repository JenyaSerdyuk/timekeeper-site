const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const u of ['http://localhost:8766/','http://localhost:8767/'])for(const [w,h] of [[1920,1080],[1440,900],[1280,720],[1024,768]]){const p=await b.newPage({viewport:{width:w,height:h}});
await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
console.log(u.slice(-5),w, await p.evaluate(()=>{const t=document.getElementById('lTag'),ph=document.getElementById('lPhr');const fs=parseFloat(getComputedStyle(t).fontSize);
 const pr=document.createElement('span');pr.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit';
 const nt=t.querySelector('.lt-new').cloneNode(true);nt.querySelectorAll('.ltag3').forEach(e=>e.remove());pr.innerHTML=nt.innerHTML;t.appendChild(pr);const Lm=pr.getBoundingClientRect().width;
 pr.innerHTML=t.querySelector('.ltag3').innerHTML;const L3=pr.getBoundingClientRect().width;pr.remove();
 const n=ph.cloneNode(true);n.querySelectorAll('.pl2,.pdot,.pbr').forEach(e=>e.remove());pr.innerHTML=n.innerHTML;ph.appendChild(pr);const L1=pr.getBoundingClientRect().width;pr.innerHTML=ph.querySelector('.pl2').innerHTML;const L2=pr.getBoundingClientRect().width;pr.remove();
 return JSON.stringify({fs,W:t.clientWidth,Lm:Math.round(Lm),L3:Math.round(L3),phr1:Math.round(L1),phr2:Math.round(L2)})}));await p.close()}
await b.close()})();
